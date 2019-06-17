import React from 'react';
import { filterStudiesByMapQuery } from './model/fetchData';

function Category({data, studies}) {

  let categoryStudies = filterStudiesByMapQuery(studies, data.query);
  if (categoryStudies.length === 0) {
    return <span></span>
  }
  return (
    <div>
        <h1>{data.label} ({ categoryStudies.length })</h1>
        <ul>
        {categoryStudies.map(study => (
            <li key={study.objId}>
            {study.Name}
            {study.thumbnail && <img alt="Study Thumbnail" src={ study.thumbnail } />}
            </li>
        ))}
        </ul>
    </div>
  );
}

export default Category;
