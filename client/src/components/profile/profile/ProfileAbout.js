import React from "react";
import isEmpty from "../../../validation/is-empty";

const ProfileAbout = props => {
  const { profile } = props;

  // get first name
  const firstname = profile.user.name.trim("").split(" ")[0];

  // skills
  const skills = isEmpty(profile.skills)
    ? null
    : profile.skills.map(skill => (
        <div className="p-3">
          <i className="fa fa-check" /> {skill}
        </div>
      ));

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card card-body bg-light mb-3">
          <h3 className="text-center text-info">
            {firstname}
            's Bio
          </h3>
          <p className="lead">
            {isEmpty(profile.bio) ? (
              <span>{firstname} doesn't have a bio</span>
            ) : (
              profile.bio
            )}
          </p>
          <hr />
          <h3 className="text-center text-info">Skill Set</h3>
          <div className="row">
            <div className="d-flex flex-wrap justify-content-center align-items-center">
              {skills}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAbout;
