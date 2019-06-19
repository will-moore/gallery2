import React from 'react';

function Search({studies}) {

  return (
    <div id="studies" className="row horizontal">
        Search {studies.length}
    </div>
  );
}

export default Search;
