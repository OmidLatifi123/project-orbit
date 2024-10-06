import React from 'react';
import Navbar from './Navbar';
import { OrbitalModel } from './OrbitalModel'; 
import './Styles/Planets.css';

function SpaceVisualization() {
  return (
    <div className="planet-container">
      <Navbar />

      <OrbitalModel /> 

      <div className="planet-info">
        <div className="info-section">
          <h2>3D Keplerian Orbital Propagation Model: Sun-Earth System</h2>
          <p>
            This visualization demonstrates a Keplerian orbital propagation model featuring the Sun and Earth. 
            The model uses Kepler's laws of planetary motion to calculate the positions of celestial bodies over time.
          </p>
          <h3>Key Features:</h3>
          <ul>
            <li>Accurate representation of Earth's orbit around the Sun</li>
            <li>Earth's axial tilt and rotation</li>
            <li>Interactive 3D view with zoom, pan, and rotate capabilities</li>
            <li>Axis labels in Astronomical Units (AU)</li>
          </ul>
          <p>
            The orbital parameters used in this model are simplified for visualization purposes. In reality, 
            precise orbital calculations would take into account additional factors such as gravitational 
            influences from other celestial bodies, solar radiation pressure, and atmospheric drag for objects 
            in low Earth orbit.
          </p>
        </div>
      </div>

   

      <div className="planet-info">
        <div className="info-section">
          <h2>3D Keplerian Orbital Propagation Model: Earth-Moon System</h2>
          <p>
            This visualization showcases a detailed Keplerian orbital propagation model of the Earth-Moon system. 
            It accurately represents the Moon's orbit around Earth, taking into account various orbital parameters.
          </p>
          <h3>Key Features:</h3>
          <ul>
            <li>Accurate representation of the Moon's orbit around Earth</li>
            <li>Correct relative sizes of Earth and Moon</li>
            <li>Moon's orbital inclination and eccentricity</li>
            <li>Earth's rotation and Moon's tidal locking</li>
            <li>Interactive 3D view with zoom, pan, and rotate capabilities</li>
            <li>Axis labels in kilometers (km)</li>
          </ul>
          <h3>Interesting Facts:</h3>
          <ul>
            <li>The Moon's average distance from Earth is about 384,400 km (0.00257 AU)</li>
            <li>The Moon's orbit is inclined by about 5.145° to the ecliptic plane</li>
            <li>The Moon's orbital eccentricity is approximately 0.0549</li>
            <li>The Moon completes one orbit around Earth in about 27.322 days (sidereal month)</li>
            <li>The Moon is tidally locked to Earth, always showing the same face to us</li>
          </ul>
          <p>
            This model provides a scientifically accurate representation of the Earth-Moon system. However, 
            it's important to note that in reality, the system is even more complex. Factors such as the 
            gravitational influence of the Sun and other planets, as well as various orbital perturbations, 
            contribute to the intricate dance of these celestial bodies.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SpaceVisualization;