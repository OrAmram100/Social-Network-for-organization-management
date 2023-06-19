import "./messagePreview.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";


export default function MessagePreview({ messages }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const {organization} = useContext(AuthContext);


  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users/${organization._id}?userId=${messages.id}`);
      setUser(res.data);
    };
    if (messages && messages.id) {
      fetchUser();
    }
  }, [messages]);

  return (
    <div className="message-preview" >
    <div className="message-preview-container" >
      {user && (
        <>
        <ul>
            {messages.messageCount > 1 ? (
                <div className="messagePreviewWrapper">
                <Link
                className="messageTop"
                to={"/profile/" + user.firstName}
                style={{ textDecoration: "none" }}
              >
                <img
                  className="messageImg"
                  src={
                    user.profilePicture
                      ? PF + user.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""> 
                  </img>
                  <span>{user.firstName} {user.lastName} </span>&nbsp;

                  </Link>
                <li className="message-preview-li">
                sent  {messages.messageCount} messages!
            </li>
            </div>
            ):(
                <div className="messagePreviewWrapper">
                <Link
                className="commentTop"
                to={"/profile/" + user.firstName}
                style={{ textDecoration: "none" }}
              >
                <img
                  className="commentImg"
                  src={
                    user.profilePicture
                      ? PF + user.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""> 
                  </img>
                  <span>{user.firstName} {user.lastName} </span>&nbsp;

                  </Link>
                <li className="message-preview-li">
                sent a {messages.messageCount} message!
            </li>
            </div>
            )}
          <li
            className="toMessanger"
            key={messages.id}
            onClick={() => navigate(`/messanger/${user.firstName}`)}
          >
            Click here to chat with {user.firstName}!
          </li>
        </ul>
        </>
      )}
      
      </div>
    </div>
  );
}
