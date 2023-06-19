import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import Task from "../../components/task/Task";
import "./profile.css"
import { useEffect,useState } from "react";
import axios from "axios";
import {useParams} from "react-router"
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user,setUser] = useState('');
  const {user: currentUser} = useContext(AuthContext);
  const username = useParams().username;
  const navigate = useNavigate();
  const {organization} = useContext(AuthContext);
  const [isSubordinate,setIsSubordinate] = useState(null);
  const [taskOpened, setTaskOpened] = useState(false);

  


  useEffect (() =>{
    const fetchUser = async () => {
      const res = await axios.get(`/users/${organization._id}?username=${username}`);
      setUser(res.data);
    };
  
    fetchUser();
  },[username]);



  useEffect(() => {
    const checkIfSubordinate = async () => {  
        const res = await axios.get(`/departments/manager/${organization._id}/${user._id}/${currentUser._id}`);
        setIsSubordinate(res.data)
      }
     if(user) 
      checkIfSubordinate();
  }, [user,currentUser]);

  const handleMessageClick = () => {
    navigate(`/messanger/${user.firstName}`);
  };


  return (
    <>
    <Topbar/>
    <div className="profile">
      <Sidebar/>
      <div className="profileRight">
        <div className="profileRightTop">
          <div className="profileCover">
            <img className="profileCoverImg"
             src={user.coverPicture ? PF + user.coverPicture : PF+ organization?.organizationPicture}
             alt="" />
            <img className="profileUserImg" 
            src={user.profilePicture ? PF + user.profilePicture : PF + "person/noAvatar.png"}
            alt="" />
          </div>
          <div className="profileInfo">
            <h4 className="profileInfoName">{user.firstName} {user.lastName }</h4>
            <span className="profileInfoDesc">{user.desc}</span>
            {currentUser._id !== user._id && user!== "" &&
            <button className="messageButton" onClick={handleMessageClick}>Message</button>
            }
            {currentUser._id !== user._id && user!== "" && isSubordinate === true &&
            <button className="messageButton" onClick={() => setTaskOpened(!taskOpened)}>Add Task</button>
            }
            {taskOpened && (
          <   Task
            modalOpened={taskOpened}
            setModalOpened={setTaskOpened}
            userId = {user._id}
          />
)}

          </div>

        </div>

        <div className="profileRightBottom">
          <Feed username={username}/>
          {user&&  
          <Rightbar user= {user}/>
}
        </div>
      </div>
    </div>
    </>
  )
}
