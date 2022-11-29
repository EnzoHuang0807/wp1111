import Message from './models/message'
import { MessageModel, UserModel, ChatBoxModel } from './models/chatbox'

const makeName =
  (name, to) => { return [name, to].sort().join('_'); };

const sendData = (data, ws) => 
  { ws.send(JSON.stringify(data)); }

const validateUser = async (name) => {
  let user = await UserModel.findOne({ name });
  if (!user)
    user = await new UserModel({name}).save();
  return user._id.toString()
}

const validateChatBox = async (name, participants) => {
  let box = await ChatBoxModel.findOne({ name });
  if (!box)
    box = await new ChatBoxModel({ name, users: participants }).save();
  return box.populate(["users", {path: 'messages', populate: 'sender'}]);
}; 

const sendStatus = (payload, ws) => 
  { sendData(["status", payload], ws); }

const broadcastMessage = (set, data, status) => {
  set.forEach((client) => {
    sendData(data, client);
    sendStatus(status, client);
  });
};

const chatBoxes = {};

export default {

  initData: (ws) => {
    Message.find().sort({ created_at: -1 }).limit(100)
      .exec((err, res) => {
        if (err) throw err;
        // initialize app with existing messages
        sendData(["init", res], ws);
    });
  },
    
  onMessage: (wss, ws) => (
    async (byteString) => {
      const { data } = byteString
      const {type, payload} = JSON.parse(data)

      switch (type) {

        case 'CHAT':{
          const {name, to} = payload
          const chatName = makeName(name, to)
          const nameID = await validateUser(name)
          const toID = await validateUser(to)
          const chatBox = await validateChatBox(chatName, [nameID, toID])

          if (ws.box !== "" && chatBoxes[ws.box])
            // user(ws) was in another chatbox
            chatBoxes[ws.box].delete(ws);
          if (!chatBoxes[chatName])
            chatBoxes[chatName] = new Set();

          ws.box = chatName
          chatBoxes[chatName].add(ws);
          
          let data = []
          chatBox.messages.map((m) => (data.push({name: m.sender.name, body: m.body})))
          const status = { type: 'success', msg: 'Chat started.'}
          broadcastMessage(chatBoxes[chatName], ["init", data], status)
          break
        }

        case 'MESSAGE':{
          const {name, to, body} = payload
          const chatName = makeName(name, to)
          let sender = await UserModel.findOne({ name });
          let box = await ChatBoxModel.findOne({ name: chatName });

          const msg = await new MessageModel({chatBox: box._id, sender:sender._id, body: body}).save();
          await ChatBoxModel.updateOne({ name : chatName }, 
            {$set: {messages : [... box.messages, msg._id.toString()]}});

          const status = { type: 'success', msg: 'Message sent.'}
          broadcastMessage(chatBoxes[chatName], ["output", [{name: name, body: body}]], status)
          break;
        }

        default : break
      }
    })
}