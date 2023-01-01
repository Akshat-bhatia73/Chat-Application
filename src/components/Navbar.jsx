import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";
export default function Navbar() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="navbar">
      <span className="user">
        <img src={currentUser.photoURL} alt="" />
        <span className="userName">{currentUser.displayName}</span>
      </span>
      <div>
        <button className="ui button" onClick={() => signOut(auth)}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
