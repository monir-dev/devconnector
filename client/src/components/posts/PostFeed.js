import React, { Component } from "react";

class PostFeed extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { post } = this.props;
    return (
      <div className="posts">
        <div className="card card-body mb-3">
          <div className="row">
            <div className="col-md-2">
              <a href="profile.html">
                <img
                  className="rounded-circle d-none d-md-block"
                  src={post.avatar}
                  alt={post.name}
                />
              </a>
              <br />
              <p className="text-center">{post.name}</p>
            </div>
            <div className="col-md-10">
              <p className="lead">{post.text}</p>
              <button type="button" className="btn btn-light mr-1">
                <i className="text-info fas fa-thumbs-up" />
                <span className="badge badge-light">4</span>
              </button>
              <button type="button" className="btn btn-light mr-1">
                <i className="text-secondary fas fa-thumbs-down" />
              </button>
              <a href="post.html" className="btn btn-info mr-1">
                Comments
              </a>
              {/* <button type="button" className="btn btn-danger mr-1">
              <i className="fas fa-times" />
            </button> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PostFeed;
