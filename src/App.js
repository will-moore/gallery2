import React, { useState, useEffect } from 'react';
import 'foundation-sites/dist/css/foundation.min.css';
import './css/openmicroscopy.css';
import './css/idr.css';
import { ReactComponent as Logo } from './logo-idr.svg';
import Category from './Category';
import { fetchStudies,
         loadStudiesMapAnnotations,
         loadStudiesThumbnails } from './model/fetchData';

function App() {

  const [data, setData] = useState({ studies: [] });

  const categories = [
    {"label": "Most Recent", "index": 0, "query": "LAST10:date"},
    {"label": "Time-lapse imaging", "index": 1, "query": "Study Type:time OR Study Type:5D OR Study Type:3D-tracking"},
    {"label": "Light sheet fluorescence microscopy", "index": 2, "query": "Study Type:light sheet"},
    {"label": "Protein localization studies", "index": 3, "query": "Study Type:protein localization"},
    {"label": "Digital pathology imaging", "index": 4, "query":"Study Type:histology"},
    {"label": "Yeast studies", "index": 5, "query": "Organism: Saccharomyces cerevisiae OR Organism:Schizosaccharomyces pombe"},
    {"label": "High-content screening (human)", "index": 6, "query": "Organism:Homo sapiens AND Study Type:high content screen"}
  ];


  useEffect(() => {
    const fetchData = async () => {

      // Load studies, then load map annotations for them
      let studies = await fetchStudies();
      studies = await loadStudiesMapAnnotations(studies);
      studies = await loadStudiesThumbnails(studies);
      setData({studies});
    };

    fetchData();
  }, []);

  return (
    <div>
      <div class="main-nav-bar top-bar" id="main-menu">
        <div class="top-bar-left">
          <ul class="dropdown menu" data-dropdown-menu="219f5j-dropdown-menu" role="menubar">
            <li role="menuitem">
              <a class="logo" href="/" tabindex="0">
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
      <h1>Welcome to IDR</h1>
      
      {categories.map(category => (
        <Category
          key={category.label}
          data={category}
          studies={data.studies} />
      ))}
    </div>
  );
}

export default App;
