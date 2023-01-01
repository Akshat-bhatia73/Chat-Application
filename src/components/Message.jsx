import { Timestamp } from "firebase/firestore";
import React, { useContext, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

export default function Message({ message }) {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  //To always be on the most recent message we use ref
  const ref = useRef();

  //To always scroll back to the latest message whenever a new message is sent
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
      className={`message ${
        message.senderId === currentUser.uid ? "owner" : ""
      }`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span className="time">
          {/* This is to displaye the time for the messages sent on the current day. */}
          {message.date.toDate().toDateString() ===
          Timestamp.now().toDate().toDateString()
            ? message.date.toDate().toLocaleTimeString()
            : message.date.toDate().toDateString().slice(4)}
        </span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  );
}
