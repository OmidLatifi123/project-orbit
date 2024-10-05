import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Styles/Navbar.css'

const Navbar = () => {
  const [homeDropdownOpen, setHomeDropdownOpen] = useState(false);
  const [earthObjectsDropdownOpen, setEarthObjectsDropdownOpen] = useState(false);

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
