import React from "react";
import Moment from "react-moment";

const ProfileCreds = props => {
  const { education, experience } = props;

  // Experiences
  const experiences = experience.map((exp, index) => (
    <li key={exp._id} className="list-group-item">
      <h4>{exp.company}</h4>
      <p>
        <Moment format="YYYY/MM/DD">{exp.from}</Moment> -{" "}
        {exp.to === null ? (
          "Now"
        ) : (
          <Moment format="YYYY/MM/DD">{exp.to}</Moment>
        )}
      </p>
      <p>
        <strong>Position: </strong> {exp.title}
      </p>
      <p>
        {exp.location === "" ? null : (
          <span>
            <strong>Location: </strong>
            {exp.location}
          </span>
        )}
      </p>
      <p>
        {exp.description === "" ? null : (
          <span>
            <strong>Description: </strong>
            {exp.description}
          </span>
        )}
      </p>
    </li>
  ));

  // Educations
  const educations = education.map((edu, index) => (
    <li key={edu._id} className="list-group-item">
      <h4>{edu.school}</h4>
      <p>
        <Moment format="YYYY/MM/DD">{edu.from}</Moment> -{" "}
        {edu.to === null ? (
          "Now"
        ) : (
          <Moment format="YYYY/MM/DD">{edu.to}</Moment>
        )}
      </p>
      <p>
        <strong>Degree: </strong>
        {edu.degree}
      </p>
      <p>
        <strong>Field Of Study: </strong>
        {edu.fieldofstudy}
      </p>
      <p>
        {edu.description === "" ? null : (
          <span>
            <strong>Description: </strong>
            {edu.description}
          </span>
        )}
      </p>
    </li>
  ));

  return (
    <div className="row">
      <div className="col-md-6">
        <h3 className="text-center text-info">Experience</h3>
        <ul className="list-group">{experiences}</ul>
      </div>
      <div className="col-md-6">
        <h3 className="text-center text-info">Education</h3>
        <ul className="list-group">{educations}</ul>
      </div>
    </div>
  );
};

export default ProfileCreds;
