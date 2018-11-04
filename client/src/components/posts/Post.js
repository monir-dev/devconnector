import React, { Component } from "react";
import Spinner from "../common/Spinner";
import { connect } from "react-redux";
import { getPost, addComment } from "../../actions/postAction";
import PostFeed from "../posts/PostFeed";
import { Link } from "react-router-dom";
import CommentForm from "./CommentForm";
import CommentFeed from "./CommentFeed";

class Post extends Component {
  componentDidMount() {
    this.props.getPost(this.props.match.params.id);
  }

  render() {
    const { post, loading } = this.props.post;
    let postContent;

    if (post === null || loading || Object.keys(post).length === 0) {
      postContent = <Spinner />;
    } else {
      postContent = (
        <div>
          <PostFeed post={post} showActions={false} />
          <CommentForm postId={post._id} />
          <CommentFeed postId={post._id} comments={post.comments} />
        </div>
      );
    }

    return (
      <div className="post">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Link
                to="/feed"
                className="btn btn-light mb3"
                style={{ marginBottom: "20px" }}
              >
                Back to feed
              </Link>
              <br />
              {postContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProp = state => ({
  post: state.post
});

export default connect(
  mapStateToProp,
  { getPost, addComment }
)(Post);
