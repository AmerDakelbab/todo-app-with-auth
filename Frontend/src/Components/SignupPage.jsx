import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Button,Input } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/Signup.css'

function SignupPage() {
  const [formData,setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });
  const [errors,setErrors] = useState({});


  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/signup',formData); 
      console.log("Data is sended",response.data);
      if (response.status === 201) {
        const token = response.data.token;
        localStorage.setItem('token',token);
        
        navigate('/login');
      }
    } catch(error) {
        if (error.response) {
          if (error.response.status === 400 || error.response.status === 500){
            setErrors({form:error.response.data.message});
          } else {
            setErrors({form: 'Username And Password Are Required!'});
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
      <h1>Signup Page</h1>
      <form onSubmit={handleSubmit} action='/signup'>
       <div> 
          <Input
          className='input'
          name='email'
          type='email'
          placeholder='Email Address'
          onChange={handleInput}
          value={formData.email}
          />
          {errors.email && <p style={{color: 'red'}}>{errors.email}</p>}
          </div>
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
          <div>
          {errors.form && <p style={{color:'red', marginTop: '0em'}}>{errors.form}</p>}
          <Button type='primary' htmlType='submit'>Create Account</Button>
          </div>
      </form>
        <div className='do'>
          <p>Do You Have Account? <Link to='/login'><Button type='link'>Login</Button></Link></p>
          
        </div>
    </div>
  )
}

export default SignupPage;
