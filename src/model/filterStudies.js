
export function filterStudiesByMapQuery(studies, query) {
  if (query.startsWith("FIRST") || query.startsWith("LAST")) {
    // E.g. query is 'FIRST10:date' sort by 'date' and return first 10
    let limit = parseInt(query.replace('FIRST', '').replace('LAST', ''));
    let attr = query.split(':')[1];
    let desc = query.startsWith("FIRST") ? -1 : 1;
    // first filter studies, remove those that don't have 'attr'
    let sorted = studies
      .filter(study => study[attr] !== undefined)
      .sort((a, b) => {
        return a[attr] < b[attr] ? desc : a[attr] > b[attr] ? -desc : 0;
      });
    return sorted.slice(0, limit);
  }

  let matches = studies.filter(study => {
    // If no key-values loaded, filter out
    if (!study.mapValues) {
      return false;
    }
    let match = false;
    // first split query by AND and OR
    let ors = query.split(' OR ');
    ors.forEach(term => {
      let allAnds = true;
      let ands = term.split(' AND ');
      ands.forEach(mustMatch => {
        let queryKeyValue = mustMatch.split(":");
        let valueMatch = false;
        // check all key-values (may be duplicate keys) for value that matches
        for (let i=0; i<study.mapValues.length; i++){
          let kv = study.mapValues[i];
          if (kv[0] === queryKeyValue[0]) {
            let value = queryKeyValue[1].trim();
            if (value.substr(0, 4) === 'NOT ') {
              value = value.replace('NOT ', '');
              if (kv[1].toLowerCase().indexOf(value.toLowerCase()) == -1) {
                valueMatch = true;
              }
            } else if (kv[1].toLowerCase().indexOf(value.toLowerCase()) > -1) {
              valueMatch = true;
            }
          }
        }
        // if not found, then our AND term fails
        if (!valueMatch) {
          allAnds = false;
        }
      });
      if (allAnds) {
        match = true;
      }
    });
    return match;
  });
  return matches;
}
