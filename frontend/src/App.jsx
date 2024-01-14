import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Startpage from './components/Startpage';
import Temperature from './components/Temperature';
import Humidity from './components/Humidity';
import Vibration from './components/Vibration';
import Documentation from './components/Documentation';
import NotFound from './components/NotFound';
function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Startpage />} />
          <Route path="/Temperature" element={<Temperature />} />
          <Route path="/Humidity" element={<Humidity />} />
          <Route path="/Vibration" element={<Vibration />} />
          <Route path="/Documentation" element={<Documentation />} />
            <Route path="*" element={<NotFound />} /> {/* 404-Fehlerseite */}
        </Routes>
      </Router>

  );
}

export default App;
