import {useState, useEffect, createContext, useContext } from 'react'
import { message } from 'antd'

const LOCALSTORAGE_KEY = "save-me";
const savedMe = localStorage.getItem(LOCALSTORAGE_KEY);

const ChatContext = createContext({
  status: {},
  me: "",
  signedIn: false,
  messages: [],
  sendMessage: () => {},
  clearMessages: () => {},
});

const client = new WebSocket('ws://localhost:4000')
client.onopen = () => console.log('Backend socket server connected!')

const ChatProvider = (props) => {

  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState({});
  const [me, setMe] = useState(savedMe || "");
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    if (signedIn) {
      localStorage.setItem(LOCALSTORAGE_KEY, me);
    }
  }, [me, signedIn]);

  client.onmessage = (byteString) => {
    const { data } = byteString;
    const [task, payload] = JSON.parse(data);

    switch (task) {
      case "init": {
        setMessages(() => [... payload]);
        break;
      }
      case "output": {
        setMessages(() => [...messages, ...payload]); 
        break; 
      }
      case "status": {
        console.log(payload)
        setStatus(payload); 
        break; 
      }
      case "cleared": {
        setMessages([]);
        break;
      }
      default: break;
    }
  }

  const displayStatus = (s) => {
    if (s.msg) {
      const { type, msg } = s;
      const content = { content: msg, duration: 0.5 };

      switch (type) {
        case 'success':
          message.success(content)
          break
        case 'info':
          message.info(content)
          break
        case 'error':
        default:
          message.error(content)
          break
      }
    }
  }

  const startChat = (name, to) => {
    if (!name || !to) throw new Error('Name or to required.')
    sendData({
      type : 'CHAT',
      payload: { name, to }
    });
  }

  const sendData = async (data) => {
    await client.send(JSON.stringify(data));
  }

  const sendMessage = (name, to, body) => {
    if (!name || !to || !body) 
      throw new Error('Name or to or body required.')
    sendData({
      type: 'MESSAGE',
      payload: {name, to, body}
    });
   }

  const clearMessages = () => {
    sendData(["clear"]);
  }

  return (
    <ChatContext.Provider
      value={{
        status, me, signedIn, messages, setMe, setSignedIn,
        sendMessage, startChat, displayStatus
      }}
      {...props}
    />
  );
};

const useChat = () => useContext(ChatContext);
export { ChatProvider, useChat };