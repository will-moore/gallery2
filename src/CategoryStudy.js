import React from 'react';

function CategoryStudy({study}) {

  let studyStyle = {}
  if (study.thumbnail) {
    studyStyle['background-image'] = `url("${ study.thumbnail }")`;
  }

  return (
    <div key={study.objId} className="row study">
      <div>{study.id}</div>
      <div className="studyImage" style={studyStyle}>
        <a target="_blank" href="/webclient/?show=project-801">
          <div>
            <div class="studyText">
              <p title="We provide a user-friendly 3D editing tool to rapidly correct segmentation errors.  We test our method alongside other previously-published user-friendly methods, with focus on mid-gestation embryos, 3D cultures of pluripotent stem cells and pluripotent stem cell-derived neural rosettes.">
                NesSys: a novel method for accurate nuclear segmentation in 3D
              </p>
            </div>
            <div class="studyAuthors">
              Guillaume Blin, Daina Sadurska, Rosa Portero Migueles, Naiming Chen, Julia A. Watson, Sally Lowell
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}

export default CategoryStudy;
