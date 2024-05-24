import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ErrorPage from './Components/ErrorPage';
import MainPage from './Components/MainPage';
import SignupPage from './Components/SignupPage';
import LoginPage from './Components/LoginPage';
import User from './Components/User';
import './Styles/app.css';
import Header from './Components/Header';


function App() {
  return (
    <div>
        <Header/>
      <Router>
        <Routes>
          <Route path='/' element={<MainPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/user' element={<User />} />
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;