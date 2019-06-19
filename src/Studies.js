import React, { useState, useEffect } from 'react';
import Categories from './Categories';
import { fetchStudies,
         loadStudiesMapAnnotations,
         loadStudiesThumbnails } from './model/fetchData';

function Studies() {

  const [data, setData] = useState({ studies: [] });

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
      <Categories
        studies={data.studies}
      />
  );
}

export default Studies;
