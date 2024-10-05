import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Styles/Navbar.css'

const Navbar = () => {
  const [homeDropdownOpen, setHomeDropdownOpen] = useState(false);

  const toggleHomeDropdown = () => {
    setHomeDropdownOpen(!homeDropdownOpen);
  };

  return (
    <nav className="navbar">
      <ul>
        <li
          onMouseEnter={() => setHomeDropdownOpen(true)}
          onMouseLeave={() => setHomeDropdownOpen(false)}
        >
          <Link to="/">Home</Link>
          {homeDropdownOpen && (
            <div className="dropdown">
            <Link to="/sun">Sun</Link> 
            <Link to="/mercury">Mercury</Link> 
            <Link to="/venus">Venus</Link> 
            <Link to="/earth">Earth</Link> 
            <Link to="/moon">Moon</Link> 
            <Link to="/mars">Mars</Link> 
            <Link to="/jupiter">Jupiter</Link> 
            <Link to="/saturn">Saturn</Link> 
            <Link to="/uranus">Uranus</Link> 
            <Link to="/neptune">Neptune</Link> 
            </div>
          )}
        </li>

        <li><Link to="/Surface/EarthSurface">Explore Galaxy</Link></li>

      </ul>
    </nav>
  );
};

export default Navbar;