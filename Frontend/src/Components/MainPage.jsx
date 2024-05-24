import React from 'react'
import {Button} from 'antd';
import { Link } from 'react-router-dom';
import '../Styles/MainPage.css';
function MainPage() {
  return (
    <div className='main'>  
        <div className='welcome'>
          <h1>Welcome to Todo App!</h1>
        </div>
        <div className='manage'>
          <h2>Manage your tasks efficiently with<br/> our easy-to-use todo app</h2>
        </div>
        <div className='signup'>
          <Link to='/signup'><Button type='primary'>Create Account</Button></Link>
        </div>
        <div className='login'>
          <h3>Already Have An Account ?<Link to='/login'><Button type='link'>Login</Button></Link></h3>
        </div>
    </div>
  )
}

export default MainPage
