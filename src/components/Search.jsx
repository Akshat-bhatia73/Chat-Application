import React, { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

export default function Search() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);
  
  const handleChange = (e) => {
    setUsername(e.target.value);
  };
  const handleSearch = async () => {
    //When the query is executed and a user with the searched username is found then the user state is updated
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (error) {
      setErr(true);
    }
  };

  const handleKey = (event) => {
    if (event.code === "Enter") handleSearch();
  };

  const handleSelect = async () => {
    //Check whether chats already exists or not
    const combinedID =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedID));
      //if not create chat
      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedID), { messages: [] });
        //create userChats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedID + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedID + ".date"]: serverTimestamp(),
        });
        //This is for other user
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedID + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedID + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {
      setErr(true);
    }
    setUser(null);
    setUsername("");
  };

  return (
    <div className="searchBar">
      <div className="searchForm">
        <div className="ui left icon input">
          <input
            type="text"
            placeholder="Search user or start a new chat "
            value={username}
            onKeyDown={handleKey}
            onChange={handleChange}
          />
          <i className="search icon"></i>
        </div>
        {err ? <span className="error">User not found..</span> : ""}

        {user ? (
          <div className="userChat" onClick={handleSelect}>
            <img src={user.photoURL} alt="" />
            <div className="userChatInfo">
              <span className="user">{user.displayName}</span>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
