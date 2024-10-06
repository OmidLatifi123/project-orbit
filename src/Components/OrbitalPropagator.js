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
          <h2>3D Keplerian Orbital Propagation Model of the Solar System</h2>
          <p>
            Welcome to this interactive visualization of the Solar System! In this model, we use 
            <b> Kepler's laws of planetary motion</b> to simulate the orbits of planets around the Sun. 
            You will be able to see how each planet moves in accordance with its unique orbital characteristics.
          </p>

          <h3>What is Keplerian Orbital Propagation?</h3>
          <p>
            Keplerian orbital propagation is a method used to predict the position of a celestial body, like a planet, 
            as it orbits another body, like the Sun. It is based on Kepler's three laws of planetary motion:
          </p>
          <ul>
            <li>
              <b>Law 1:</b> Planets move in ellipses with the Sun at one focus.
            </li>
            <li>
              <b>Law 2:</b> A line drawn from a planet to the Sun sweeps out equal areas in equal times.
            </li>
            <li>
              <b>Law 3:</b> The square of a planet's orbital period is proportional to the cube of its semi-major axis.
            </li>
          </ul>

          <p>
            By calculating the position and velocity of each planet at regular intervals, we can visualize their elliptical 
            orbits. The model presented here simplifies some complex forces but still provides an accurate approximation 
            of planetary motion.
          </p>

          <h3>Key Features of this Model:</h3>
          <ul>
            <li>Accurate representation of planetary orbits using Keplerian elements</li>
            <li>Simulation of eccentric orbits (elliptical paths) with variable speeds</li>
            <li>3D visualization with interactive controls (zoom, pan, rotate)</li>
            <li>Visual axis labels using Astronomical Units (AU) for distances</li>
          </ul>

          <p>
            This model demonstrates the elegance of celestial mechanics and helps us appreciate how gravitational forces 
            keep planets in motion. While the visualization is simplified, it highlights the major aspects of planetary 
            orbits as discovered by the astronomer Johannes Kepler in the early 17th century.
          </p>

          <h3>Learning Outcomes:</h3>
          <ul>
            <li>Understand the basics of Kepler's laws of planetary motion</li>
            <li>See how orbital eccentricity and inclination affect planetary paths</li>
            <li>Explore how planets move faster near their perihelion (closest approach to the Sun) and slower near their aphelion (farthest distance)</li>
          </ul>

          <h3>Interesting Facts:</h3>
          <ul>
            <li>
              <b>Eccentricity:</b> While Earth's orbit is nearly circular, other planets like Mercury have more 
              elliptical orbits with higher eccentricities. This causes them to speed up and slow down during different parts of their orbit.
            </li>
            <li>
              <b>Inclination:</b> Each planet's orbit is tilted relative to the Earth's orbital plane (the ecliptic). 
              This tilt is called the inclination, and it varies for each planet.
            </li>
            <li>
              <b>Sidereal Period:</b> The time it takes for a planet to complete one orbit around the Sun is its 
              sidereal period, measured in Earth years. For instance, Jupiter takes about 12 Earth years to orbit the Sun once!
            </li>
          </ul>

          <p>
            The 3D model below allows you to explore these concepts interactively. You can zoom in to see the details 
            of a specific planet's orbit or zoom out to get an overview of the entire solar system. Try rotating the 
            camera to view the orbits from different angles!
          </p>

          <img src="/datasetused.png" alt="Keplerian Elements Data" className="keplerian-image"/>
          <p>
            The image above shows the Keplerian elements used to model the planets' orbits. These parameters are critical 
            for predicting their positions and speeds as they move through space.
          </p>

          <img src="/propagator formula.png" alt="Orbital Propagator Formula" className="propagator-image"/>
          <p>
            The formula above represents the equations used in our Keplerian propagator to convert between 
            orbital parameters and actual 3D positions of the planets. The propagator solves for the eccentric 
            anomaly and true anomaly, both of which are key in calculating the planet's position at a given time.
          </p>

          <h3>Explore and Learn:</h3>
          <p>
            As you interact with the model, notice how the planets with more eccentric orbits (like Mercury) 
            change their speed as they move closer to and further away from the Sun. Use the controls to adjust 
            the simulation speed and watch the planets move in their elliptical paths.
          </p>

          <p>
            This educational model is a simplified yet powerful tool to help you visualize and understand how the 
            planets in our solar system follow predictable and beautifully intricate orbits.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SpaceVisualization;
