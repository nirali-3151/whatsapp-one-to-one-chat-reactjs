import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    Timestamp,
    orderBy,
    setDoc,
    doc,
    getDoc,
    updateDoc,
    getDocs,
    deleteDoc,
    limit,
    startAfter,
    endBefore,
    startAt,
    limitToLast
} from 'firebase/firestore'

import {
    ref,
    getDownloadURL,
    uploadBytes,
    deleteObject
} from "firebase/storage";

import {
    auth,
    db,
    storage
} from "../../firebase"

import { signOut } from "firebase/auth";

let url;
//get avilable user when load a page
export const getAvilableUser = async (user1) => {
    return new Promise(async (resolve, reject) => {
        const userRef = collection(db, "users")
        const q = query(userRef, where("uid", "not-in", [user1]));
        const unsub = onSnapshot(q, (querySnapshot) => {
            let users = [];
            querySnapshot.forEach((doc) => {
                users.push(doc.data());
            });
            resolve(users)
        });
    })
}

//sign Out from Home Page
export const selectSignOut = async () => {
    return new Promise(async (resolve, reject) => {
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
            isOnline: false,
        });
        console.log("auth.currentUser.uid", auth.currentUser.uid);
        await signOut(auth);
        resolve()
    })
}


//select user when use click on perticular name
export const selectUserWithPerticularId = async (id) => {
    return new Promise(async (resolve, reject) => {
        const msgsRef = collection(db, "messages", id, "chat");
        const q = query(msgsRef, orderBy("createdAt", "asc"));
        onSnapshot(q, (querySnapshot) => {
            let msgs = [];
              const unsub =  querySnapshot.forEach((doc) => {
                    msgs.push(doc.data());
                });
    
                console.log("msgs are " , msgs);
                resolve(msgs)
                // this.props.getMessagesAction1(msgs)
            });
          
    
        // const unsub1 =
        //     onSnapshot(q, (snapshot) => {
        //         const data2 = snapshot.docs.map((doc) => ({
        //             id: doc.id,
        //             ...doc.data(),
        //         }));

        //         console.log("data2 is" ,data2);
        //         resolve(data2)
        //     });


        // const docSnap = await getDoc(doc(db, "lastMsg", id));
        // if (docSnap.data() && docSnap.data().from !== user1) {
        //     await updateDoc(doc(db, "lastMsg", id), { unread: false });
        // }

    })
}

//set images
export const storeImage = async (img) => {
    return new Promise(async (resolve, reject) => {
        const imgRef = ref(
            storage,
            `images/${new Date().getTime()} - ${img.name}`
        );
        const snap = await uploadBytes(imgRef, img);
        const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
        url = dlUrl;
        resolve(url)
    })
}

//send normal text message
export const sendNormalMsg = async (id, text, user1, user2) => {
    return new Promise(async (resolve, reject) => {
        const data1 = collection(db, "messages", id, "chat")
        const data2 = doc(data1)
        const data3 = {
            name: "",
            text1: "",
            text,
            from: user1,
            to: user2,
            deleted: "",
            createdAt: Timestamp.fromDate(new Date()),
            media: url || ""
        }
        await setDoc(data2, { ...data3, msg_id: data2.id });
        resolve(data2)
    })
}

// send text msg i reply to the my msg
export const sendReplyMsgToMe = async (id, text, msg_id, user1, user2) => {
    return new Promise(async (resolve, reject) => {
        const data1 = collection(db, "messages", id, "chat")
        const data2 = doc(data1)
        const data3 = {
            name: "Nirali",
            text1: msg_id.text,
            text,
            from: user1,
            to: user2,
            deleted: "",
            createdAt: Timestamp.fromDate(new Date()),
            media: url || ""
        }

        await setDoc(data2, { ...data3, msg_id: data2.id });
        resolve(data2)
    })
}

// send text msg i reply to the friend msg
export const sendReplyMsgToFriend = async ( id,chat, text, msg_id, user1, user2) => {
    return new Promise(async (resolve, reject) => {
        const data1 = collection(db, "messages", id, "chat")
        const data2 = doc(data1)
        const data3 = {
            name: chat.name,
            text1: msg_id.text,
            text,
            from: user1,
            to: user2,
            deleted: "",
            createdAt: Timestamp.fromDate(new Date()),
            media: url || ""
        }
        await setDoc(data2, { ...data3, msg_id: data2.id });
        resolve(data2)
    })
}

