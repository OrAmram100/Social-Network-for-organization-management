import "./rightbar.css"
import Online from "../online/Online"
import ProfileInfo from "../profileInfo/ProfileInfo"
import { useEffect, useRef } from "react";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {Add, Remove,EmojiEventsRounded} from "@material-ui/icons";
import {EditLocationRounded,ThumbUp,ThumbDown} from '@material-ui/icons';
import {io} from "socket.io-client"
import { Modal, useMantineTheme } from "@mantine/core";




export default function Rightbar({user}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const {user:currentUser, dispatch} = useContext(AuthContext);
  const {organization} = useContext(AuthContext);
  const [recieveConnectionRequested,setRecieveConnectionRequested] = useState(currentUser.recvConnectionsReq?.includes(user?._id));
  const [sendingConnectionRequested,setSendingConnectionRequested] = useState(currentUser.sendConnectionsReq?.includes(user?._id)); 
  const [connected,setConnected] = useState(currentUser.connections?.includes(user?._id)); 
  const [usersBirthdayToday,setUsersBirthdayToday] = useState([]);
  const[onlineUsers,setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [top3ScoringUsers, setTop3ScoringUsers] = useState(null);
  const [loadingFriends, setLoadingFriends] = useState(false);



  useEffect(()=>{
    setSocket(io("ws://localhost:8900"));
    socket?.emit("addUser", user?._id);

    },[]);


    const get3TopScoring = async () =>{
      try{
         const top3ScoringUsers = await axios.get(`/users/${organization._id}/top3Score/`); 
        setTop3ScoringUsers(top3ScoringUsers.data);
      }
      catch(err){
        console.log(err);
      }
    };

    useEffect(()=>{
      
      get3TopScoring();
        
    },[user,organization])

    useEffect(()=>{
      socket?.on("getRenderTop3ScoringUsers", data=>{
        get3TopScoring();
                    })
},[user?._id,socket,top3ScoringUsers]);

  useEffect(() => {
    const getUsersBirthday = async () =>{
    await axios.get(`/users/${organization._id}/allusers/`)
      .then(response => {
        setUsersBirthdayToday([]);
        const users = response.data;
        const today = new Date();
        const todayMonth = today.getMonth() + 1;
        const todayDay = today.getDate();

        for (let i = 0; i < users.length; i++) {
          const user = users[i];
          const birthdate = new Date(user.birthdayDate);
          const birthdateMonth = birthdate.getMonth() + 1;
          const birthdateDay = birthdate.getDate();
          if (birthdateMonth === todayMonth && birthdateDay === todayDay) {
            setUsersBirthdayToday(usersBirthdayToday => [...usersBirthdayToday, user])
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
    }
      getUsersBirthday();
  }, []);

  useEffect(()=>{
    const getFriends = async () =>{
      try{
         const friendList = await axios.get(`/users/${organization._id}/friends/` + user._id); 
        setFriends(friendList.data);
        setLoadingFriends(true);
      }
      catch(err){
        console.log(err);
      }
    };
    if (user?._id !== undefined && user?._id !== null) 
      getFriends();
      setRecieveConnectionRequested (currentUser.recvConnectionsReq.includes(user?._id));
      setConnected(currentUser.connections.includes(user?._id));
      setSendingConnectionRequested(currentUser.sendConnectionsReq.includes(user?._id))

  },[user,recieveConnectionRequested,sendingConnectionRequested,currentUser,connected])

  useEffect(()=>{
    socket?.on("getUsers",(users)=>{  //to see who is online
        setOnlineUsers(currentUser.connections.filter((f)=> users.some((u)=>u.userId === f)));
    })
},[currentUser,socket])
  

  const declineClick = async () => {
    try {
    await axios.put("/users/"+ organization._id +"/" + user._id + "/decline",{userId: currentUser._id,});// decline to connection request.
    dispatch({type:"DECLINE",payload: user._id});
    socket?.emit("declineConnectionReq",{
      senderId: currentUser._id,
      recieverId: user._id,
  })
    }
    catch(err){
      console.log(err);
    }
  }

  


  const handleClick = async () => {
    try {
      if(!connected && recieveConnectionRequested && !sendingConnectionRequested) { // confirm the connection
        await axios.put("/users/"+ organization._id + "/" + user._id + "/confirm",{userId: currentUser._id,});
        dispatch({type:"CONFIRM",payload: user._id});
        socket?.emit("confirmConnecReqRecv",{
          senderId: currentUser._id,
          recieverId: user._id,
      })
      }
      else if(!connected && !recieveConnectionRequested && sendingConnectionRequested) { // withdraw to pending request.
        await axios.put("/users/" + organization._id + "/" + user._id + "/withdraw",{userId: currentUser._id,});
        dispatch({type:"WITHDRAW",payload: user._id});
        socket?.emit("rejectConnectionReq",{
          senderId: currentUser._id,
          recieverId: user._id,
      })
      }
      else if(!connected && !recieveConnectionRequested && !sendingConnectionRequested) // send connect request
      {
        await axios.put("/users/"+ organization._id + "/"   + user._id + "/connectionreq",{userId: currentUser._id,});
        dispatch({type:"CONNECTIONREQUEST",payload: user._id});
        socket?.emit("sendConnectionReqNotification",{
          senderId: currentUser._id,
          recieverId: user._id,
      })
      

      }
      else { // unconnect the connection
        await axios.put("/users/" + organization._id + "/" + user._id + "/unconnect",{userId: currentUser._id,});
        dispatch({type:"UNCONNECT",payload: user._id})

        socket?.emit("unConnectReqNotification",{
          senderId: currentUser._id,
          recieverId: user._id,
      })
      }
    }
    catch(err){
      console.log(err);
    }
  }


  const ProfileRightbar = () => { 
    const [visibleFriends, setVisibleFriends] = useState(4);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showMoreFriends = () => {
      if (visibleFriends < friends.length) {
        setIsModalOpen(true);
      }
    };
    return (
      <>
      {user.firstName !== currentUser.firstName  && user.firstName !== undefined && currentUser.firstName!== undefined && (
        <button className="rightbarFollowButton" onClick={handleClick}>
          {connected ? "Unconnect" : recieveConnectionRequested ? "Confirm" : sendingConnectionRequested ? "Pending": "Connect"}
          {connected ? <Remove /> : recieveConnectionRequested ? <ThumbUp /> : sendingConnectionRequested ? <EditLocationRounded />: <Add />} 
          </button>
          
      )}
      {
        user.firstName !== currentUser.firstName  && user.firstName !== undefined && currentUser.firstName!== undefined &&
        !connected && recieveConnectionRequested && (
          <div>
          <button className="rightbarFollowButton"onClick={declineClick}>  
            Decline <ThumbDown/>
            </button>
            </div>
        )}
      <ProfileInfo user ={user} />
      <br></br>
      <h2 className="rightbarTitle">
      <span style={{ display: 'flex', alignItems: 'center' }}>
        User friends
        {loadingFriends &&
        <h6 style={{ marginLeft: '10px', fontSize: '17px' }}>
          ({ friends.length > 0 ? friends.length : 'No Friends'})
        </h6>
        }
      </span>
    </h2>
      <hr className="rightbarHr"></hr>
      <div></div>
      <div className="rightbarFollowings">
   
      {friends.slice(0, visibleFriends).map((friend) => (
          <div className="rightbarFollowing" key={friend._id} style={{color:"black"}}>
          <Link to={"/profile/" + friend.firstName} className="link">
          <div className="rightProfileImgContainer">
          <img 
          src={friend.profilePicture ? PF + friend.profilePicture : PF + "person/noAvatar.png"} 
          alt="" 
          className="rightbarFollowingImg" />
          <span className="rightbarFollowingName">{friend.firstName} {friend.lastName }</span>
          </div>
        </Link>
        </div>
        ))}
              </div>
          {friends.length > 4 && visibleFriends < friends.length && (
        <button className="showMoreButtonInRightbar" onClick={showMoreFriends}>
          Show More
        </button>
      )}

<Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="modalContent">
          <h3>All {user.firstName} Friends ({friends.length})</h3>
          <div className="modalFriendsList">
            {friends.map((friend) => (
              <li key={friend._id} className="sidebarFriend" style={{ color: "black"  }}>
              <Link to={`/profile/${friend.firstName}`} className="link">
              <div className="sidebarProfileImgContainer">
              <img 
              className="sidebarProfileImg"
              src={friend.profilePicture ? PF + friend.profilePicture : PF + "person/noAvatar.png"} 
              alt=""/>
              <span className="sidebarOnline"></span>
          <span className="sidebarUsername">{friend.firstName} {friend.lastName}</span>
          </div>
          </Link>
        </li>   
            ))}
          </div>
        </div>
      </Modal>

      </>
    )
  }

  const HomeRightbar = () => {

    return (
      <>
      { usersBirthdayToday.map(u=>(
        <div key={u._id} className="birthdayContainer">
        <img className="birthdayImg" src="assets/gift.png" alt=""/>
        <div className="postNotifyPreviewWrapper">
        <Link
        className="postNotifyTop"
        to={"/profile/" + u.firstName}
        style={{ textDecoration: "none" }}
      >
        <img
          className="postNotifyImg"
          src={
            u.profilePicture
              ? PF + u.profilePicture
              : PF + "person/noAvatar.png"
          }
          alt=""> 
          </img>
          <b className="birthdayTextName">{u.firstName} {u.lastName} </b>&nbsp;
          </Link>
        <b className="birthdayText">
        have a birthday today!
    </b>
    </div>
    </div>
        
        
      )

      
      )
      }
       <Link to="/about">
      <img className="rightbarAd"src={PF + organization.organizationPicture }alt=""/>
      </Link>

      <div className="winnersFrame">
  <EmojiEventsRounded className="winnerCup" />
  <span className="topScoreText">Top Score</span>
</div>
<div className="scoreList">
  {top3ScoringUsers?.map((u, i) => (
    <div key={u._id} className="scoreContainer" style={{marginLeft: `${i*20}px`}}>
    <div className="scoreWrapper">
      <Link className="link" to={"/profile/" + u.firstName} style={{ textDecoration: "none" }}>
        <span className="scoreUserTextIndex">{i+1}.</span>
        <img
            className="scoreImg"
            src={u.profilePicture ? PF + u.profilePicture : PF + "person/noAvatar.png"}
            alt=""
          />
          <span className="scoreUserTextName">{u.firstName} {u.lastName} ( {u.score} )</span>
      </Link>
    </div>
  </div>
  ))}
</div>

        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
                  <Online key={currentUser._id}  onlineUsers ={onlineUsers} 
                  currentId={currentUser._id}/>
        </ul>
        
  
      </>
    )
  }

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
       {user? <ProfileRightbar/> : <HomeRightbar/>}
      </div>
    </div>
  )
}
