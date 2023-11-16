import {
    collection,
    query,
    onSnapshot,
    Timestamp,
    orderBy,
    limit
} from 'firebase/firestore'

import ReactDOM from 'react-dom';

import Img from "../../image/image1.jpg";

import React, { Component } from 'react'
import {
    auth,
    db,
    storage
} from "../../firebase"

import InfiniteScroll from "react-infinite-scroll-component";

import User from './User'
import MessageForm from './MessageForm'
import Message from './Message'
import Profile from './Profile';
import PreviewImg from './PreviewImg';


import { useHistory } from 'react-router-dom';

import {
    selectSignOut,
    getAvilableUser,
    selectUserWithPerticularId,
    storeImage,
    sendNormalMsg,
    sendReplyMsgToMe,
    sendReplyMsgToFriend,
    setLastReply,
    deleteMsgOnlyMe,
    deleteMsgInBothUsers,
    deleteMsgOnlyMeWithId,
    deleteMsgOnlyMeWithId1,
    getLoginUserData,
    getNextPaginateData,
    setUserProfile
} from "../../firebaseAction/HomeAction"

import { connect } from "react-redux"
import {
    getUsersAction,
    getMessagesAction,
    append_new_msg_pagination
} from "../../ReduxStore/Actions/HomePage.Action"

