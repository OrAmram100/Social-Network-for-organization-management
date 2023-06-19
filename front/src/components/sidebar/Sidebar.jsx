import "./sidebar.css";
import {
  RssFeed,
  Chat,
  Group,
  ListAlt,
  HelpOutline,
  WorkOutline,
  Event,
  AccountTree,
  Email,
  DynamicFeed
} from "@material-ui/icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import Task from "../task/Task";
import SendingEmail from "../sendingEmail/SendingEmail";
import { Modal, useMantineTheme } from "@mantine/core";



export default function Sidebar() {
  const [displayedFriends, setDisplayedFriends] = useState(3);
  const [modalOpen, setModalOpen] = useState(false);
  const [friendsConversation, setFriendsConversation] = useState([]);
  const {user:currentUser} = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [taskOpened, setTaskOpened] = useState(false);
  const [mailPageOpened, setMailPageOpened] = useState(false);
  const {organization} = useContext(AuthContext);




  useEffect(()=>{
    const getFriends = async () =>{
      try{
        const friendList = await axios.get(`/conversations/${organization._id}/friends/sidebar/` + currentUser?._id);
        setFriendsConversation(friendList.data);
      }
      catch(err){
        console.log(err);
      }
    };
    getFriends();
  },[currentUser])

  /*<li className="sidebarListItem"onClick={() => setMailPageOpened(!mailPageOpened)}>
            <Email className="sidebarIcon"  />
            <span className="sidebarListItemText">Send email
            </span>
          {mailPageOpened && (
          <   SendingEmail
            modalOpened={mailPageOpened}
            setModalOpened={setMailPageOpened}
          />
)}
          </li> */

  const showMoreFriends = () => {       
    setModalOpen(true);
  };

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
         
          <Link
            to={"/"}
            style={{ textDecoration: "none", color: "black" }}>
               <li className="sidebarListItem">
            <RssFeed className="sidebarIcon" />
            <span className="sidebarListItemText">Feed</span>
            </li>
            </Link>
         
          <Link
          to={"/messanger"}
          style={{ textDecoration: "none", color: "black"  }}>
          <li className="sidebarListItem">
            <Chat className="sidebarIcon" />
            <span className="sidebarListItemText">Chats
            </span>
          </li>      
          </Link>

          <Link to={"/" + "post"}
          style={{ textDecoration: "none", color: "black"  }}>
          <li className="sidebarListItem" >
            <DynamicFeed className="sidebarIcon" />
            <span className="sidebarListItemText">Posts</span>
          </li>
          </Link>


          <Link to={"/" + "question"}
          style={{ textDecoration: "none", color: "black"  }}>
          <li className="sidebarListItem" >
            <HelpOutline className="sidebarIcon" />
            <span className="sidebarListItemText">Questions</span>
          </li>
          </Link>

          <Link to={"/" + "event"}
          style={{ textDecoration: "none", color: "black"  }}>
          <li className="sidebarListItem">
            <Event className="sidebarIcon" />
            <span className="sidebarListItemText">Events</span>
          </li>
          </Link>

          <Link to={"/" + "tasks"}
          style={{ textDecoration: "none", color: "black"  }}>
          <li className="sidebarListItem">
            <ListAlt className="sidebarIcon" />
            <span className="sidebarListItemText">Tasks</span>
          </li>
          </Link>


          {(currentUser.userType === "CEO" || currentUser.userType === "Manager") && (
          <li className="sidebarListItem" onClick={() => setTaskOpened(!taskOpened)}>
            <WorkOutline className="sidebarIcon"  />
            <span className="sidebarListItemText">Create Task
            </span>
          {taskOpened && (
          <   Task
            modalOpened={taskOpened}
            setModalOpened={setTaskOpened}
          />
)}
          </li>
)}

          <Link
            to={"/attendance/"}
            style={{ textDecoration: "none", color: "black"  }}>
          <li className="sidebarListItem">
          
            <Event className="sidebarIcon"  />
            <span className="sidebarListItemText">Calendar</span>
          </li>
          </Link>
          <Link
          to={"/hierarchy/"}
          style={{ textDecoration: "none", color: "black"  }}>
          <li className="sidebarListItem">
            <AccountTree className="sidebarIcon" />
            <span className="sidebarListItemText">Hierarchy</span>
          </li>
          </Link>
          
        </ul>
        <hr className="sidebarHr"/>
        <ul className="sidebarFreindsList">
        {friendsConversation.slice(0, displayedFriends).map((friend) => (
            <li key={friend._id} className="sidebarFriend" style={{ color: "black"  }}>
            <Link to={`/messanger/${friend.firstName}`} className="link">
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
        {friendsConversation.length > displayedFriends && (
          <button className="showMoreButtonInSidebar" onClick={showMoreFriends}>
            Show More
          </button>
        )}

<Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <div className="modalContent">
          <h3>All Your Conversations ({friendsConversation.length})</h3>
          <div className="sidebarFreindsList">
            {friendsConversation.map((friend) => (
              <li key={friend._id} className="sidebarFriend" style={{ color: "black"  }}>
              <Link to={`/messanger/${friend.firstName}`} className="link">
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
        </ul>
      </div>
    </div>
  );
}