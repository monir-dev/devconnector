import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import propTypes from "prop-types";
import ProfileHeader from "./ProfileHeader";
import ProfileCreds from "./ProfileCreds";
import ProfileAbout from "./ProfileAbout";
import ProfileGithub from "./ProfileGithub";
import Spinner from "../../common/Spinner";
import { getProfileByHandle } from "../../../actions/profileAction";

class Profile extends Component {
  componentDidMount() {
    if (this.props.match.params.handle) {
      this.props.getProfileByHandle(this.props.match.params.handle);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profile.profile === null && this.props.profile.loading) {
      this.props.history.push("/not-found");
    }
  }

  render() {
    const { profile, loading } = this.props.profile;
    let profileContent;

    if (profile === null || loading) {
      profileContent = <Spinner />;
    } else {
      profileContent = (
        <div className="col-md-12">
          <div className="row">
            <div className="col-6">
              <Link to="/profiles" className="btn btn-light mb-3 float-left">
                Back To Profiles
              </Link>
            </div>
            <div className="col-6" />
          </div>
          <ProfileHeader profile={profile} />
          <ProfileAbout profile={profile} />
          <ProfileCreds
            education={profile.education}
            experience={profile.experience}
          />
          {profile.githubusername ? (
            <ProfileGithub username={profile.githubusername} />
          ) : null}
        </div>
      );
    }

    return (
      <div className="profile">
        <div className="container">
          <div className="row">{profileContent}</div>
        </div>
      </div>
    );
  }
}
Profile.propTypes = {
  profile: propTypes.object.isRequired,
  getProfileByHandle: propTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});
export default connect(
  mapStateToProps,
  { getProfileByHandle }
)(Profile);
