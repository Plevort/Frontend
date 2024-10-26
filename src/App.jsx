// /src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Root from './root/root.jsx';
import Login from './login/login.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Root />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default App;
