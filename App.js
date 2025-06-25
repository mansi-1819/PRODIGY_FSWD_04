import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import axios from 'axios';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogin = async (username, password) => {
    const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
    localStorage.setItem('token', response.data.token);
    setToken(response.data.token);
  };

  const handleRegister = async (username, password) => {
    await axios.post('http://localhost:5000/api/auth/register', { username, password });
  };

  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login onLogin={handleLogin} />
        </Route>
        <Route path="/register">
          <Register onRegister={handleRegister} />
        </Route>
        <Route path="/chat">
          {token ? <Chat token={token} /> : <Redirect to="/login" />}
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
