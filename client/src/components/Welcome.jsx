import React from 'react';
import Robot from '../assets/robot.gif';
import styled from 'styled-components';

function Welcome({ currentUser }) {
  return (
    <Container>
        <img src={Robot} alt="robot" />
        <h1>Welcome, <span>{currentUser?.username}</span></h1>
        <h3>Please select a chat to start messaging.</h3>
    </Container>
  )
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: white;

    img {
        height: 20rem;
    }

    span {
        color: #4e00ff;
    }

`


export default Welcome