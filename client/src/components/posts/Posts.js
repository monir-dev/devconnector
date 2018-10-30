import React, { Component } from "react";
import { connect } from "react-redux";
import { getPosts } from "../../actions/postAction";
import Spinner from "../common/Spinner";
import PostForm from "./PostForm";
import PostFeed from "./PostFeed";

export class Posts extends Component {
  componentDidMount() {
    this.props.getPosts();
  }

  render() {
    const { posts, loading } = this.props.post;
    let PostContent;

    if (posts === null || loading) {
      PostContent = <Spinner />;
    } else {
      PostContent = posts.map(post => <PostFeed key={post._id} post={post} />);
    }
    return (
      <div className="feed">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <PostForm />
              <div className="posts">{PostContent}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  post: state.post,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getPosts }
)(Posts);