class Home1 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            angle_down_flag: false,
            loader_profile_pic: false,
            dropDownMsg: false,
            profile_user: "",
            img: "",
            img_profile: "",
            chat: "",
            text: "",
            user1: auth.currentUser.uid,
            isEmoji: false,
            reply_msg: false,
            reply_msg1: false,
            msg_id: "",
            current_date: "",
            drop_down_flag: false,
            profile_flag: false,

            limitPerPage: 10,
            lastVisible: "",
        }
    }

    setProfile = async () => {
        const data = await getLoginUserData()
        this.setState({ profile_user: data })
    }

    componentDidUpdate(prevProps, prevState) {
        const { msg_id, chat } = this.state
        const { reply_msg } = this.state
        const { scrollTop, lastVisible } = this.state
        const { msgs } = this.props.homePage

        const isDiff = msg_id.msg_id === prevState.msg_id.msg_id && (reply_msg !== prevState.reply_msg)
        if (isDiff) {
            this.setFlagToReplyBack()
        }

        const isDiff1 = prevState.img_profile !== this.state.img_profile
        if (isDiff1) {
            this.setProfile()
        }

        const isDiff2 = prevState.profile_user.avatarPath !== this.state.profile_user.avatarPath
        if (isDiff2) {
            this.setState({ loader_profile_pic: false })
        }

        // const isDiff4 = scrollTop === 0 && chat !== "" && scrollTop !== prevState.scrollTop && lastVisible === prevState.lastVisible

        // if (isDiff4) {
        // this.getNextPageData()
        // }
    }

    handleScroll = event => {

        // console.log("----------------------handleScroll------------------------");
        let element = event.target

        const height = Math.round(element.clientHeight / 2);
        const width = Math.round(element.clientWidth / 3) - 15;


        // console.log("height is : ", height);
        // console.log("width is :", width);
        const isDiff = Math.abs(element.scrollHeight - element.clientHeight - element.scrollTop) < 1

        // console.log("element.scrollHeight", element.scrollHeight);
        // console.log("element.scrollTop", element.scrollTop);
        // console.log("element.clientHeight", element.clientHeight);

        this.setState({
            scrollTop: element.scrollTop,
            // scrollHeight: element.scrollHeight,
        });
    };


    componentDidMount() {
        console.log("----------------------componentDidMount---------------------");
        this.getUsers();
        this.setProfile();
    }

    getNextPageData = async () => {
        const { msgs } = this.props.homePage
        const { limitPerPage } = this.state
        const { user1 } = this.state
        const { chat, lastVisible } = this.state

        const user2 = chat.uid;
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

        const data1 = await getNextPaginateData(id, lastVisible, limitPerPage)

        let msg1 = data1

        this.props.append_new_msg_pagination1(msg1)

        const lastVisible1 = data1[data1.length - 1]
        this.setState({ lastVisible: lastVisible1 })
    }

    //get avilable user when load a page
    getUsers = async () => {
        const { user1 } = this.state
        const data = await getAvilableUser(user1)
        this.props.getUsersAction1(data)
    }

    //Select User with perticular id
    selectUser = async (user) => {
        const { user1 } = this.state
        const { chat, limitPerPage } = this.state
        const { msgs } = this.props.homePage

        this.setState({ chat: user })

        const user2 = user.uid;
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

        const msgsRef = collection(db, "messages", id, "chat");
        const q = query(msgsRef, orderBy("createdAt", "desc"), limit(limitPerPage));

        onSnapshot(q, (querySnapshot) => {
            let msgs = [];
            querySnapshot.forEach((doc) => {
                msgs.push(doc.data());
            });

            let msg1 = msgs
            const lastVisible = msgs[msgs.length - 1]

            this.setState({ lastVisible: lastVisible })
            this.props.getMessagesAction1(msg1)
        });


        // const docSnap = await getDoc(doc(db, "lastMsg", id));
        // if (docSnap.data() && docSnap.data().from !== user1) {
        //     await updateDoc(doc(db, "lastMsg", id), { unread: false });
        // }
    };


    //call when msg send By user
    handleSubmit = async (e) => {
        e.preventDefault();
        const { msg_id } = this.state
        const { img } = this.state
        const { text } = this.state
        const { user1 } = this.state
        const { chat } = this.state
        const user2 = chat.uid;

        this.setState({ text: "" })
        this.setState({ img: '' })
        this.setState({ reply_msg: false })

        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

        if (img) {
            await storeImage(img)
        }

        if (msg_id === "") {
            await sendNormalMsg(id, text, user1, user2)
            // this.setState({ text: "" })
        }
        else {
            if (msg_id.from === user1) {
                await sendReplyMsgToMe(id, text, msg_id, user1, user2)
            }
            else {
                await sendReplyMsgToFriend(id, chat, text, msg_id, user1, user2)
            }
        }
        await setLastReply(id, text, user1, user2)
    }

    //set value to the true on click on emojji
    loadEmojiPicker = () => {
        console.log("this.props.isEmoji");
        this.setState(prevState => ({
            isEmoji: !prevState.isEmoji
        }));
    }

    //handle value with onchange
    onChangeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    //on emoji click set emoji
    onEmojiClick = (event, emojiObject) => {
        const { text } = this.state
        if (text !== "") {
            this.setState({ text: text + emojiObject.emoji });
        } else {
            this.setState({ text: emojiObject.emoji });
        }
        this.setState({ isEmoji: false })
    }

    //set img on change
    setImgOnUpload = (e) => {
        this.setState({ img: e.target.files[0] })
        // this.setState({img:""})
    }


    //delete msg from me
    deleteMsgFromMe = async () => {
        const { user1 } = this.state
        const { chat } = this.state
        const { msgs } = this.props.homePage
        const user2 = chat.uid;

        alert("are you sure to delete message")
        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

        await deleteMsgOnlyMe(id, msgs, user1, user2)
        this.setState({ drop_down_flag: false })
    }

    //deelete msg from me o perticular id
    deleteMsgFromMeWithId = async (msg) => {
        const { user1 } = this.state
        const { chat } = this.state
        const { msgs } = this.props.homePage
        const user2 = chat.uid;

        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
        msg.deleted === msg.from || msg.deleted === msg.to ?
            await deleteMsgOnlyMeWithId(id, msg, user1, user2)
            :
            this.setState({ dropDownMsg: false })
        await deleteMsgOnlyMeWithId1(id, msg, user1, user2)

    }

    deleteMsgInBoth = async (msg) => {
        const { user1 } = this.state
        const { chat } = this.state

        const current_date = Timestamp.fromDate(new Date())
        const user2 = chat.uid;
        const diff = current_date.seconds - msg.createdAt.seconds

        const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
        if (diff <= 300) {
            await deleteMsgInBothUsers(id, msg)
        }
        else {
            alert("you can not delete msg after limited time")
        }
        this.setState({ angle_down_flag: false })
    }

    setFlagToReplyBack = () => {
        this.setState({ reply_msg: false })
        this.setState({ msg_id: "" })
    }

    //replay back to perticular msg
    replayBackToMsg = async (msg) => {

        console.log("msgs are", msg);
        const { reply_msg1 } = this.state

        if (reply_msg1 === true) {
            this.setState({ reply_msg: false })
            this.setState({ angle_down_flag: false });
        }
        else {
            this.setState({ reply_msg: true })
            this.setState({ msg_id: msg })
            this.setState({ angle_down_flag: false });
        }

        // this.setState({ dropDownMsg: false })
        // this.setState({ angle_down_flag: false })

    }

    // logout 
    handleSignout = async () => {
        await selectSignOut()
        this.props.history.replace("/login");
    };

    //set flag when set option logout and delete 
    setDropDownFlag = async () => {
        this.setState(prevState => ({
            drop_down_flag: !prevState.drop_down_flag
        }));

    }

    //set Flag in msg drop down
    setDropDownFlagMsg = async (msg) => {
        this.setState(prevState => ({
            dropDownMsg: !prevState.dropDownMsg
        }));
        // this.setState({ angle_down_flag: false });
    }

    //set Profile Flag
    setProfileFlag = async () => {
        this.setState(prevState => ({
            profile_flag: !prevState.profile_flag
        }));
    }

    //on click change profile picture
    changeProfilePicture = async (e) => {
        this.setState({ img_profile: e.target.files[0] })
        this.setState({ loader_profile_pic: true })
    }

    setImageProfile = async () => {
        this.setState({ img_profile: "" })
        this.setState({ img: "" })
    }

    //set flag for open a triangle
    onMouseEnterFlagTrue = async (msg) => {
        // this.setState(prevState => ({
        //     angle_down_flag: !prevState.angle_down_flag
        // }));
        this.setState({ angle_down_flag: true });
        this.setState({ prevMsg: msg.msg_id });
        this.setState({ dropDownMsg: false })
    }

    onMouseEnterFlagFalse = async () => {
        this.setState({ angle_down_flag: false });
        this.setState({ dropDownMsg: false })
    }

    render() {
        const { users } = this.props.homePage
        const { msgs } = this.props.homePage
        const { user1, text, isEmoji } = this.state
        const { reply_msg, prevMsg } = this.state
        const { chat } = this.state
        const { img, loader_profile_pic, angle_down_flag, limitPerPage } = this.state
        const { msg_id, drop_down_flag, dropDownMsg, profile_flag, img_profile, profile_user } = this.state
        const { scrollHeight } = this.state
        const { lastVisible } = this.state


        console.log("msgs", msgs.length);
        // console.log(" this.messagesEnd1------------------ ", this.messagesEnd1);

        // console.log("scrollTop", this.state.scrollTop);

        // console.log("msgs are : ", msgs);
        // console.log("lastvisible " ,this.state.lastVisible);
        // console.log("CHAT " ,chat);
        // console.log("scrollPosition ", this.state.scrollTop);
        // console.log("curuuent page", this.state.currentPage);
        return (
            <div className='main-Wrapper'>
                <div className="container">
                    <div className="leftSide">
                        <div className="header">
                            {/* header At User Side */}
                            <div className="userimg">
                                {profile_user ? <img onClick={this.setProfileFlag} src={profile_user.avatar || Img} alt="avatar" className="cover" /> :
                                    ""
                                }
                            </div>

                            <ul className="nav_icons">
                                <li><i className='fa fa-search' style={{ fontSize: "15px" }}></i></li>
                                <li><i className='fa fa-ellipsis-v' style={{ fontSize: "15px" }}></i></li>
                            </ul>
                        </div>

                        {!profile_flag ?
                            <div>
                                {users.length === 0 ? ""
                                    : users.map((user) => (
                                        <div
                                            className={`${chat.uid === user.uid ? "chatlist selected" : "chatlist"}`}>
                                            <User
                                                key={user.uid}
                                                user={user}
                                                selectUser={this.selectUser}
                                                user1={user1}
                                                chat={chat}
                                                msgs={msgs}
                                            />
                                        </div>
                                    ))}
                            </div> :
                            <Profile
                                loader_profile_pic={loader_profile_pic}
                                profile_user={profile_user}
                                profile_flag={profile_flag}
                                changeProfilePicture={(e) => this.changeProfilePicture(e)}
                                img_profile={img_profile}
                                // setProfileUser={this.setProfileUser}
                                setImageProfile={this.setImageProfile}
                                chat={chat}
                            />
                        }
                    </div>


                    {chat ? (
                        <div className="rightSide">
                            <div className="header">
                                <div className="imgText">
                                    <div className="userimg">
                                        <img src={chat.avatar || Img} alt="avatar" className="cover" />
                                    </div>
                                    <h4>{chat.name} <br />
                                        <span>

                                            {users.map((user, i) =>
                                                user.uid === chat.uid ?
                                                    (
                                                        user.uid === chat.uid && user.isOnline ? "online" : "offline"
                                                    ) : "")
                                            }
                                        </span>
                                    </h4>
                                </div>

                                <ul className="nav_icons">
                                    <li><i onClick={this.setDropDownFlag} className='fa fa-ellipsis-v' style={{ fontSize: "15px" }}></i></li>
                                </ul>
                            </div>
                            <div className='dropdown'>
                                {drop_down_flag ?
                                    <div id="myDropdown" className="dropdown-content">
                                        <div onClick={this.deleteMsgFromMe}>Delete Message</div>
                                        <div onClick={this.handleSignout}>Logout</div>
                                    </div>
                                    : ""}
                            </div>

                            <>
                                {img !== "" ?
                                    <>
                                        <PreviewImg
                                            img={img}
                                            text={text}
                                            onChange={this.onChangeHandler}
                                            handleSubmit={this.handleSubmit}
                                            setImageProfile={this.setImageProfile}
                                            msg_id={msg_id}
                                            reply_msg={reply_msg}
                                            setImgOnUpload={this.setImgOnUpload}
                                            onEmojiClick={this.onEmojiClick}
                                            loadEmojiPicker={this.loadEmojiPicker}
                                            isEmoji={isEmoji}
                                        />
                                    </>
                                    :
                                    <>
                                        <div
                                            className="chatbox"
                                            id="scrollableDiv"
                                            style={{
                                                overflow: "auto",
                                                display: "flex",
                                                flexDirection: "column-reverse"
                                            }}
                                        // style={{ display: "flex" }}
                                        // onScroll={this.handleScroll}
                                        // ref={(el) => { this.messagesEnd = el; }}
                                        >

                                            <div>
                                                <InfiniteScroll
                                                    dataLength={msgs.length}
                                                    next={this.getNextPageData}
                                                    inverse={true}
                                                    endMessage={lastVisible}
                                                    style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
                                                    hasMore={true}
                                                    scrollableTarget="scrollableDiv"
                                                >
                                                    {/* {scrollPosition} */}
                                                    {msgs.map((msg, i) => (
                                                        <Message
                                                            msgs={msgs}
                                                            profile_user={profile_user}
                                                            key={i}
                                                            chat={chat}
                                                            msg={msg}
                                                            user1={user1}
                                                            reply_msg={reply_msg}
                                                            replayBackToMsg={() => this.replayBackToMsg(msg)}
                                                            msg_id={msg_id}
                                                            deleteMsgInBoth={() => this.deleteMsgInBoth(msg)}
                                                            setDropDownFlagMsg={() => this.setDropDownFlagMsg(msg)}
                                                            prevMsg={prevMsg}
                                                            deleteMsgFromMeWithId={() => this.deleteMsgFromMeWithId(msg)}
                                                            dropDownMsg={dropDownMsg}
                                                            onMouseEnterFlagTrue={() => this.onMouseEnterFlagTrue(msg)}
                                                            angle_down_flag={angle_down_flag}
                                                            onMouseEnterFlagFalse={this.onMouseEnterFlagFalse}
                                                            limitPerPage={limitPerPage}
                                                        // handleScroll ={this.handleScroll}
                                                        // scrollPosition={scrollPosition}
                                                        />
                                                    ))}
                                                </InfiniteScroll>
                                            </div>
                                            {/* </InfiniteScroll> */}
                                        </div>
                                        <>
                                            <MessageForm
                                                setFlagToReplyBack={this.setFlagToReplyBack}
                                                msg_id={msg_id}
                                                reply_msg={reply_msg}
                                                handleSubmit={this.handleSubmit}
                                                text={text}
                                                onChange={this.onChangeHandler}
                                                setImgOnUpload={this.setImgOnUpload}
                                                img={img}
                                                onEmojiClick={this.onEmojiClick}
                                                loadEmojiPicker={this.loadEmojiPicker}
                                                isEmoji={isEmoji}
                                            />
                                        </>
                                    </>
                                }
                            </>
                        </div>
                    ) : (
                        <div className='rightSide'>
                            <h3 className="no_conv">Select a user to start conversation</h3>
                        </div>
                    )}
                </div>
            </div >
        )
    }
}

const mapStateToProps = state => {
    return {
        homePage: state.homePage,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getUsersAction1: (payload) => dispatch(getUsersAction(payload)),
        getMessagesAction1: (payload) => dispatch(getMessagesAction(payload)),
        append_new_msg_pagination1: (payload) => dispatch(append_new_msg_pagination(payload))
    }
}

const Add = connect(mapStateToProps, mapDispatchToProps)(Home1);


function Home(props) {
    const history = useHistory();
    return <Add {...props} history={history} />
}
export default Home;