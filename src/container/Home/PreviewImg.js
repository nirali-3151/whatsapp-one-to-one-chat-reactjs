import React, { Component } from 'react'
import "../../Design/previewImg.css"
import Picker from 'emoji-picker-react';

class PreviewImg extends Component {
    render() {
        const { img } = this.props
        const { text } = this.props
        const { onChange } = this.props
        const { handleSubmit } = this.props
        const { onEmojiClick, loadEmojiPicker } = this.props

        return (
            <>
                <div className='preview_img1'>
                    {img && (
                        <div className='preview_img'>
                            <img
                                src={URL.createObjectURL(img)}
                                alt="Thumb"
                            />
                        </div>
                    )}
                    <i id="icon1" onClick={() => this.props.setImageProfile()} style={{ fontSize: "20px" }} class="fa fa-times" aria-hidden="true"></i>

                    <div className='preview_img_input_data'>
                        <input
                            type="text"
                            placeholder="Enter message"
                            name='text'
                            value={text}
                            onChange={onChange}
                        />

                        <i onClick={loadEmojiPicker} class='far fa-smile' style={{ fontSize: "20px", color: "rgb(141, 140, 140)", padding: "0px 0px 0px 0px" }}></i>

                    </div>

                    <>
                        {img && (
                            <div className='preview_img_demo'>
                                <img
                                    src={URL.createObjectURL(img)}
                                    alt="Thumb"
                                />
                            </div>
                        )}
                    </>

                    <span className='preview_img_send_icon'>
                        <i onClick={handleSubmit} class="fa fa-paper-plane" style={{ fontSize: "17px", padding: "13px 20px 5px 11px" }}></i>
                    </span>

                    {this.props.isEmoji ?
                        <div className='emoji-picker-preview'>
                            <Picker
                                onEmojiClick={onEmojiClick}
                                pickerStyle={{fontSize: "10px" , width: '100%' ,height :'100%' }}
                                disableSearchBar={true}
                            />
                        </div> : ""}
                </div>
            </>
        )
    }
}


export default PreviewImg