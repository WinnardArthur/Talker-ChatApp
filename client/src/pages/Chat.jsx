import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { allUsersRoute, host } from '../utils/APIRoutes';
import axios from 'axios';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import { io } from "socket.io-client";

function Chat() {
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  const socket = useRef();

  useEffect(() => {
    if(!localStorage.getItem('talker-user')) {
      navigate("/login")
    } else {
      setCurrentUser(JSON.parse(localStorage.getItem('talker-user')));
      setIsLoaded(true);
    }
  }, [])


  useEffect(() => {
    const fetchAvatarImage = async () => {
      const data = await axios.get(`${allUsersRoute}/${currentUser._id}`)
      setContacts(data.data)
    }

    if (currentUser) {
      if(currentUser.isAvatarImageSet) {
        fetchAvatarImage()
      } else {
        navigate("/set-avatar")
      }
    }
  }, [currentUser])

  useEffect(() => {
    if(currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser])

  const handleChatChange = (chat) => {
     setCurrentChat(chat)
  }

  return (
    <Container>
      <div className='container'>
        <Contacts 
          contacts={contacts} 
          currentUser={currentUser} 
          changeChat={handleChatChange}
        />
        {
         isLoaded && currentChat === undefined ? 
          <Welcome currentUser={currentUser}/> :
            <ChatContainer socket={socket} currentUser={currentUser} currentChat={currentChat} />
        }
      </div>
    </Container>
  )
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;

  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;

    @media screen and (max-width: 1080px) {
      grid-template-columns: 30% 70%;
      width: 95vw;

    }

  }
`

export default Chat