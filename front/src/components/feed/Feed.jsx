import { useEffect } from "react";
import { useState } from "react";
import Post from "../post/Post"
import Share from "../share/Share"
import "./feed.css"
import axios from "axios"
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {useParams} from "react-router"
import TaskPreview from "../taskPreview/TaskPreview";
import {ArchiveOutlined} from "@material-ui/icons"
import { Modal, useMantineTheme } from "@mantine/core";


export default function Feed({ username}) {
  const[posts,setPosts] = useState([]);
  const[tasks,setTasks] = useState([]);
  const {user} = useContext(AuthContext);
  const paramsPostType = useParams().postType;
  const {organization} = useContext(AuthContext);
  const [archiveButtonClicked, setArchiveButtonClicked] = useState(false);
  const theme = useMantineTheme();

  useEffect (() => {
    const fetchPostsOrTasks = async () => {
      let res;
      if (!paramsPostType) {
        res = username 
          ? await axios.get(`/posts/${organization._id}/profile/` + username) 
          : await axios.get(`posts/${organization._id}/timeline/` + user._id);
        setTasks([]);
        setPosts(res.data.sort((p1,p2)=>{
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        }));
      } else if(paramsPostType !== "tasks") {
        res = username 
          ? await axios.get(`/posts/${organization._id}/profile/${username}/type/${paramsPostType}`) 
          : await axios.get(`/posts/${organization._id}/timeline/${user._id}/type/${paramsPostType}`);
        setTasks([]);
        setPosts(res.data.sort((p1,p2)=>{
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        }));
      } else if(paramsPostType === "tasks") {
        res = await axios.get(`/tasks/${organization._id}/${user._id}/allSubordinatesTasks`);
        setPosts([]);
        setTasks(res.data.sort((p1,p2)=>{
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        }));
      }
    };
  
    fetchPostsOrTasks();
  }, [username, user._id, paramsPostType]);


  return (
    
    <div className="feed">
     
      <div className="feedWrapper">
        {paramsPostType === "event" &&(
          <h1> Events</h1>
        )}
          {paramsPostType === "tasks" &&(
          <h1> Tasks</h1>
        )}
        
        {((!username || username === user.firstName) && (paramsPostType !== "tasks")&& (paramsPostType !== "event")) && <Share paramsPostType = {paramsPostType}/>}
        {posts.length > 0 &&
         posts.map((p)=> (
        <Post key={p._id} post = {p} username = {username}/>
        ))}

        {paramsPostType === "tasks" &&(
          <>
           <div className="archive" onClick={()=> setArchiveButtonClicked(!archiveButtonClicked)}>
            <ArchiveOutlined htmlColor="gray" />
            <button className="archiveButton">{archiveButtonClicked ? "Active Tasks" : "Archived"}</button>
          </div>
          {tasks.length > 0 && (
            tasks.map((t) => (
              <>
              {(t.status !== "Done" && !archiveButtonClicked) &&
              <TaskPreview key={t._id} task={t} username={username} />
              }
              {(t.status === "Done" && archiveButtonClicked) &&(
              
              <TaskPreview key={t._id} task={t} username={username} /> 
              )
        }
        </>
          )))}
          </>
        )}
      </div>
    </div>
  );
}