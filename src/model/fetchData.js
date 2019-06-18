
let base_url = "http://idr.openmicroscopy.org/";

export function getStudyValue(study, key) {
  if (!study.mapValues) return;
  for (let i=0; i<study.mapValues.length; i++){
    let kv = study.mapValues[i];
    if (kv[0] === key) {
      return kv[1];
    }
  }
}

export async function fetchStudies() {
  // Load Projects AND Screens, sort them and render...
  let studies = await Promise.all([
    fetch(base_url + "api/v0/m/projects/?childCount=true"),
    fetch(base_url + "api/v0/m/screens/?childCount=true"),
  ]).then(responses =>
    Promise.all(responses.map(res => res.json()))
    ).then(([projects, screens]) => {
      let studies = projects.data;
      studies = studies.concat(screens.data);
      
      // ignore empty studies with no images
      studies = studies.filter(study => study['omero:childCount'] > 0);
      
      // sort by name, reverse
      studies.sort(function(a, b) {
        var nameA = a.Name.toUpperCase();
        var nameB = b.Name.toUpperCase();
        if (nameA < nameB) {
          return 1;
        }
        if (nameA > nameB) {
          return -1;
        }
        // names must be equal
        return 0;
      });
      
      // Add 'id', 'type' ("project"), studyId ("screen-1") to each
      studies = studies.map(study => {
        study.id = study['@id'];
        study.type = study['@type'].split('#')[1].toLowerCase();
        study.objId = `${ study.type }-${ study.id }`;
        return study;
      });
      return studies;
    });
  return studies;
}
  
  export async function loadStudiesMapAnnotations(studies) {
    let url = base_url + "webclient/api/annotations/?type=map";
    let data = studies
      .map(study => `${ study.type }=${ study.id }`)
      .join("&");
    url += '&' + data;
    return await fetch(url)
      .then(response => response.json())
      .then(data => {
        // populate the studies array...
        // dict of {'project-1' : key-values}
        let annsByParentId = {};
        data.annotations.forEach(ann => {
          let key = ann.link.parent.class;  // 'ProjectI'
          key = key.substr(0, key.length-1).toLowerCase();
          key += '-' + ann.link.parent.id;  // project-1
          if (!annsByParentId[key]) {
            annsByParentId[key] = [];
          }
          annsByParentId[key] = annsByParentId[key].concat(ann.values);
        });
        // Add mapValues to studies...
        studies = studies.map(study => {
          // immutable - create copy
          study = {...study};
          let key = `${ study['@type'].split('#')[1].toLowerCase() }-${ study['@id'] }`;
          let values = annsByParentId[key];
          if (values) {
            study.mapValues = values;
            let releaseDate = getStudyValue(study, 'Release Date');
            if (releaseDate) {
              study.date = new Date(releaseDate);
              if (isNaN(study.date.getTime())) {
                study.date = undefined;
              }
            }
          }
          return study;
        });
        return studies;
      });
  }

  export async function loadStudiesThumbnails(studies) {
    let url = base_url + "gallery-api/thumbnails/";
  
    let toFind = studies.map(study => `${ study.type }=${ study.id }`);
    return await fetch(url + '?' + toFind.join('&'))
      .then(response => response.json())
      .then(data => {
        return studies.map(study => {
          // immutable - copy...
          study = {...study};
          if (data[study.objId]) {
            study.image = data[study.objId].image;
            study.thumbnail = data[study.objId].thumbnail;
          }
          return study;
        })
      });
  }

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
                if (kv[1].toLowerCase().indexOf(value.toLowerCase()) === -1) {
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
