import React, { useState, useEffect } from 'react';
import './App.css';
import { fetchStudies, loadStudiesMapAnnotations } from './model/fetchData';

function App() {

  const [data, setData] = useState({ studies: [] });

  useEffect(() => {
    const fetchData = async () => {

      // Load studies, then load map annotations for them
      let studies = await fetchStudies();
      studies = await loadStudiesMapAnnotations(studies);
      setData({studies});
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Welcome to IDR</h1>
      <ul>
        {data.studies.map(study => (
          <li key={study.objId}>
            {study.Name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
