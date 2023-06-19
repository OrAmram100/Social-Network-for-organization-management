import "./topbar.css"
import {Search, Person, Chat, Notifications, ExitToApp,AccountCircle,Add, Settings,TollOutlined} from "@material-ui/icons"
import {Link} from "react-router-dom"
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { logoutCall } from "../../apiCalls";
import { useEffect,useState,useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, useMantineTheme } from "@mantine/core";
import {io} from "socket.io-client";
import MessagePreview from "../messagePreview/MessagePreview"
import ConnectionReqPreview from "../connectionReqPreview/ConnectionReqPreview"
import PostNotifyPreview from "../postNotificationsPreview/PostNotificationsPreview"
import axios from "axios";
import {Delete} from "@material-ui/icons"
import {Undo} from "@material-ui/icons"



export default function Topbar() {
    const [notifications, setNotifications] = useState([]);
    const [openProfileImg,setOpenProfileImg] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSettingsPopupOpen,setIsSettingsPopupOpen] = useState(false);
    const theme = useMantineTheme();
    const [clickedintro,setClickedintro] = useState(false);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [editOrganizationPopUp, setEditOrganizationPopUp] = useState(false);
    const [deleteOrganizationPopupOpen, setDeleteOrganizationPopupOpen] = useState(false);
    const [friendOffers, setFriendOffers] = useState([]);


    const organizationName = useRef();
    const numOfEmployee = useRef();
    const desc = useRef();
    const [organizationPicturefile,setOrganizationPicturefile] = useState(null);

    const firstName = useRef();
    const lastName = useRef();
    const password = useRef(null);
    const email = useRef();
    const passwordAgain = useRef(null);



    const [openSearchResult, setOpenSearchResult] = useState(false);
    const navigate = useNavigate();
    const {dispatch} = useContext(AuthContext);
    const {user} = useContext(AuthContext);
    const {organization} = useContext(AuthContext);

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [users, setUsers] = useState([]);
    const profileImgPopup = useRef(null);
    const searchBarPopup = useRef(null);
    const openMessagePreview = useRef(null);
    const openNotificationReqPreview = useRef(null);
    const openNotificationPostPreview = useRef(null);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [socket, setSocket] = useState(null);
    const [showMessagePreview, setShowMessagePreview] = useState(false);
    const [showConnectionReqPreview, setShowConnectionReqPreview] = useState(false);
    const [showPostNotificationsPreview, setShowPostNotificationsPreview] = useState(false);
    const [recieverMessages, setRecieverMessages] = useState(false);
    const [newConnectionReqArrived,setNewConnectionReqArrived] = useState(null);
    const [confirmConnecReqRecv,setConfirmConnecReqRecv] = useState(null);

    const [taskNotification,setTaskNotification] = useState(null);

    const [taskStatusNotification,setTaskStatusNotification] = useState(null);


    const [rejectConnectionReq,setRejectConnectionReq] = useState(null);
    const [declineConnectionReq,setDeclineConnectionReq] = useState(null);
    const [unConnectReqNotification,setUnConnectReqNotification] = useState(null);
    const [newPost, setNewPost] = useState(null);
    const [postLikesNotifications, setPostLikesNotifications] = useState(null);
    const [postCommentsNotifications, setPostCommentsNotifications] = useState(null);
    const [clickedOrganizationPicDelete,setClickedOrganizationPicDelete] = useState(false);
    const [clickedAddCEO,setClickedAddCEO] = useState(false);


    useEffect(() => {
        const fetchFriendOffers = async () => {
            let res;
            res = await axios.get(`/users/${organization._id}/${user._id}/friend-offers`);
            setFriendOffers(res.data.friendsOfFriends);
        };
        fetchFriendOffers();
      }, []);


    useEffect(()=>{
        socket?.emit("addUser", user?._id);
        socket?.on("getTaskStatusNotifications", data=>{
            setTaskStatusNotification({
                        data,
                            })
                                
                        })
    },[user?._id,socket,setTaskStatusNotification]);

    useEffect(()=>{
        if(taskStatusNotification)
        { 
            dispatch({type:"UPDATE_POST_NOTIFICATIONS",payload: taskStatusNotification.data});

        }
    },[taskStatusNotification,dispatch]); 

    useEffect(()=>{
        socket?.emit("addUser", user?._id);
        socket?.on("getCommentsNotifications", data=>{
            setPostCommentsNotifications({
                        data,
                            })
                                
                        })
    },[user?._id,socket,postCommentsNotifications]);

    useEffect(()=>{
        if(postCommentsNotifications)
        { 
            dispatch({type:"UPDATE_POST_NOTIFICATIONS",payload: postCommentsNotifications.data});

        }
    },[postCommentsNotifications,dispatch]); 

    const clearValidationMessage = (inputRef) => {
        inputRef.current.setCustomValidity("");
    };
    
    useEffect(() => {
        firstName.current?.addEventListener("input", () => clearValidationMessage(firstName));
        lastName.current?.addEventListener("input", () => clearValidationMessage(lastName));
        password.current?.addEventListener("input", () => clearValidationMessage(password));
        passwordAgain.current?.addEventListener("input", () => clearValidationMessage(passwordAgain));
    }, []);

    // Add this code to remove the event listener before the component is unmounted
    useEffect(() => {
        return () => {
            if(firstName.current) {
                firstName.current.removeEventListener("input", () => {
                    firstName.current.setCustomValidity("");
                });
            }
            if(lastName.current) {
                lastName.current.removeEventListener("input", () => {
                    lastName.current.setCustomValidity("");
                });
            }
            if(passwordAgain.current) {
                passwordAgain.current.removeEventListener("input", () => {
                    passwordAgain.current.setCustomValidity("");
                });
            }
        }
    }, []);

    useEffect(()=>{
        if(postCommentsNotifications)
        {
            const updateNewPostInDb=async()=>{
            //await axios.put("/users/"+ user._id + "/NewPostNotify",postCommentsNotifications.data);
          
        }
        updateNewPostInDb();
    }

    },[postCommentsNotifications]);


    useEffect(()=>{
        socket?.emit("addUser", user?._id);
        socket?.on("getTaskNotifications", data=>{
            setTaskNotification({
                        data,
                            })
                                
                        })
    },[user?._id,socket,taskNotification]);

    useEffect(()=>{
        if(taskNotification)
        { 
            dispatch({type:"UPDATE_POST_NOTIFICATIONS",payload: taskNotification.data});

        }
    },[taskNotification,dispatch]);



    useEffect(()=>{
        socket?.emit("addUser", user?._id);
        socket?.on("getLikesNotifications", data=>{
            setPostLikesNotifications({
                        data,
                            })
                                
                        })
    },[user?._id,socket,postLikesNotifications]);

    useEffect(()=>{
        if(postLikesNotifications)
        { 
            dispatch({type:"UPDATE_POST_NOTIFICATIONS",payload: postLikesNotifications.data});

        }
    },[postLikesNotifications,dispatch]); 
    
    useEffect(()=>{
        if(postLikesNotifications)
        {
            const updateNewPostInDb=async()=>{
            //await axios.put("/users/"+ user._id + "/NewPostNotify",postLikesNotifications.data);
          
        }
        updateNewPostInDb();
    }

    },[postLikesNotifications]);

      useEffect(()=>{
        socket?.emit("addUser", user?._id);
        socket?.on("getPost", data=>{
                        setNewPost({
                        post:data.post,
                            })
                                
                        })
    },[user?._id,socket,newPost])

    useEffect(()=>{
        if(newPost)
        { 
            dispatch({type:"UPDATE_POST_NOTIFICATIONS",payload: newPost.post});

        }
    },[newPost,dispatch]); 

    useEffect(()=>{
        if(newPost)
        {
            const updateNewPostInDb=async()=>{
            //await axios.put("/users/"+ user._id + "/NewPostNotify",newPost.post);
          
        }
        updateNewPostInDb();
    }

    },[newPost]);
       
  
    useEffect(() => {

        if(user?.arrivalMessageNotifications)
        {
            const senderCounts = new Map();
            const messagesBySender = [];
            user?.arrivalMessageNotifications?.forEach((message) => {
            const senderId = message.sender;
            const messageCount = senderCounts.get(senderId) || 0;
            senderCounts.set(senderId, messageCount + 1);
            });

            senderCounts.forEach((messageCount, id) => {
                messagesBySender.push({ id, messageCount });
            });
        setRecieverMessages(messagesBySender)
    }

      }, [user])


    useEffect(()=>{
        setSocket(io("ws://localhost:8900"));
        },[])

    useEffect(()=>{
        socket?.emit("addUser", user?._id);
        socket?.on("getUnConnectReqNotification", data=>{
                        setUnConnectReqNotification({
                        sender:data.senderId,
                            })
                                
                        })
    },[user?._id,socket,unConnectReqNotification])  

    useEffect(()=>{
        if(unConnectReqNotification)
        { 
            dispatch({type:"UNCONNECT",payload: unConnectReqNotification.sender});
        }
    },[unConnectReqNotification,dispatch]);    

    useEffect(()=>{
        socket?.emit("addUser", user?._id);
        socket?.on("getDeclineConnectionReq", data=>{
                        setDeclineConnectionReq({
                        sender:data.senderId,
                        })
                            
                    })
    },[user?._id,socket,declineConnectionReq])  


    useEffect(()=>{
        if(declineConnectionReq)
        { 
            dispatch({type:"WITHDRAW",payload: declineConnectionReq.sender});
        }
    },[declineConnectionReq,dispatch]);


    useEffect(()=>{
        socket?.emit("addUser", user?._id);
        socket?.on("getRejectConnectionReq", data=>{
                    setRejectConnectionReq({
                    sender:data.senderId,
                    })
                        
                })
    },[user?._id,socket,rejectConnectionReq])  
    
    useEffect(()=>{
        if(rejectConnectionReq)
        { 
            dispatch({type:"DECLINE",payload: rejectConnectionReq.sender});
        }
    },[rejectConnectionReq,dispatch]);


    useEffect(()=>{
        socket?.emit("addUser", user?._id);
        socket?.on("getConfirmConnecReqRecv", data=>{
                setConfirmConnecReqRecv({
                sender:data.senderId,
                })
                    
            })
    },[user?._id,socket,confirmConnecReqRecv]) 

    
    useEffect(()=>{
        if(confirmConnecReqRecv)
        { 
            dispatch({type:"CONFIRM",payload: confirmConnecReqRecv.sender});
            dispatch({type:"WITHDRAW",payload: confirmConnecReqRecv.sender});


        }
    },[confirmConnecReqRecv,dispatch]);


    useEffect(()=>{
            socket?.emit("addUser", user?._id);
            socket?.on("getConnectionReqNotification", data=>{
                setNewConnectionReqArrived({
                    sender:data.senderId,
                })
                
            })
        },[user?._id,socket,newConnectionReqArrived])
                
        useEffect(()=>{
            if(newConnectionReqArrived)
            { 
                //setNewConnectionReqArrivedArray(prev=>[...prev,newConnectionReqArrived]);
                dispatch({type:"RECVREQ",payload:
                    newConnectionReqArrived.sender });
            }
        },[newConnectionReqArrived,dispatch]);

    
    useEffect(()=>{
        socket?.emit("addUser", user?._id);
        socket?.on("getMessageNotifications", data=>{
            setArrivalMessage({
                sender:data.senderId,
                text: data.text,
                createdAt: Date.now(),
            })
            
        })
    },[user,socket])
    

    useEffect(()=>{
        if(arrivalMessage)
        { 
            dispatch({type:"UPDATE_MESSAGES_NOTIFICATION",payload: 
                    arrivalMessage });
          
        }

    },[dispatch,arrivalMessage]);

   


    useEffect(() => {

        function handleClickOutside(event) {

            if(openNotificationPostPreview.current?.contains(event.target) && showPostNotificationsPreview )
            {
                setShowPostNotificationsPreview(true);

            }
            else if((!openNotificationPostPreview.current?.contains(event.target)) && showPostNotificationsPreview){
                setShowPostNotificationsPreview(false);
            }

            if(openNotificationReqPreview.current?.contains(event.target) && showConnectionReqPreview )
            {
                setShowConnectionReqPreview(true);

            }
            else if((!openNotificationReqPreview.current?.contains(event.target)) && showConnectionReqPreview){
                setShowConnectionReqPreview(false);
            }


            if(openMessagePreview.current?.contains(event.target) && showMessagePreview )
            {
                setShowMessagePreview(true);

            }
            else if((!openMessagePreview.current?.contains(event.target)) && showMessagePreview){
                setShowMessagePreview(false);
            }

            if(searchBarPopup.current?.contains(event.target) && openSearchResult)
            {
                setOpenSearchResult(true);
            }
            else if((!searchBarPopup.current?.contains(event.target)) && openSearchResult)
            {
                setOpenSearchResult(false);
            }

            if(profileImgPopup.current?.contains(event.target) && openProfileImg )
            {
                setOpenProfileImg(true);

            }
            else if((!profileImgPopup.current?.contains(event.target)) && openProfileImg){
                setOpenProfileImg(false);
            }

           

        }
            
              document.addEventListener("click", handleClickOutside);
              return () => {
                document.removeEventListener("click", handleClickOutside);
              };
            }, [profileImgPopup,openProfileImg,searchBarPopup,openSearchResult,showMessagePreview,showConnectionReqPreview,showPostNotificationsPreview]);


    const logoutHandle = () =>{
        logoutCall(dispatch);
        socket.close();
        navigate("/login");
    }

    useEffect(()=>{
        socket?.on("getNotifications",(data) =>{
            setNotifications((prev)=>[...prev,data]);

        });
    },[socket,user])

    

    const handleDeleteConfirm = async() => {
        try
        {
            await axios.put(`/users/${organization._id}/${user._id}/unconnectFromAllConnections`);
            await axios.delete(`/users/${organization._id}/${user._id}`);
            logoutCall(dispatch);
            navigate("/login");
        }
        catch(err)
        {
            console.log(err);
        }
        setIsDeletePopupOpen(false);
      }

    const displayPopUpProfile = ()=>{
        return (
            <div className="popUpProfileWrapper">
            <ul className="popUpProfileImg">
                <li className="popUpProfileItem">
                <Link
            to={"/profile/" + user.firstName}
            className="link">
                <img className="topBarProfileImg" src={user.profilePicture ? PF + user.profilePicture : PF + "person/noAvatar.png"} alt=""/>
            <span className="popUpProfileText">{user.firstName} {user.lastName}
                </span>
                </Link>
                </li> 
                <hr className="profilePopUpHr"/>
            {(user.userType === "Manager" || user.userType === "Admin" || user.userType === "CEO") &&
            <li className="hrPopUpProfileItem">
            <Link className="link"
            to={"/register"}
            style={{ textDecoration: "none" }}>
                <Add className="popUpTopBarItemIcon"   />
                <span className="popUpProfileText">Add Employee
                
                </span>
                </Link>
                </li>
            }
            <li className="hrPopUpProfileItem" onClick={()=> setIsSettingsPopupOpen(!isSettingsPopupOpen)}> 
                <Settings className="popUpTopBarItemIcon" />
            <span className="popUpProfileText">Settings
            </span>
            </li >
             <li className="hrPopUpProfileItem">
             <ExitToApp className="popUpTopBarItemIcon"   />
             <span className="popUpProfileText" onClick={logoutHandle} >Log out
                    </span>
                </li>
             </ul>
             </div>
        )

    }

    const handleSubmit = async (e)=> {
        e.preventDefault();

    if(clickedOrganizationPicDelete)
    {
      organization.organizationPicture="";
    }
      const updateOrganization = {
        organizationName: organizationName.current.value?organizationName.current.value:organization.organizationName,
        NumOfEmployees: numOfEmployee.current.value?numOfEmployee.current.value:organization.NumOfEmployees,
        desc: desc.current.value?desc.current.value:organization.desc,
        users: organization.users
      };

      if (organizationPicturefile){
        const data = new FormData();
        const filename = Date.now() + organizationPicturefile.name;
        data.append("name",filename);
        data.append("file",organizationPicturefile);
        updateOrganization.organizationPicture = filename;
        try{
            await axios.post("/upload", data)
        }catch(err){
            console.log(err);
        }
    }
    else
        updateOrganization.organizationPicture = organization.organizationPicture;


      try{
        await axios.put(`/organizations/${organization._id}/`,updateOrganization);
        dispatch({type:"UPDATED_ORGANIZATION",payload: updateOrganization});
        alert("Organization has been updated!");
        navigate("/");
        setEditOrganizationPopUp(false)




      }catch(err) {
          console.log(err);
      }
      
    }

   
    const removePostNotify = async (p) => {
        if(p._id)
        {
            dispatch({type:"REMOVE_POST_NOTIFICATIONS",payload: p});
            await axios.put("/users/" + organization._id + "/" + user._id + "/RemovePostNotify",p);

        }
        else 
        {
            dispatch({type:"REMOVE_LIKES_OR_COMMENTS_POST_NOTIFICATIONS",payload: p});
            await axios.put("/users/" + organization._id + "/" + user._id + "/RemovePostLikeAndCommentNotify",p);
        }

    }  
    
    
    const handleDeleteOrganizationConfirm = async(e) =>{
        try
        {
            await axios.put(`/users/${organization._id}/${user._id}/unconnectFromAllConnections`);
            await axios.delete(`/organizations/${organization._id}`);
            logoutCall(dispatch);
            navigate("/login");
        }
        catch(err)
        {
            console.log(err);
        }
        setDeleteOrganizationPopupOpen(false);
      }

    const handleSearch = async (e) => {
       
        setOpenSearchResult(true)
        try {
           
            const res =   await axios.get(`/users/${organization._id}/${user._id}/search?q=${e}`)
            const users = res.data;
            setUsers(users);
        } catch (err) {
            console.error(err);
        }
          };

    const handleSubmitCEO = async (e)=>{
        e.preventDefault();

        const firstNameValue = firstName.current.value.trim();
        const lastNameValue = lastName.current.value.trim();
        if(!/^[A-Z]/.test(firstNameValue)) {
            firstName.current.setCustomValidity("First name should start with a capital letter");
        } else {
            firstName.current.setCustomValidity("");
        }
        if(!/^[A-Z]/.test(lastNameValue)) {
            lastName.current.setCustomValidity("Last name should start with a capital letter");
        } else {
            lastName.current.setCustomValidity("");
        }

        if(passwordAgain.current.value !== password.current.value){
            passwordAgain.current.setCustomValidity("Passwords don't match!");
        } else {
            passwordAgain.current.setCustomValidity("");
        }

        // Check the validity of the input fields again before submitting the form
        if(firstName.current.checkValidity() && lastName.current.checkValidity() && passwordAgain.current.checkValidity()) {
                const user = {
                    firstName: firstName.current.value,
                    lastName: lastName.current.value,
                    email: email.current.value,
                    password: password.current.value,
					userType: "CEO",
                    workStartDate: organization.establishmentDate
                }
                try{
                    dispatch({type:"UPDATED_ORGANIZATION_USERS",payload: user});
					dispatch({type:"UPDATED_ORGANIZATION_CEO",payload: user});
                    const res = await axios.post(`/auth/${organization._id}/register`,user);
                    alert("CEO has been added!");
                    setClickedAddCEO(false);

                }catch(err) {
                    console.log(err);
                }
            }
            else{
                alert("Please make sure all the details are valid!")
            }
      }

  
        return (
            <>
        {user?(
        <div className="topbarContainer">
            <div className="topbarLeft">
                <Link to = "/" style= {{textDecoration:"none"}}>
                <span className="logo">WorkUP</span> 
                </Link>
            </div>
            <div className="topbarCenter" ref={searchBarPopup}>
            {isSettingsPopupOpen && (
        <Modal 
        styles={{
            modal: {
                backgroundColor: theme.colors.gray[1],
                height:"70%",
              boxShadow: "none",
              borderRadius: 0,
              border: "none",
            },
           
          }}
          overlayOpacity={0.55}
          overlayBlur={3}
          size="xl"
          
        opened={isSettingsPopupOpen}
        onClose={() => setIsSettingsPopupOpen(false)}
      >
        <span>Settings</span>
        <div className="settingsPopup">
        <div className="settingsPopup-options">
          <button className="settingsPopup-option" onClick={()=> setClickedintro(!clickedintro)}>Who are we?</button>
          { clickedintro &&
          <div>
          <span className="intro">Work up founded by Roni Khizvarg and Or Amram which focuses on planning and developing a social network that will deal with the ongoing management of your organization.
You can enjoy a variety of options such as uploading posts, chats, uploading assignments, attendance report, and sending emails in real time to co-workers, etc.</span>
          </div>
            }
            {user.userType === "Admin" &&
          <button className="settingsPopup-option"onClick={()=> setEditOrganizationPopUp(!editOrganizationPopUp)} >Edit organization</button>
            }
            <Modal  styles={{
            modal: {
                backgroundColor: theme.colors.gray[1],
              boxShadow: "none",
              borderRadius: 0,
              border: "none",
            },
           
          }}
    overlayOpacity={0.55}
    size={"40%"}
    overlayBlur={3}
     opened={editOrganizationPopUp} onClose={() => setEditOrganizationPopUp(false)}
    >
        <>
        <form className="topBarForm"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
            <h2 className="editHeader">Edit Organization</h2>
          <br />
        <div>
            <input
              type="text"
              ref={organizationName}
              className="topBarInput"
              name="role"
              defaultValue={organization.organizationName}
              placeholder="organization name"
            />
          </div>
  
          <div>
            <input
              type="text"
              ref={numOfEmployee}
              className="topBarInput"
              name="numOfEmployee"
              defaultValue={organization.NumOfEmployees}
              placeholder="number of employees"
            />
          </div>
  
           <div>
            <input
              type="text"
              ref={desc}
              className="topBarInput"
              name="desc"
              defaultValue={organization.desc}
              placeholder="description">
              </input>
          </div>
  
          <div>
            Organization Image: <span />
            <input
              type="file"
              id="ProfileFile"
              accept=".png,.jpeg,.jpg"
              name="profileImg"
              onChange={(e) => setOrganizationPicturefile(e.target.files[0])}
            />
             

            <br />
            
            {organization.organizationPicture &&(
            <div className="profile-picture">
            <img className="editProfileImg" src={organization.organizationPicture && !clickedOrganizationPicDelete ? PF + organization.organizationPicture : PF + "person/noAvatar.png"} alt="Profile Picture"/>
            <div className="deleteFrame" onClick={()=> setClickedOrganizationPicDelete(!clickedOrganizationPicDelete)}>
              {!clickedOrganizationPicDelete &&(
                <>
            <Delete className="delete-button" />
            <span className="deleteText">Delete</span>
            </>
              )}
              {clickedOrganizationPicDelete &&(
                <>
            <Undo className="delete-button" />
            <span className="deleteText">Undo</span>
            </>
              )}
            </div>
          </div>
          )}
            <br />
            </div>
            <button className="infoButton">Update</button>
            {!organization.CEO &&
            <button type="button" className="AddCEOButton" onClick={()=> setClickedAddCEO(!clickedAddCEO)}>Add CEO</button>
            }
            
            </form>
            </>
        </Modal>
        <Modal
  styles={{
    modal: {
        backgroundColor: theme.colors.gray[1],
      boxShadow: "none",
      borderRadius: 0,
      border: "none",
    },
   
  }}
overlayOpacity={0.55}
size={"50%"}
overlayBlur={3}
  opened={clickedAddCEO}
  onClose={() => setClickedAddCEO(!clickedAddCEO)}
>
  <form className="topBarForm" onSubmit={handleSubmitCEO}>
  <h2 className="editHeader">Add CEO</h2>
  <div class="input-container">
    <label>
      First Name:
      <input required type="text" name="firstName" ref={firstName}
              className="topBarInput"
              placeholder="first name" />
    </label>
    </div>

    <div class="input-container">
    <label>
      Last Name:
      <input required type="text" name="lastName" ref={lastName}
              className="topBarInput"
              placeholder="last name"/>
    </label>
    </div>

    <div class="input-container">
    <label>
      Email:
      <input required type="email" name="email" ref={email}
              className="topBarInput"
              placeholder="email" />
    </label>
    </div>

    <div class="input-container">
    <label>
      Password:
      <input required
              type="password"
              minLength="6"
              ref={password}
              className="infoInput"
              name="password"
              placeholder="password"
            />
    </label>
    </div>

    <div class="input-container">
    <label>
      Confirm Password:
      <input required type="password"
              ref={passwordAgain}
              className="confirmPasswordsInput"
              name="ConfirmPassword"
              placeholder="Confirm password"
             />
    </label>
    <button className="AddCEOButton" >Submit</button>
        </div>

  </form>
</Modal>


          <button className="settingsPopup-option"onClick={()=> setIsDeletePopupOpen(!isDeletePopupOpen)}>Delete account</button>
          <Modal  styles={{
            modal: {
                backgroundColor: theme.colors.gray[1],
              boxShadow: "none",
              borderRadius: 0,
              border: "none",
            },
           
          }}
    overlayOpacity={0.55}
    overlayBlur={3}
     opened={isDeletePopupOpen} onClose={() => setIsDeletePopupOpen(false)}
>
        <h2>Are you sure you want to delete the account?</h2>
        <div className="buttonsModalFrame">
        <button className="modalButton" onClick={()=> setIsDeletePopupOpen(false)}>Cancel</button>
        <button className="modalButton" onClick={handleDeleteConfirm}>Delete</button>
        </div>
      </Modal>
        {user.userType === "Admin" &&
      <button className="settingsPopup-option"onClick={()=> setDeleteOrganizationPopupOpen(!deleteOrganizationPopupOpen)}>Delete Organization</button>
        }
          <Modal  styles={{
            modal: {
                backgroundColor: theme.colors.gray[1],
              boxShadow: "none",
              borderRadius: 0,
              border: "none",
            },
           
          }}
    overlayOpacity={0.55}
    overlayBlur={3}
     opened={deleteOrganizationPopupOpen} onClose={() => setDeleteOrganizationPopupOpen(false)}
>
        <h2>Are you sure you want to delete the organization?</h2>
        <div className="buttonsModalFrame">
        <button className="modalButton" onClick={()=> setDeleteOrganizationPopupOpen(false)}>Cancel</button>
        <button className="modalButton" onClick={handleDeleteOrganizationConfirm}>Delete</button>
        </div>
      </Modal>


        </div>
        </div>
        </Modal>
      )}
            <ul className="search">
            {openSearchResult && users.length !== 0 && 
            <div className="resultSearch">
             <span className="resultSearchText">{users.length} results:</span>
             </div>
            }
            {openSearchResult && users.length === 0 &&
            <div className="resultSearch">
             <span className="resultSearchText">no results!</span>
             </div>
            }
            {openSearchResult && users &&(users.map(user => (
                <li key={user._id} className="displayUsers">
                <Link to={"/profile/" + user.firstName} className="link">
                <div className="searchWrapper">
                <img 
                className="searchProfileImg"
                src={user.profilePicture ? PF + user.profilePicture : PF + "person/noAvatar.png"} 
                alt=""/>
                <span className="searchOnline"></span>
            <span className="searchUsername">{user.firstName} {user.lastName}</span>
            </div>
            </Link>
   </li>   
      )))}
      </ul>
                <div className="searchbar">
                     <Search className="searchIcon" />
                     <input className="searchInput" placeholder="Search for friend, post or video"
                      value={searchQuery}
                      onClick = {()=> setOpenSearchResult(true)}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        handleSearch(e.target.value);
                      }}
                        />
                </div>
               
            </div>
            
            <div className="topbarRight">
               
                <div className="topbarIcons">

                    <div ref={openNotificationReqPreview}>
                    <div className="topbarIconItem" >
                        <Person className="topbarIcon" onClick={()=> setShowConnectionReqPreview(!showConnectionReqPreview)} />
                        {user.recvConnectionsReq?.length >0 &&
                        <span className="topbarIconBadge">{user.recvConnectionsReq?.length}</span>
                        
                        }
                        
                    </div>
                    {showConnectionReqPreview && (user?.recvConnectionsReq > 0 || friendOffers.length > 0) && (
                    <div className="ConnectionReqNotifications">
                        {user?.recvConnectionsReq.map((r) => (
                        <div key={r?.id} className="wrapperRequestNotifyContainer">
                            <ConnectionReqPreview request={r}/>
                        </div>
                        ))}
                        {friendOffers.length > 0 && (
                        <div className="wrapperRequestNotifyContainer">
                            <ConnectionReqPreview friendOffers={friendOffers} />
                        </div>
                        )}
                    </div>
                    )}
                    </div>

                    <div ref={openMessagePreview}>
                    <div className="topbarIconItem"onClick={()=>setShowMessagePreview(!showMessagePreview)}>
                        <Chat className="topbarIcon"/>
                        {user.arrivalMessageNotifications?.length > 0 &&
                        <span className="topbarIconBadge">{user.arrivalMessageNotifications?.length}</span>
                        }
                       
                        </div>
                        <div className="wrapperMessageNotify" >
                        {showMessagePreview &&(
                            user.arrivalMessageNotifications?.length > 0 &&
                            recieverMessages.map((messages) => (
                                <div className="wrapperMessageNotifyContainer">
                            <MessagePreview key={messages.id} messages={messages} />
                            </div>
                            )))}
                            
                            </div>

                            </div>

                     <div ref ={openNotificationPostPreview}>                  
                    <div className="topbarIconItem">
                        <Notifications className="topbarIcon" onClick={()=> setShowPostNotificationsPreview(!showPostNotificationsPreview)}/>
                        { user.postNotifications?.length >0 &&
                        <span className="topbarIconBadge">{user.postNotifications.length}</span>
                    }
                    </div>
                <div className="wrapperPostNotify" >
                {showPostNotificationsPreview &&(
                user.postNotifications?.length >0 && 
                    user.postNotifications.map(p=>(
                        <div className="wrapperPostNotifyContainer" onClick={()=>removePostNotify(p)}>
                        <PostNotifyPreview key={p.id}  post = {p}/>
                        </div>
                    ))
    
                )}
                        </div>
                    </div> 

                   
                </div>
                <div className="topbarScoreItem">
                        <TollOutlined className="topbarScoreIcon"/>   
                        <span className="scoreSpan">{ user.score}</span>
                    </div>

                <div ref = {profileImgPopup} className="topbarProfileImg" onClick={()=>setOpenProfileImg(!openProfileImg)} >
              <img src=
                {user.profilePicture
                 ? PF + user.profilePicture 
                 : PF + "person/noAvatar.png" 
                 } 
                 alt="" 
                 className="topbarImg"
                  />
                 {openProfileImg &&(
                    displayPopUpProfile(user.firstName)
                 )
                 }
                                 </div>

                 </div>
           
        </div>
        ):  
     <div className="topbarContainer">
            <div className="topbarLeft">
                <Link to = "/login" style= {{textDecoration:"none"}}>
                <span className="logo">WorkUP</span> 
                </Link>
            </div>
        </div>
}
</>
        )
                
 }

    
                 
    
            