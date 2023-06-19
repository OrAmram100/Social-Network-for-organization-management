import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./online.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Online({onlineUsers,currentId}) {
  const [friends,setFriends] = useState([]);
  const [onlineFriends,setOnlineFriends] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const {organization} = useContext(AuthContext);


  useEffect(()=>{
    const getFriends = async () =>{
      try{
        const friendList = await axios.get(`/users/${organization._id}/friends/` + currentId);
        setFriends(friendList.data);
      }
      catch(err){
        console.log(err);
      }
    };
    getFriends();
  },[currentId])

   useEffect(()=>{
        setOnlineFriends(friends.filter((f)=>onlineUsers.includes(f._id)));
    },[friends,onlineUsers])

  return (
    <div className="chatOnline">
    {onlineFriends.map((o)=> (
      <Link to={"/profile/" + o.firstName} className="link">
    <div className="chatOnlineFriend" >
        <div className="chatOnlineImgContainer">
            <img className="chatOnlineImg" 
            src={o?.profilePicture ? 
                PF + o.profilePicture 
                : PF + "person/noAvatar.png"}
            alt=""/>
            <div className="chatOnlineBadge"></div>
        </div>
        <span className="chatOnlineName">{o?.firstName} {o?.lastName}</span>
    </div>
    </Link>
  ))}
</div>
)
  
}
