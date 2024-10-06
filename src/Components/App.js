import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GalaxyScene from './GalaxyScene';
import About from './About';

import Sun from './Sun'; 
import Mercury from './Mercury'; 
import Venus from './Venus'; 
import Earth from './Earth'; 
import Moon from './Moon'; 
import Mars from './Mars'; 
import Jupiter from './Jupiter';
import Saturn from './Saturn'; 
import Uranus from './Uranus'; 
import Neptune from './Neptune'; 

import EarthSurface from './Surface/EarthSurface'; 
import OrbitalPropagator from './OrbitalPropagator'; 
import SpaceshipEarth from './SpaceshipEarth'; 

import { useEffect } from 'react';






function App() {
  useEffect(()=>{
    document.title="Project Orbit"
  },[])
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GalaxyScene />} />

        <Route path="/about" element={<About />} />

    

        <Route path="/sun" element={<Sun />} />
        <Route path="/mercury" element={<Mercury />} />
        <Route path="/venus" element={<Venus />} />
        <Route path="/earth" element={<Earth />} />
        <Route path="/moon" element={<Moon />} />
        <Route path="/mars" element={<Mars />} />
        <Route path="/jupiter" element={<Jupiter />} />
        <Route path="/saturn" element={<Saturn />} />
        <Route path="/uranus" element={<Uranus />} />
        <Route path="/neptune" element={<Neptune />} />

        <Route path="/orbitalpropogator" element={<OrbitalPropagator />} />
        
      
        <Route path="/Surface/EarthSurface" element={<EarthSurface />} />

        <Route path="/SpaceshipEarth" element={<SpaceshipEarth />} />


      </Routes>
    </Router>
  );
}

export default App;
