import {useState, useEffect, createContext, useContext } from 'react'
import { message } from 'antd'
import { useQuery, useMutation } from "@apollo/client";
import { CHATBOX_QUERY, CREATE_MESSAGE_MUTATION, MESSAGE_SUBSCRIPTION } from "../../graphql";

const LOCALSTORAGE_KEY = "save-me";
const savedMe = localStorage.getItem(LOCALSTORAGE_KEY);

const ChatContext = createContext({
  me: "",
  setMe: () => {},
  activeKey: "",
  setActiveKey: () => {},
  signedIn: false,
  setSignedIn: () => {},
  messages: [],
  sendMessage: () => {},
  startChat: () => {},
  displayStatus: () => {}
});

const ChatProvider = (props) => {

  const [messages, setMessages] = useState([]);
  const [me, setMe] = useState(savedMe || "");
  const [activeKey, setActiveKey] = useState('');
  const [signedIn, setSignedIn] = useState(false);
  
  useEffect(() => {
    if (signedIn) {
      localStorage.setItem(LOCALSTORAGE_KEY, me);
    }
  }, [me, signedIn]);

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
  
  const { data, subscribeToMore, refetch } = useQuery(CHATBOX_QUERY, {
      variables: {
        name1: me,
        name2: activeKey,
      },
    }
  )

  if (data && data.chatBox && data.chatBox.messages !== messages){
      setMessages(data.chatBox.messages);
  }

  const [sendMessage] = useMutation(CREATE_MESSAGE_MUTATION);

  useEffect(() => {
    try {

      //Update query cache
      refetch({
        name1: me,
        name2: activeKey,
      })

      //subsricption
      const unsubscribe = subscribeToMore({
        document: MESSAGE_SUBSCRIPTION,
        variables: { from: me, to: activeKey },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const newMessage = subscriptionData.data.message;
          return {
            chatBox: {
              __typename: prev.chatBox.__typename, 
              name: prev.chatBox.name,
              messages: [...prev.chatBox.messages, newMessage],
            },
          };
        },
      });
      return () => unsubscribe();
    } catch (e) {}
  }, [subscribeToMore, activeKey]);

  return (
    <ChatContext.Provider
      value={{
        me, activeKey, signedIn, messages, setMe, setActiveKey,
        setSignedIn, sendMessage, displayStatus
      }}
      {...props}
    />
  );
};

const useChat = () => useContext(ChatContext);
export { ChatProvider, useChat };