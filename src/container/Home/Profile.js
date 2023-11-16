import React, { Component } from 'react'
import Img from ".././../image/image1.jpg"
import {
    setUserProfile
} from "../../firebaseAction/HomeAction"

import Camera from '../../icons/Camera'

import { Rings } from "react-loader-spinner";

class Profile extends Component {
    constructor(props) {
        super(props)
    }

    setProfile = async () => {
        const { img_profile } = this.props
        const { profile_user } = this.props
        if (img_profile) {
            const data1 = await setUserProfile(profile_user, img_profile)
            this.props.setImageProfile(data1)
        }
    }

    componentDidMount() {
        this.setProfile()
    }

    componentDidUpdate(prevProps, prevState) {
        const isDiff = prevProps.img_profile !== this.props.img_profile
        if (isDiff) {
            this.setProfile()
        }
    }
    render() {
        const { profile_flag } = this.props
        const { changeProfilePicture, loader_profile_pic, profile_user } = this.props

        return (
            <>
                <div className='img_profile'>
                    {loader_profile_pic ?
                        <div className='loader'>
                            <Rings
                                type="Puff"
                                color="rgb(27, 134, 192)"
                                height={100}
                                width={100}
                            />
                        </div>
                        :
                        <img src={profile_user.avatar || Img} alt="avatar" className="cover" />}
                </div>
                <form>
                    <label htmlFor="img_profile">
                        <div className='userimg3'><Camera /></div>
                    </label>

                    <input
                        onChange={changeProfilePicture}
                        type="file"
                        name='img_profile'
                        id="img_profile"
                        accept="image/*"
                        style={{ display: "none" }}
                    />

                    <h2 className='profile_user_name'>{profile_user.name}</h2>
                    <p className='profile_user_email'>{profile_user.email}</p>
                </form>
            </>
        )
    }
}

export default Profile