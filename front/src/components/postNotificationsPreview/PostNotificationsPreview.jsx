import "./postNotificationsPreview.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function PostNotificationsPreview({ post }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [likePostNotification,setLikePostNotification] = useState(false);
  const [commentPostNotification,setCommentPostNotification] = useState(false);
  const [taskNotification,setTaskNotification] = useState(false);
  const [taskStatusNotification,setTaskStatusNotification] = useState(false);

  const {organization} = useContext(AuthContext);


  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users/${organization._id}?userId=${post.userId}`);
      setUser(res.data);
    };
    const fetchUserLike = async () => {
      const res = await axios.get(`/users/${organization._id}?userId=${post.senderId}`);
      setUser(res.data);
    };
    const fetchUserPost = async () => {
      const res = await axios.get(`/users/${organization._id}?userId=${post.senderId}`);
      setUser(res.data);
    };
    if (post.userId) {
      fetchUser();
    }
    if (post.operation === "like") {
      setLikePostNotification(true);
      fetchUserLike();
    }
    else if (post.operation === "comment") {
      setCommentPostNotification(true);
      fetchUserPost();
    }
    else if (post.operation === "task") {
      setTaskNotification(true);
      fetchUserPost();
    }
    else if (post.operation === "changeTaskStatus") {
      setTaskStatusNotification(true);
      fetchUserPost();
    }
  }, [post]);

  return (
    <div className="postNotify-preview" >
    <div className="postNotify-preview-container" >
      {(user && post && !likePostNotification && !commentPostNotification && !taskNotification && !taskStatusNotification) &&(
        <>
        <ul>
                <div className="postNotifyPreviewWrapper">
                <Link
                className="postNotifyTop"
                to={"/profile/" + user.firstName}
                style={{ textDecoration: "none" }}
              >
                <img
                  className="postNotifyImg"
                  src={
                    user.profilePicture
                      ? PF + user.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""> 
                  </img>
                  <span>{user.firstName} {user.lastName} </span>&nbsp;

                  </Link>
                <li className="postNotify-preview-li">
                Upload a post!
            </li>
            </div>
          <li
            className="toMessanger"
            key={post._id}
            onClick={() => navigate(`/post/${post._id}`)}
          >
            Click here to see his post!
          </li>
          
        </ul>
        
        </>
      )}

{(user && likePostNotification && !commentPostNotification && !taskNotification) &&(
        <>
        <ul>
                <div className="postNotifyPreviewWrapper">
                <Link
                className="postNotifyTop"
                to={"/profile/" + user.firstName}
                style={{ textDecoration: "none" }}
              >
                <img
                  className="postNotifyImg"
                  src={
                    user.profilePicture
                      ? PF + user.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""> 
                  </img>
                  <span>{user.firstName} {user.lastName} </span>&nbsp;
                  </Link>
                <li className="postNotify-preview-li">
                likes your post!
            </li>
            </div>
          <li
            className="toMessanger"
            key={post._id}
            onClick={() => navigate(`/post/${post.post._id}`)}
          >
            Click here to see the post!
          </li>
          
        </ul>
        
        </>
      )}
      {(user && commentPostNotification) &&(
        <>
        <ul>
                <div className="postNotifyPreviewWrapper">
                <Link
                className="postNotifyTop"
                to={"/profile/" + user.firstName}
                style={{ textDecoration: "none" }}
              >
                <img
                  className="postNotifyImg"
                  src={
                    user.profilePicture
                      ? PF + user.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""> 
                  </img>
                  <span>{user.firstName} {user.lastName} </span>&nbsp;
                  </Link>
                <li className="postNotify-preview-li">
                comment on your post!
            </li>
            </div>
          <li
            className="toMessanger"
            key={post._id}
            onClick={() => navigate(`/post/${post.post._id}`)}
          >
            Click here to see the post!
          </li>
          
        </ul>
        
        </>
      )}
      {(user && taskNotification) &&(
        <>
        <ul>
                <div className="postNotifyPreviewWrapper">
                <Link
                className="postNotifyTop"
                to={"/profile/" + user.firstName}
                style={{ textDecoration: "none" }}
              >
                <img
                  className="postNotifyImg"
                  src={
                    user.profilePicture
                      ? PF + user.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""> 
                  </img>
                  <span>{user.firstName} {user.lastName} </span>&nbsp;
                  </Link>
                <li className="postNotify-preview-li">
                upload a task for you!
            </li>
            </div>
          <li
            className="toMessanger"
            key={post._id}
            onClick={() => navigate(`/task/${post.post._id}`)}
          >
            Click here to see the task!
          </li>
          
        </ul>
        
        </>
      )}

  {(user && taskStatusNotification) &&(
        <>
        <ul>
                <div className="postNotifyPreviewWrapper">
                <Link
                className="postNotifyTop"
                to={"/profile/" + user.firstName}
                style={{ textDecoration: "none" }}
              >
                <img
                  className="postNotifyImg"
                  src={
                    user.profilePicture
                      ? PF + user.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""> 
                  </img>
                  <span>{user.firstName} {user.lastName} </span>&nbsp;
                  </Link>
                <li className="postNotify-preview-li">
                change a status
            </li>
            </div>
          <li
            className="toMessanger"
            key={post._id}
            onClick={() => navigate(`/task/${post.post._id}`)}
          >
            Click here to see the task!
          </li>
          
        </ul>
        
        </>
      )}
      
      </div>
    </div>
  );
}
