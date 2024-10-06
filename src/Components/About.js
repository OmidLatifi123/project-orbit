import React from 'react';
import './Styles/About.css';
import Navbar from './Navbar';

function About() {
  return (
    <div>
    <Navbar/>
    <div className="about-container">
      <div className="glass-effect">
        <h1>About Us</h1>
        <p className="project-description">
          Welcome to <strong>Project Orbit</strong>—an interactive web application that brings the wonders of our solar system to your fingertips. Inspired by the historical orreries of the 18th century, we've crafted a modern experience where you can explore planets, Near-Earth Objects, comets, and potentially hazardous asteroids in a dynamic and engaging way. Our mission is to educate and inspire curiosity about celestial bodies by leveraging real NASA data and cutting-edge web technologies.
        </p>
        <div className="images-container">
          <div className="image-wrapper">
            <img src="/branding/omidPicture.jpg" alt="Omid" />
            <a
              href="https://omidlatifi.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Omid Latifi
            </a>
          </div>
          <div className="image-wrapper">
            <img src="/branding/MiranPicture.jpeg" alt="Miran" />
            <a
              href="https://miran-blogs.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Miran Qarachatani
            </a>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default About;
