
export async function fetchStudies() {
    let base_url = "http://idr.openmicroscopy.org/";
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
    })
    return studies;
}
