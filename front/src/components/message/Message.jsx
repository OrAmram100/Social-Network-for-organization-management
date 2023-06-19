import "./message.css";
import {format} from "timeago.js"
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Message({message,own, senderId}) {
  const [user,setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const {organization} = useContext(AuthContext);


  useEffect(()=>{
    const getUser = async ()=>{
      try{
        const res = await axios(`/users/${organization._id}?userId=${senderId}`);
        setUser(res.data);
    }catch(err){
      console.log(err);
    }
  }
  getUser();
  },[senderId]);


  return (
    <div className={own ? "message own" : "message" }>
        <div className="messageTop">
          {!own ?(
        <Link
                  className="commentTop"
                  to={"/profile/" + user?.firstName}
                >
            <img className="messageImg" src={ user?.profilePicture
            ? PF + user.profilePicture
            : PF + "person/noAvatar.png"
        }
        alt=""/>
        <span className="">{user?.firstName} {user?.lastName } </span>

        </Link>
            ): (
              <>
              <Link
                  className="commentTop"
                  to={"/profile/" + user?.firstName}
                >
              <span className="">{user?.firstName} {user?.lastName } </span>
              
            <img className="messageImg" src={ user?.profilePicture
            ? PF + user.profilePicture
            : PF + "person/noAvatar.png"
        }
        alt=""/>
          </Link>
        </>
            )}
            

        </div>
        <div className="commentCenter">
                  <div className="commentFrame">
            <p className="messageText" >{message.text}</p>
            </div>
            </div>
        <div className="messageBottom">{format(message.createdAt)}</div>

      
    </div>
  )
}
