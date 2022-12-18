const Query = {
  chatBox: async (parent, { name1, name2 }, { ChatBoxModel }) => {
    const name = [name1, name2].sort().join('_');    
    let box = await ChatBoxModel.findOne({ name });
    if (!box && name2)
    box = await new ChatBoxModel({ name }).save();
    return box;
  },
};
    
export default Query;
