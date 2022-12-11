import WebSocket from 'ws';
import { MessageModel, UserModel, ChatBoxModel } from './models/chatbox'

const makeName =
  (name, to) => { return [name, to].sort().join('_'); };

const sendData = (data, ws) => 
  { ws.send(JSON.stringify(data)); }

const sendStatus = (payload, ws) => 
  { sendData(["status", payload], ws); }

const validateChatBox = async (name, participants) => {
  let box = await ChatBoxModel.findOne({ name });
  if (!box)
    box = await new ChatBoxModel({ name, users: participants }).save();
  return box.populate(["messages"]);
}; 

const broadcastMessage = (set, data, status) => {
  set.forEach((client) => {
    if (client.readyState === WebSocket.CLOSED)
      set.delete(client)
    else{
      sendData(data, client);
      sendStatus(status, client);
    }
  });
};

const chatBoxes = {};

export default {

  onMessage: (wss, ws) => (
    async (byteString) => {
      const { data } = byteString
      const {type, payload} = JSON.parse(data)

      switch (type) {

        case 'CHAT':{
          const {name, to} = payload
          const chatName = makeName(name, to)
          const chatBox = await validateChatBox(chatName, [name, to])

          if (ws.box !== "" && chatBoxes[ws.box]){
            // user(ws) was in another chatbox
            chatBoxes[ws.box].delete(ws);
          }

          if (!chatBoxes[chatName])
            chatBoxes[chatName] = new Set();

          ws.box = chatName
          chatBoxes[chatName].add(ws);
          
          let data = []
          chatBox.messages.map((m) => (data.push({name: m.sender, body: m.body})))
          const status = { type: 'info', msg: 'Chat started.'}
          broadcastMessage(chatBoxes[chatName], ["init", data], status)
          break
        }

        case 'MESSAGE':{
          const {name, to, body} = payload
          const chatName = makeName(name, to)

          const msg = await new MessageModel({ sender: name, body: body}).save();
          await ChatBoxModel.updateOne({ name : chatName }, 
            {$push: {messages : msg._id.toString()}});

          const status = { type: 'success', msg: 'Message sent.'}
          broadcastMessage(chatBoxes[chatName], ["output", [{name: name, body: body}]], status)
          break;
        }

        default : break
      }
    })
}