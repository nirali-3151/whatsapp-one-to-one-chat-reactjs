import React, { useEffect, useState } from "react";
import Img from "../../image/image1.jpg";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../firebase";
import Moment from "react-moment";


const User = ({ user1, user, selectUser, chat }) => {
  const user2 = user?.uid;
  const [data, setData] = useState("");


  useEffect(() => {
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    let unsub = onSnapshot(doc(db, "lastMsg", id), (doc) => {
      setData(doc.data());
    });
    return () => unsub();
  }, []);

  return (
    <>
      <div
        className={`user_wrapper ${chat.name === user.name && "selected_user"}`}
        onClick={() => selectUser(user)}
      >
        <div className={(chat.uid === data?.from) ? "block active" : (data?.from !== user1 && data?.unread) ? "block unread" : " block active"}>
          <div className="imgBox">
            <img src={user.avatar || Img} alt="avatar" className="cover" />
          </div>
          <div className="details">
            <div className="listHead">
              <h4>{user.name}</h4>
              <p className="time">
                {data && (
                  <Moment fromNow>{data.createdAt.toDate()}</Moment>
                )}
              </p>
            </div>
            <div className="message_p">
              {data && (
                <p className="truncate">
                  {data.text}
                </p>
              )}
              {chat.uid === data?.from ? "" :
                 data?.from !== user1 && data?.unread && (
                  <b>N</b>
                )
               }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default User;
