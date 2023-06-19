import axios from "axios";
import { useEffect } from "react";
import { useState } from "react"
import "./conversation.css"
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Conversation({conversation, currentUser,numOfUnReadMessages}) {
  const [user,setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const {organization} = useContext(AuthContext);


  useEffect(()=>{
    const friendId = conversation.members.find(m=> m !== currentUser._id);

    const getUser = async ()=>{
      try{
        const res = await axios(`/users/${organization._id}?userId=` + friendId);
        setUser(res.data);
    }catch(err){
      console.log(err);
    }
  }
  getUser();
  },[currentUser,conversation]);

  return (
    <div className= "conversation">
        <div className="chatOnlineImgContainer">
        <img className="conversationImg"src={ user?.profilePicture
            ? PF + user.profilePicture
            : PF + "person/noAvatar.png"
        }
        alt=""/>
        {numOfUnReadMessages > 0 &&
              <div className="conversationBadge">
                <span className="numOfUnReadMessages">{numOfUnReadMessages}</span>
              </div>
        }
        </div>
        <span className="conversationName">{user?.firstName} {user?.lastName } </span>
      
    </div>
  );
}
