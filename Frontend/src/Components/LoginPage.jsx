import React, { useState } from 'react'
import {Button,Input} from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/Signup.css';

function LoginPage() {

  const [formData,setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors,setErrors] = useState({});


  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login',formData); 
      console.log("Data is sended",response.data);
      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem('token',token);
        navigate('/user');
      }
    } catch(error) {
        if(error.response) {
          if (error.response.status === 404 || error.response.status === 500) {
            setErrors({ form: error.response.data.message});
          } else {
            setErrors({form: 'An unexpected error occured'});
          } 
        } else {
          setErrors({form: 'Unable to connect to the server.Please Try Again Later!'});
        };
    };
  };

  const handleInput = (e) => {
    const {name,value} = e.target;
    setFormData({
      ...formData,
      [name]: value
  });
  }
  return (
    <div className='main'>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit} action='/login'>
        <div>
          <Input 
          className='input'
          name='username'
          placeholder='Username..'
          onChange={handleInput}
          value={formData.username}
          />
          {errors.username && <p style={{color: 'red'}}>{errors.username}</p>}

          </div>
          <div>
          <Input
          className='input'
          name='password'
          type='password'
          placeholder='Password..'
          onChange={handleInput}
          value={formData.password}
          />
          {errors.password && <p style={{color: 'red'}}>{errors.password}</p>}

          </div>
          <div className='button'>
          {errors.form && <div style={{color: 'red',margin: '5px'}}>{errors.form}</div>}
          <Button type='primary' htmlType='submit'>Login</Button>
          </div>
      </form>
        <div>
          <p>Don't Have Account? <Link to='/signup'><Button type='link'>Signup</Button></Link></p>
        </div>
    </div>
  )
}

export default LoginPage;
