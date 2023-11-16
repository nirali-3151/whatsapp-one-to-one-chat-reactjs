import React, { useContext } from "react";
import { auth, db } from "../../firebase";
import { signOut } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../Authentication/Auth";

import { Link } from "react-router-dom";

const Navbar = () => {
  const history = useHistory();
  const { user } = useContext(AuthContext);

  const handleSignout = async () => {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      isOnline: false,
    });
    console.log("auth.currentUser.uid", auth.currentUser.uid);
    await signOut(auth);
    history.replace("/login");
  };

  return (
    <div >
      <div className="header1">
        <p className="logo">
          <i className="fas fa-comment-dots"></i> Chatiie{" "}
        </p>

        <nav className="navbar1">
          {user ? (
            <>
              {/* <Link to="/profile">Profile</Link> */}
              {/* <Link to="/login">Logout</Link> */}

              <button className="btn1" onClick={handleSignout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </>
          )}
          {/* <Link to="/login">Login</Link>
            <Link to="/register">Register</Link> */}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
