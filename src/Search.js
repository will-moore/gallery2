import React from 'react';
import CategoryStudy from './CategoryStudy';
import { filterStudiesByMapQuery } from './model/filterStudies';
const queryString = require('query-string');

function Search({studies, location}) {

  let query = queryString.parse(location.search).query;

  let filteredStudies = filterStudiesByMapQuery(studies, query)

  return (
    <div className="small-12 small-centered medium-12 medium-centered columns">
    <div id="studies" className="row horizontal studiesLayout">
      {filteredStudies.map(study => (
        <CategoryStudy key={study.objId}
                  study={study}
                />)
        )}
    </div>
    </div>
  );
}

export default Search;
