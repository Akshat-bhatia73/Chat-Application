import {
  arrayUnion,
  Timestamp,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import { v4 as uuid } from "uuid";

export default function Input() {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    //if user is sending an image then we upload it on firebase and get a download url
    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              //Adding the new message to the messages array in chats database
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      //If no image is attahced to the message
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    //Here we update the last message and the date of most recent mesage in the userChats of both the sender and reciever to show updated message in the chat list
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    //Resetting the input and img after message is sent
    setText("");
    setImg(null);
  };

  return (
    <div className="messageBox">
      <input
        type="text"
        onKeyDown={(e) => {
          if (e.code === "Enter") handleSend();
        }}
        placeholder="Type Message.."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="send">
        <input
          type="file"
          id="imagefile"
          className="imageSelector"
          onChange={(e) => setImg(e.target.files[0])}
          style={{ display: "none" }}
        />
        <label htmlFor="imagefile">
          <i className="file image large icon" id="imagefile" />
        </label>

        <input
          type="file"
          id="file"
          className="fileSelector"
          style={{ display: "none" }}
        />
        <label htmlFor="file">
          <i className="paperclip icon large"></i>
        </label>
        <button className="ui button" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}
