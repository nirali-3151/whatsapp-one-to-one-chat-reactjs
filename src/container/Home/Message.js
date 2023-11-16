import React, { Component, useRef } from 'react'
import Img from "../../image/image1.jpg"
import Moment from "react-moment";

class Message1 extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  // scrollToBottom = () => {
  //   this.messagesEnd.scrollIntoView({ behavior: "auto" });
  // }


render() {
  const { msg } = this.props
  const { user1 } = this.props
  const { replayBackToMsg } = this.props
  const { chat } = this.props
  const { deleteMsgInBoth } = this.props
  const { setDropDownFlagMsg, profile_user } = this.props
  const { prevMsg } = this.props
  const { deleteMsgFromMeWithId, dropDownMsg } = this.props
  const { angle_down_flag, onMouseEnterFlagTrue, onMouseEnterFlagFalse } = this.props

  return (
    <div
      className={`${msg.from === user1 ? "message my_msg" : "message friend_msg"}`}
    >
      {msg.text1 === ""
        ?
        <>
          <div
            className={msg.from === user1 ? "message my_msg" : "message friend_msg"}>
            {msg.deleted === "" || msg.deleted !== user1 ?
              <>
                <div className="userimg1">
                  {
                    msg.from !== user1
                      ? <img src={chat.avatar || Img} alt="avatar" className="cover" />
                      : ""
                  }
                </div>

                <p
                  onMouseEnter={onMouseEnterFlagTrue}
                  onMouseLeave={onMouseEnterFlagFalse}
                >
                  {msg.media ? <img src={msg.media} alt={msg.text} /> : null}
                  {msg.text}
                  <>
                    {prevMsg === msg.msg_id && angle_down_flag ?
                      <>
                        <i onClick={setDropDownFlagMsg} class="fa fa-angle-down  angleDown" aria-hidden="true"></i>
                        < div className='dropdown1'>
                          {prevMsg === msg.msg_id && dropDownMsg ?
                            <div id="myDropdown1" className="dropdown-content1">
                              {msg.from === user1 ?
                                <div onClick={deleteMsgInBoth}>Delete everyone</div> : ""}
                              <div onClick={deleteMsgFromMeWithId}>Delete Only Me</div>
                              <div onClick={replayBackToMsg} >Replay</div>
                            </div>
                            : ""
                          }
                        </div>
                      </>
                      : ""
                    }
                  </>
                  {/* <br /> */}
                  {/* <span>
                  <Moment fromNow>{msg.createdAt.toDate()}</Moment>
                </span> */}
                </p>

                <div className="userimg1">
                  {
                    msg.from === user1
                      ? <img src={profile_user.avatar || Img} alt="avatar" className="cover" />
                      : ""
                  }
                </div>
              </>
              : ""
            }
          </div>
        </>
        :
        <div className={msg.from === user1 ? "message my_msg" : "message friend_msg"}>
          <div className="userimg1">
            {
              msg.from !== user1
                ? <img src={chat.avatar || Img} alt="avatar" className="cover" />
                : ""
            }
          </div>

          <p
            onMouseEnter={onMouseEnterFlagTrue}
            onMouseLeave={onMouseEnterFlagFalse}
          >
            {msg.media ? <img src={msg.media} alt={msg.text} /> : null}
            <div className='reply'>
              <h4 className='msg_name'>{msg.name} </h4>
              <div>{msg.text1}</div>
            </div>
            {/* <br /> */}
            <><div className='space'>{msg.text}</div></>
            <>
              {prevMsg === msg.msg_id && angle_down_flag ?
                <>
                  <i onClick={setDropDownFlagMsg} class="fa fa-angle-down  angleDown" aria-hidden="true"></i>
                  < div className='dropdown1'>
                    {prevMsg === msg.msg_id && dropDownMsg ?
                      <div id="myDropdown1" className="dropdown-content1">
                        {msg.from === user1 ?
                          <div onClick={deleteMsgInBoth}>Delete everyone</div> : ""}
                        <div onClick={deleteMsgFromMeWithId}>Delete Only Me</div>
                        <div onClick={replayBackToMsg} >Replay</div>
                      </div>
                      : ""
                    }
                  </div>
                </>
                : ""
              }
            </>
          </p>
          <div className="userimg1">
            {
              msg.from === user1
                ? <img src={profile_user.avatar || Img} alt="avatar" className="cover" />
                : ""
            }
          </div>
        </div>
      }
    </div>
  )
}
}



function Message(props) {
  const scrollRef = useRef();
  return <Message1 {...props} scrollRef={scrollRef} />
}
export default Message;
