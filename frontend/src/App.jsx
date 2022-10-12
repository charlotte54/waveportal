import React from "react";
import './App.css';
import './bootstrap.min.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import LoginScreen from './screens/LoginScreen';
import Particle from './components/Particle';

export default function App() {

  return (
    <Router>
      <Particle />
      <Header />
      <main>
        <Routes>

          <Route path="/" element={<LoginScreen />} />
        </Routes>
      </main>

      <div
        style={{
          position: "fixed",
          left: 0,
          bottom: 0,
          right: 0,
        }}
      >

      </div>
    </Router>
  );
}
