import styled from 'styled-components'
import { useState, useEffect, useRef } from 'react'
import { Input, Tabs} from 'antd'
import Title from '../Components/Title'
import Message from '../Components/Message'
import { useChat } from "./hooks/useChat";
import ChatModal from '../Components/ChatModal'

const ChatBoxesWrapper = styled(Tabs)`
  width: 100%;
  height: 300px;
  background: #eeeeee52;
  border-radius: 10px;
  margin: 20px;
  padding: 20px;
  .ant-tabs-content-holder{
    overflow: auto;
    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background: grey;
      border-radius: 5px;
    }
  }
`;

const FootRef = styled.div`
  height: 40px;
`;

const ChatRoom = () => {
    const { me, activeKey, setActiveKey, displayStatus, messages, sendMessage } = useChat();
    const [body, setBody] = useState('')
    const [msgSent, setMsgSent] = useState(false)
    const [chatBoxes, setChatBoxes] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const msgFooter = useRef(null)

    const scrollToBottom = () => {
        msgFooter.current?.scrollIntoView
        ({ behavior: 'smooth', block: "start" });
    };

    useEffect(() => {
        scrollToBottom();
        setMsgSent(false);
    }, [msgSent]);

    useEffect(() =>{
      const index = chatBoxes.findIndex(({key}) => key === activeKey);

      if (index >= 0){
        let newChatBoxes = [];
        chatBoxes.map((c) => newChatBoxes.push({
          label: c.label, children: [], key: c.key }))

        newChatBoxes[index].children = renderChat(messages)
        setChatBoxes(newChatBoxes)
      }
    }, [messages, activeKey])

    const renderChat = (chat) => {
        if (!chat || chat.length === 0)
          return (<p style={{ color: '#ccc' }}> No messages... </p>) 
        
        return(
        <>
          {chat.map(({ sender, body }, key) => 
            ( <Message isMe={sender === me} message={body} key={key}/>))}
          <FootRef ref={msgFooter}/>
        </>)
    }

    const createChatBox = (friend) => {
        if (chatBoxes.some(({key}) => key === friend)) {
            throw new Error(friend +
            "'s chat box has already opened.");
        }
        setChatBoxes([...chatBoxes,
            { label: friend, 
              children: [],
              key: friend 
            }
        ]);
        setMsgSent(true);
        return friend;
    }

    const removeChatBox = (targetKey, activeKey) => {
      const index = chatBoxes.findIndex(({key}) => key === activeKey);
      const newChatBoxes = chatBoxes.filter(({key}) => key !== targetKey);
      const len = newChatBoxes.length;
      setChatBoxes(newChatBoxes);

      return (
        activeKey?
          activeKey === targetKey?
            len === 0?
            '' : newChatBoxes[(index - 1 >= 0) ? index - 1 : 0].key
          : activeKey
        : '');
    };

    return (
        <>
        <Title name={me}/>
        <ChatBoxesWrapper
          tabBarStyle={{height: '36px'}}
          type="editable-card"
          activeKey={activeKey}
          onChange ={(key) => {
            setActiveKey(key);
            setMsgSent(true);
          }}
          onEdit ={async (targetKey, action) => {
            if (action === 'add') setModalOpen(true);
            else if (action === 'remove') {
              const key = removeChatBox(targetKey, activeKey);
              setActiveKey(key);
              setMsgSent(true);
            }
          }}
          items={chatBoxes}
        />
        <ChatModal
          open={modalOpen}
          onCreate={({ name }) => {
            setActiveKey(createChatBox(name));
            setModalOpen(false);
            setMsgSent(true);
          }}
          onCancel={() => { setModalOpen(false); }}
        />

        <Input.Search
            value = {body}
            onChange = {(e) => setBody(e.target.value)}
            enterButton="Send"
            placeholder="Type a message here..."
            onSearch={(msg) => {
            if (!msg) {
              displayStatus({
                type: 'error',
                msg: 'Please enter a username and a message body.'
              })
            return
            }

            sendMessage({ variables: {
              from: me,
              to: activeKey,
              body: msg
            } })
            displayStatus({
              type: 'success',
              msg: 'Message sent.'
            })

            setMsgSent(true);
            setBody('')
        }}
        ></Input.Search>
      </>
    );
}

export default ChatRoom;