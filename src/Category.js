import React from 'react';
import { filterStudiesByMapQuery } from './model/fetchData';

function Category({data, studies}) {

  let categoryStudies = filterStudiesByMapQuery(studies, data.query);
  if (categoryStudies.length === 0) {
    return <span></span>
  }
  return (
    <div className="row">
        <h1>{data.label} ({ categoryStudies.length })</h1>
        <div className="category">
        {categoryStudies.map(study => (
            <div key={study.objId}>
            {study.Name}
            {study.thumbnail && <img alt="Study Thumbnail" src={ study.thumbnail } />}
            </div>
        ))}
        </div>
    </div>
  );
}

export default Category;
