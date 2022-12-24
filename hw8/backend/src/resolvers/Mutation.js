import ChatBoxModel from '../models/chatbox'

const makeName =
  (name, to) => { return [name, to].sort().join('_'); };

const validateChatBox = async (name, to) => {
  const chatBoxName = makeName(name, to);
  let box = await ChatBoxModel.findOne({ name: chatBoxName });
  return box
}; 

const Mutation = {

  createMessage: async (parent, { from, to, body }, { pubsub } ) => {

    const chatBox = await validateChatBox(from, to);
    const newMsg = { sender: from, body };
    chatBox.messages.push(newMsg);
      await chatBox.save();
    const chatBoxName = makeName(from, to);

    pubsub.publish(`chatBox ${chatBoxName}`, {
      message: newMsg,
    });
    return newMsg;
},
};

export { Mutation as default };
