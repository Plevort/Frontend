// /src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Root from './root/root.jsx';
import Login from './login/login.jsx';
import Register from './register/register.jsx';
import Chat from './chat/chat.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Root />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/chat/:id" element={<Chat />} />
    </Routes>
  );
};

export default App;
