import React, { Component } from 'react'
import Attachment from '../../icons/Attachment'
import Picker from 'emoji-picker-react';

class MessageForm extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { text, img } = this.props
        const { handleSubmit } = this.props
        const { setImgOnUpload } = this.props
        const { onEmojiClick } = this.props
        const { setFlagToReplyBack } = this.props
        const { msg_id } = this.props
        const { reply_msg } = this.props

        // console.log("msg_id.media", img);

        return (
            <>
                <form className="chat_input" onSubmit={handleSubmit}>

                    {this.props.isEmoji ?
                        <div className='emoji-picker'>
                            <Picker
                                onEmojiClick={onEmojiClick}
                                pickerStyle={{ width: '100%' ,height :'100%' ,fontSize:"15px"}}
                                disableSearchBar = {true}
                                 />
                        </div> : ""}

                    <label htmlFor="img">
                        <Attachment />
                    </label>

                    <input
                        onChange={setImgOnUpload}
                        type="file"
                        name='img'
                        id="img"
                        accept="image/*"
                        style={{ display: "none" }}
                    />

                    <i onClick={this.props.loadEmojiPicker} class='far fa-smile' style={{ fontSize: "20px", color: "rgb(141, 140, 140)", padding: "0px 0px 0px 0px" }}></i>
                    <div>
                        {
                            <>
                                {msg_id.media === "" ?
                                    <div className='wra'>
                                        {reply_msg ?
                                            <div className='break'>
                                                <div className='new-box'>
                                                    <h3>Nirali</h3>
                                                    {msg_id.text}
                                                    <i id="icon" onClick={setFlagToReplyBack} style={{ fontSize: "10px" }} class="fa fa-times" aria-hidden="true"></i>
                                                </div>
                                            </div> : ""
                                        }
                                    </div> :
                                    reply_msg ?
                                        <div className='break'>
                                            <div className='new-box'>
                                                <>replay to img</>
                                                <i id="icon" onClick={setFlagToReplyBack} style={{ fontSize: "10px" }} class="fa fa-times" aria-hidden="true"></i>
                                            </div>
                                        </div> : ""
                                }

                                {img === "" ?
                                    <input
                                        type="text"
                                        placeholder="Enter message"
                                        name='text'
                                        value={text}
                                        onChange={this.props.onChange}
                                    /> :
                                    <input
                                        type="text"
                                        placeholder="Enter message"
                                        name='text'
                                        value="Send Image"
                                        onChange={this.props.onChange}
                                    />}
                                {/* } */}
                            </>
                        }
                    </div>
                    <span className='userimg2'>
                        <i onClick={handleSubmit} class="fa fa-paper-plane" style={{ fontSize: "15.5px", padding: "7px 5px 5px 6px" }}></i>
                    </span>
                </form>
            </>
        )
    }
}

export default MessageForm