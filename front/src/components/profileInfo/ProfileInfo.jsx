import React, { useState } from "react";
import "./profileInfo.css";
import { UilPen } from "@iconscout/react-unicons";
import ProfileModal from "../profileModal/ProfileModal";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function ProfileInfo({user}) {
  const [modalOpened, setModalOpened] = useState(false);
  const {user:currentUser} = useContext(AuthContext);
  const {organization} = useContext(AuthContext);

  var [year,month,day] = "";
  {user.birthdayDate && (
     [year, month, day] = user.birthdayDate.substring(0, 10).split('-')
  )}

  return (
    <div className="cardInfo">
      <div className="infoHead">
        <h2 className="infoText">{user.firstName} {user.lastName} Info:</h2>
        {currentUser._id == user._id && (
        <div>
          <UilPen
            width="2rem"
            height="1.2rem"
            onClick={() => setModalOpened(true)}
          />
          <ProfileModal
            modalOpened={modalOpened}
            setModalOpened={setModalOpened}
          />
        </div>
                  )}

      </div>

      <div className="info">
        <span>
          <b>Relationship: </b>
        </span>
        <span>{user.relationship}</span>
      </div>

{user.birthdayDate && (
      <div className="info">
        <span>
          <b>Birthday: </b>
        </span>
        <span>{user.birthdayDate? `${day}/${month}/${year}`: "-"}</span>
      </div>
)}

{user.from && (
      <div className="info">
        <span>
          <b>Country: </b>
        </span>
        <span>{user.from}</span>
      </div>
)}

{user.role && (
      <div className="info">
        <span>
          <b>Role: </b>
        </span>
        <span>{user.role}</span>
      </div>
)}



{user.city && (
      <div className="info">
        <span>
          <b>Lives in: </b>
        </span>
        <span>{user.city}</span>
      </div>
)}


      <div className="info">
        <span>
          <b>Works at: </b>
        </span>
        <span>{organization.organizationName}</span>
      </div>
    </div>
  );
};

