import React, { useContext } from "react";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";

export default function Chat() {
  //Data contains the info of user with which we are currently chatting
  const { data } = useContext(ChatContext);

  return (
    <div className="chatBox">
      <div className="chatInfo">
        <div className="user">
          <img src={data.user?.photoURL} alt="" />
          <span className="userName">{data.user?.displayName}</span>
        </div>
        <div className="chatIcons">
          <i className="video icon large"></i>
          <i
            className="phone volume icon large"
            style={{ transform: "rotate(-25deg)" }}
          ></i>
          <i className="ellipsis horizontal icon large" />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
}
