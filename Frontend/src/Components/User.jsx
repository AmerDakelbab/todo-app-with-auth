import { Button, Input, message } from 'antd';
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import '../Styles/User.css';

function User() {
  const [todoList, setTodoList] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log("StoredToken", storedToken);
    if (storedToken) {
      setToken(storedToken);

      axios.get('http://localhost:5000/user', {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      })
        .then((response) => setTodoList(response.data))
        .catch((err) => console.error("error", err));
    } else {
      navigate('/login');
    }
  }, []);

  const addTodo = async (task) => {

    if (!token) return;
    try {
      await axios.post('http://localhost:5000/user', { task }, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((response) => setTodoList([...todoList, { id: response.data.insertId, task }]))

    }
    catch (ex) {
      message.error(ex.response.data.message)
    }

  };
  const deleteTodo = async (id) => {
    if (!token) return;
    try {
      await axios.delete(`http://localhost:5000/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(() => setTodoList(todoList.filter(task => task.id !== id)))
        .catch((err) => console.error("error", err));
    }
    catch (ex) {
    }

  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // if (inputValue) {
    addTodo(inputValue);
    setInputValue('');

  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setTodoList([]);
    navigate('/login');
  }
  // console.log(todoList)
  return (

    <div className='todo'>
      <form onSubmit={handleSubmit}>
       <div className='form'> 
        <Input
          className='inputt'
          placeholder='Insert Todo'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button className='buttonadd' type='primary' htmlType='submit'>Add</Button>
        </div>
      </form>
      {todoList.map(task => (
        <div className='list' key={task.id}>
          <p>{task.tasks}</p>
          <Button className='delete' onClick={() => deleteTodo(task.id)}>X</Button>
        </div>
      ))}
      <div className='butonlog'>
      <Button type='primary' className='logout' onClick={handleLogout}>logout</Button>
      </div>
    </div>
  )
};

export default User;