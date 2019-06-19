import React, { useState, useEffect } from 'react';
// Use a customised foundation.css - ported from IDR
import './css/foundation.min.css';
import './css/openmicroscopy.css';
import './css/idr.css';
import './css/studies.css';
import { ReactComponent as Logo } from './logo-idr.svg';
import Categories from './Categories';

function App() {

  let hrStyle = {
    height:0, margin: '8px'
  }
  return (
    <div>
      <div className="main-nav-bar top-bar" id="main-menu">
        <div className="top-bar-left">
          <ul className="dropdown menu" data-dropdown-menu="219f5j-dropdown-menu" role="menubar">
            <li role="menuitem">
              <a className="logo" href="/" tabIndex="0">
                <Logo />
              </a>
            </li>
            <li role="menuitem">
              <a href="/cell/">
                Cell - IDR
              </a>
            </li>
            <li role="menuitem">
              <a href="/tissue/">
                Tissue - IDR
              </a>
            </li>
          </ul>
        </div>
      </div>
      <hr className="whitespace" style={hrStyle} />
      <div className="row columns text-center">
        <h1>Welcome to IDR</h1>
        <p>
          The Image Data Resource (IDR) is a public repository of image datasets from published scientific studies,
          <br />
          where the community can submit, search and access high-quality bio-image data.
        </p>
      </div>

      <Categories />
    </div>
  );
}

export default App;
