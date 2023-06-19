import "./connectionReqPreview.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Modal, useMantineTheme } from "@mantine/core";

export default function ConnectionReqPreview({ request, friendOffers }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const {organization} = useContext(AuthContext);
  const [visibleFriendsOffers, setVisibleFriendsOffers] = useState(4);
  const [isShowFriendsModalOpen , setIsShowFriendsModalOpen ] = useState(false);
  const [showVisibleFriendsOffer ,setShowvisibleFriendsOffer ] = useState(true);


  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users/${organization._id}?userId=${request}`);
      setUser(res.data);
    };
    if (request ) {
      fetchUser();
    }
  }, [request]);

  const showMoreFriendsOffer = () => {
    if (visibleFriendsOffers < friendOffers.length) {
      setIsShowFriendsModalOpen(true);
      setShowvisibleFriendsOffer(false);
    }
  };

  return (
    <>
        <div className="request-preview">
          <div className="request-preview-container">
            {user && (
              <>
                <ul>
                  <div className="requestPreviewWrapper">
                    <Link
                      className="requestTop"
                      to={"/profile/" + user.firstName}
                      style={{ textDecoration: "none" }}
                    >
                      <img
                        className="requestImg"
                        src={
                          user.profilePicture
                            ? PF + user.profilePicture
                            : PF + "person/noAvatar.png"
                        }
                        alt=""
                      />
                      <span>{user.firstName} {user.lastName}</span>&nbsp;
                    </Link>
                    <li className="request-preview-li">
                      sent you a connection request!
                    </li>
                  </div>
                  <li
                    className="toMessanger"
                    key={request}
                    onClick={() => navigate(`/profile/${user.firstName}`)}
                  >
                    Click here to {user.firstName}'s profile!
                  </li>
                </ul>
              </>
            )}
  
            {friendOffers?.length > 0 && (
              <>
                <div className="friend-offers-column">
                  <h3 className="connectionOffersH2">Connection Offers</h3>
                  <hr className="profilePopUpHr" />
                  {friendOffers.slice(0, visibleFriendsOffers).map((offer) => (
                    <div className="friend-offer-row" key={offer._id}>
                      <Link
                        className="requestTop"
                        to={"/profile/" + offer.firstName}
                        style={{ textDecoration: "none" }}
                      >
                        <img
                          className="requestImg"
                          src={
                            offer.profilePicture
                              ? PF + offer.profilePicture
                              : PF + "person/noAvatar.png"
                          }
                          alt=""
                        />
                        <span>
                          {offer.firstName} {offer.lastName}
                        </span>
                      </Link>
                    </div>
                  ))}
                  {friendOffers.length > 4 && visibleFriendsOffers < friendOffers.length && (
                    <button className="showMoreButtonInTopbar" onClick={showMoreFriendsOffer}>
                      Show More
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>  
        <Modal
          opened={isShowFriendsModalOpen}
          onClose={() => setIsShowFriendsModalOpen(false)}
        >
          <div className="modalContent">
            <h3>All {user?.firstName} Friend Offers ({friendOffers?.length})</h3>
            <div className="modalFriendsList">
              {friendOffers?.map((offer) => (
                <li key={offer._id} className="sidebarFriend" style={{ color: "black" }}>
                  <Link to={`/profile/${offer.firstName}`} className="link">
                    <div className="sidebarProfileImgContainer">
                      <img
                        className="sidebarProfileImg"
                        src={offer.profilePicture ? PF + offer.profilePicture : PF + "person/noAvatar.png"}
                        alt=""
                      />
                      <span className="sidebarOnline"></span>
                      <span className="sidebarUsername">
                        {offer.firstName} {offer.lastName}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </div>
          </div>
        </Modal>
    </>
  );
  
} 