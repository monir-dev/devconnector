import React, { Component } from "react";
import { connect } from "react-redux";
import { addPost } from "../../actions/postAction";
import TextAreaFiledGroup from "../common/TextAreaFiledGroup";

class PostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (nextProps.post) {
      this.setState({ errors: {} });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const { user } = this.props.auth;

    const postData = {
      text: this.state.text,
      name: user.name,
      avatar: user.avatar
    };

    this.props.addPost(postData);
    this.setState({ text: "" });
  };

  render() {
    const { errors } = this.props;

    return (
      <div className="post-form mb-3">
        <div className="card card-info">
          <div className="card-header bg-info text-white">Say Somthing...</div>
          <div className="card-body">
            <form onSubmit={this.onSubmit}>
              <TextAreaFiledGroup
                name="text"
                placeholder="Create a post"
                value={this.state.text}
                error={errors.text}
                onChange={this.onChange}
              />
              <button type="submit" className="btn btn-dark">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  post: state.post,
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addPost }
)(PostForm);
