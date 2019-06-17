import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {

  const [data, setData] = useState({ studies: [] });

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        'http://idr.openmicroscopy.org/api/v0/m/screens/',
      );

      setData({studies: result.data.data});
    };

    fetchData();
  }, []);

  return (
    <ul>
      {data.studies.map(study => (
        <li key={study.id}>
          {study.Name}
        </li>
      ))}
    </ul>
  );
}

export default App;
