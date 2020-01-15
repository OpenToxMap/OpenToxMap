import React from 'react';
import {Link} from 'react-router-dom';

export default function Nav() {
  return (
    <nav className="nav">
      <Link className="home-link" to="/">
        Open TOXMAP
      </Link>

      <ul className="links">
        <li>
          <Link to="/map" className="nav-link">
            Map
          </Link>
        </li>
        <li>
          <Link to="/data" className="nav-link">
            Data Sources
          </Link>
        </li>
        <li>
          <Link to="/service-status" className="nav-link">
            Service Status
          </Link>
        </li>
      </ul>
    </nav>
  );
}