//set last message
export const setLastReply = async (id, text, user1, user2) => {
    return new Promise(async (resolve, reject) => {
        const data = await setDoc(doc(db, "lastMsg", id), {
            text,
            from: user1,
            to: user2,
            deleted: "",
            createdAt: Timestamp.fromDate(new Date()),
            media: url || "",
            unread: true,
        });

        // console.log("data is in setLastReply" ,data);
        resolve(data)
    })
}

//delete message only from me
export const deleteMsgOnlyMe = async (id, msgs, user1, user2) => {
    return new Promise(async (resolve, reject) => {
        const msgsRef = collection(db, "messages", id, "chat");
        const q = query(msgsRef, orderBy("createdAt", "asc"));

        const data = await getDocs(q)

        console.log("data" , data);
        // msgs.map((msg, i) => (
        //     msg.deleted !== "" ?
        //         data.forEach((doc) => {
        //             console.log("-------if----------");
        //             deleteDoc(doc.ref)
        //         })
        //         :
        //         data.forEach((doc) => {
        //             console.log("-------else----------");
        //             updateDoc(doc.ref,
        //                 { deleted: user1 }
        //             )
        //         })
        // ))
        resolve(data)
    })
}

//delete message in both
export const deleteMsgInBothUsers = async (id, msg) => {
    return new Promise(async (resolve, reject) => {
        const msgsRef = collection(db, "messages", id, "chat");
        const msgsRef1 = doc(msgsRef, msg.msg_id)
        await deleteDoc(msgsRef1)
        resolve(msgsRef1)
    })
}

export const deleteMsgOnlyMeWithId = async (id, msg, user1, user2) => {
    return new Promise(async (resolve, reject) => {
        const msgsRef = collection(db, "messages", id, "chat");
        const msgsRef1 = doc(msgsRef, msg.msg_id)
        await deleteDoc(msgsRef1)
        resolve(msgsRef1)
    })
}

export const deleteMsgOnlyMeWithId1 = async (id, msg, user1, user2) => {
    return new Promise(async (resolve, reject) => {
        const msgsRef = collection(db, "messages", id, "chat");
        // console.log("msgsRef", msgsRef);
        const msgsRef1 = doc(msgsRef, msg.msg_id)

        // console.log("msgsRef1", msgsRef1);

        await updateDoc(msgsRef1,
            { deleted: user1 }
        )

    })
}

//change user profile Data
export const getLoginUserData = async () => {
    return new Promise(async (resolve, reject) => {
        const msgsRef = collection(db, "users");
        const q = query(msgsRef, where("uid", "==", auth.currentUser.uid));
        onSnapshot(q, (snapshot) => {
            const user = snapshot.docs.map((doc) => (
                doc.data()
            ));
            resolve(user[0])
        });


        // getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
        //     console.log("docSnap.data() ", docSnap.data());
        //     if (docSnap.exists) {
        //         const user = docSnap.data()
        //         resolve(user)
        //     }
        // });
    })
}

//set user profile
export const setUserProfile = async (profile_user, img_profile) => {
    return new Promise(async (resolve, reject) => {
        const imgRef = ref(
            storage,
            `avatar/${new Date().getTime()} - ${img_profile.name}`
        );

        try {
            if (profile_user.avatarPath) {
                await deleteObject(ref(storage, profile_user.avatarPath));
            }
            const snap = await uploadBytes(imgRef, img_profile);
            const url = await getDownloadURL(ref(storage, snap.ref.fullPath));

            await updateDoc(doc(db, "users", auth.currentUser.uid), {
                avatar: url,
                avatarPath: snap.ref.fullPath,
            });

        } catch (err) {
            console.log(err.message);
        }
        resolve(img_profile)
    })
}


export const getNextPaginateData = async (id,lastVisible, limitPerPage ) => {
    return new Promise(async (resolve, reject) => {

        const data1 = collection(db, "messages", id, "chat")

        const q = query(data1,orderBy("createdAt", "desc"), startAfter(lastVisible.createdAt), limit(limitPerPage))
        const data = await getDocs(q);
        const data2 = (data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        resolve(data2)
    })
}