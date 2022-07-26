import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Logo from '../assets/logo.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import axios from 'axios';
import { loginRoute } from '../utils/APIRoutes';
import { useEffect } from 'react';

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const toastOptions = {
    position: "top-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark'
  }

  useEffect(() => {
    if(localStorage.getItem('talker-user')) {
      navigate('/', {replace: true})
    }
  }, [navigate])

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { password, username } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      })
      if (data.status === false) {
        return toast.error(data.message, toastOptions)
      }
      if (data.status === true) {
        localStorage.setItem('talker-user', JSON.stringify(data.user))
      }
      navigate("/", {replace: true})
    }
  }

  const handleValidation = () => {
    const { password, username } = values;
    if (password === "" || username === "" ) {
      toast.error("Email and Password are required", toastOptions)
      return false
    } 
    return true;
  }

  const handleChange = (event) => {
    event.preventDefault();
    setValues({ ...values, [event.target.name]: event.target.value })
  }
  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <Link to="/" className='brand'>
            <img src={Logo} alt='Logo' />
            <h1>Talker</h1>
          </Link>
          <input
            type="text"
            placeholder="Username"
            name="username"
            min={3}
            onChange={e => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={e => handleChange(e)}
          />
          <button type='submit'>Login</button>
          <span>Don't have an account? <Link to="/register">Register</Link></span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  )
}

const FormContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    background-color: #131324;

    .brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;

        img {
            height: 3rem;
            width: 8rem;
            object-fit: cover;
        }
        h1 {
            color: white;
            text-transform: uppercase;
        }
    }

    form {
        display: flex;
        flex-direction: column;
        border-radius: 2rem;
        padding: 3rem 5rem;
        background-color: #00000076;
        gap: 2rem;

        a {
            text-decoration: none;
        }
        
        input {
            background-color: transparent;
            padding: 1rem;
            border: 0.1rem solid #4e0eff;
            border-radius: 0.4rem;
            color: white;
            width: 100%;
            font-size: 1rem;

            &:focus {
                border: 0.1rem solid #997af0;
                outline: none;
            }
        }

        button {
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

            &:hover {
                background-color: #4e0eff;
            }
        }

        span {
            color: white;

            a {
                color: #4e0eff;
                text-decoration: none;
                font-weight: 500;
            }
        }
    }
`

export default Login