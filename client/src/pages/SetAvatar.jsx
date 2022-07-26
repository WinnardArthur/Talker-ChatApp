import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import axios from 'axios';
import Loader from '../assets/loader.gif';
import { setAvatarRoute } from '../utils/APIRoutes';
import { Buffer } from 'buffer';


function SetAvatar() {
    const api = "https://api.multiavatar.com/4645646";

    const navigate = useNavigate();

    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);

    const toastOptions = {
        position: "top-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
    }

    useEffect(() => {
        if(!localStorage.getItem("talker-user")) {
            navigate("/login", {replace: false})
        }
    }, [navigate])

    const setProfilePicture = async () => {
        if (selectedAvatar === undefined) {
            toast.error("Please select an avatar", toastOptions)
        } else {
            const user = await JSON.parse(localStorage.getItem('talker-user'));

            const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
                image: avatars[selectedAvatar]
            })


            if(data.isSet) {
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem('talker-user', JSON.stringify(user));
                navigate('/')
            } else {
                toast.error("Error setting avatar. Please try again", toastOptions)
            }
        }
    }

    useEffect(() => {
        const fetchAvatarImage = async () => {
            const data = []
            for (let i = 0; i < 4; i++) {
                const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`)
                const buffer = new Buffer(image.data)
                data.push(buffer.toString("base64"));
            }
            setAvatars(data);
            setIsLoading(false);
        }

        fetchAvatarImage()
    }, [])

    return (
        <>
            {
                isLoading ?
                    <Container>
                        <img src={Loader} alt="loader" />
                    </Container>
                    :
                    <>
                        <Container>
                            <div className='title-container'>
                                <h1>Pick an avatar as your profile picture</h1>
                            </div>
                            <div className='avatars'>
                                {avatars.map((avatar, index) => (
                                    <div key={index} className={`avatar ${selectedAvatar === index ? "selected" : ""} `}>
                                        <img
                                            src={`data:image/svg+xml;base64,${avatar}`}
                                            alt="avatar"
                                            onClick={() => setSelectedAvatar(index)}
                                            key={avatar}
                                        />
                                    </div>
                                ))}
                            </div>
                            <button className='submit-btn' onClick={setProfilePicture}>Set as profile picture</button>
                        </Container>
                        <ToastContainer />
                    </>
            }
        </>
    )
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1rem;
    background-color: #131324;
    height: 100vh;
    width: 100vw;

    .loader {
        max-inline-size: 100%;
    }

    .title-container {
        h1 {
            color: white;
        }
    }

    .avatars {
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;

        .avatar {
            border: .4rem solid transparent;
            border-radius: 5rem;
            padding: 0.4rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: 0.5s ease-in-out;

            img {
                height: 6rem;
            }
        }

        .selected {
            border: 0.4rem solid #4e0eff;
        }
    }

     .submit-btn {
            background-color: #997af0;
            color: white;
            padding: 1rem 2rem;
            border: none;
            font-weight: bold;
            cursor: pointer;
            border-radius: 0.4rem;
            font-size: 1rem;
            text-transform: uppercase;
            transition: .5s ease-in-out;
            margin-top: 1rem;

            &:hover {
                background-color: #4e0eff;
            }
        }
    
`
export default SetAvatar