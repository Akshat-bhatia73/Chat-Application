import React, { useContext, useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

export default function Chatlist() {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    //getting data of all the chats current user has with another user
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });
      return () => {
        unsub();
      };
    };
    //Whenever the current user changes we get their chats
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (user) => {
    //When a chat is selected the state in chat context is updated
    dispatch({ type: "CHANGE_USER", payload: user });
  };

  return (
    <div className="chatList">
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => {
          return (
            <div
              className="userChat"
              onClick={() => handleSelect(chat[1].userInfo)}
              key={chat[0]}
            >
              <img src={chat[1].userInfo.photoURL} alt="" />
              <div className="userChatInfo">
                <span className="user">{chat[1].userInfo.displayName}</span>
                <p className="recentMessage">
                  {chat[1].lastMessage?.text.length > 50
                    ? `${chat[1].lastMessage?.text.slice(0, 50)}...`
                    : chat[1].lastMessage?.text}
                </p>
              </div>
            </div>
          );
        })}
    </div>
  );
}
