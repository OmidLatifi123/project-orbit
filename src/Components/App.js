import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import GalaxyScene from './GalaxyScene';

function App() {
  useEffect(()=>{
    document.title="Project Orbit"
  },[])
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GalaxyScene />} />
      </Routes>
    </Router>
  );
}

export default App;
