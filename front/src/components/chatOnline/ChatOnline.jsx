import axios from "axios";
import { useEffect } from "react";
import { useState } from "react"
import "./chatOnline.css"
import { Link } from "react-router-dom";
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"

export default function ChatOnline({onlineUsers, currentId, setCurrentChat}) {

    const [friends,setFriends] = useState([]);
    const [onlineFriends,setOnlineFriends] = useState([]);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const {organization} = useContext(AuthContext);


    useEffect (()=>{
        const getFriends = async() =>{
            try{
                const res = await axios.get(`/users/${organization._id}/friends/` + currentId);
                setFriends(res.data);
            }
            catch(err){
                console.log(err)
            }

        }
        getFriends();

    },[currentId])


    useEffect(()=>{
        setOnlineFriends(friends.filter((f)=>onlineUsers.includes(f._id)));
    },[friends,onlineUsers])



    const handleClick = async (user) =>{
        try{
            const res = await axios.get(`/conversations/find/${currentId}/${user._id}`);
            setCurrentChat(res.data);
        }catch(err){
            console.log(err)
        }

    }

  return (
    <div className="chatOnline">
        {onlineFriends.map((o)=> (
        <Link to={"/profile/" + o.firstName} className="link">
        <div className="chatOnlineFriend" onClick={()=>handleClick(o)}>
            <div className="chatOnlineImgContainer">
                <img className="chatOnlineImg" 
                src={o?.profilePicture ? 
                    PF + o.profilePicture 
                    : PF + "person/noAvatar.png"}
                alt=""/>
                <div className="chatOnlineBadge"></div>
            </div>
            <span className="chatOnlineName">{o?.firstName} {o?.lastName }</span>
        </div>
        </Link>
      ))}
    </div>
  )
}
