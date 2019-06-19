import React, { useState, useEffect } from 'react';
import { Router, Link } from "@reach/router"
import Categories from './Categories';
import Search from './Search';
import { fetchStudies,
         loadStudiesMapAnnotations,
         loadStudiesThumbnails } from './model/fetchData';

function Studies() {

  const [data, setData] = useState({ studies: [] });

  useEffect(() => {
    const fetchData = async () => {

      // Load studies, then load map annotations and thumbnails for them
      let studies = await fetchStudies();
      studies = await loadStudiesMapAnnotations(studies);
      studies = await loadStudiesThumbnails(studies);
      setData({studies});
    };

    fetchData();
  }, []);

  return (
    <div>
      <Link to="search">Search</Link>
      <Router primary={false}>
        <Categories
          path="/"
          studies={data.studies}
        />
        <Search
          path="/search/"
          studies={data.studies}
        />
      </Router>
    </div>
  );
}

export default Studies;
