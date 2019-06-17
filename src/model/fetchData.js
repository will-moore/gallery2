
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
        study.objId = `${ study.id }-${ study.type }`;
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
  