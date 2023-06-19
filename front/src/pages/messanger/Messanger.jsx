import "./messanger.css"
import Topbar from "../../components/topbar/Topbar"
import Conversation from "../../components/conversation/Conversation"
import Message from "../../components/message/Message"
import ChatOnline from "../../components/chatOnline/ChatOnline"
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import { useState } from "react"
import { useEffect } from "react"
import axios from "axios"
import { useRef } from "react"
import {io} from "socket.io-client"
import {Search} from "@material-ui/icons"
import {useParams} from "react-router"


export default function Messanger() {
    const [conversations,setConversations] = useState([]);
    const [currentChat,setCurrentChat] = useState(null);
    const [messages,setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const[onlineUsers,setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);
    const {user, dispatch} = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const scrollRef = useRef();
    const [searchQuery, setSearchQuery] = useState('');
    const [openSearchResult, setOpenSearchResult] = useState(false);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const searchBarPopup = useRef(null);
    const [userFromProfile,setUserFromProfile] = useState('');
    const [newmessagesArrived,setNewmessagesArrived] = useState(user?.arrivalMessageNotifications);
    const {organization} = useContext(AuthContext);

    const userName = useParams().username;


    useEffect(()=>{
        setSocket(io("ws://localhost:8900"));
        },[]);

    useEffect (() =>{
        const fetchUser = async () => {
          const res = await axios.get(`/users/${organization._id}?username=${userName}`);
          setUserFromProfile(res.data);
        };
        if(userName)
            fetchUser();
      },[userName]);

    useEffect(() => {
        if(userFromProfile)
        {
            const getConversation = async()=>{
            const conversation = await axios.get(`/conversations/${user._id }/${userFromProfile._id}`);
            if(conversation.data.length == 0) //new conversation
            {
                const newConversation ={
                    senderID: user._id ,
                    recieverID:userFromProfile._id
                }
                const postConversation = await axios.post(`/conversations`, newConversation);
                setCurrentChat(postConversation.data);
                const res = await axios.get("/conversations/"+ user._id);
                setConversations(res.data);
            }
            else
            {
                const res = await axios.get("/conversations/"+ user._id);
                setConversations(res.data);
                setCurrentChat(conversation.data[0]);

            }
        }
        getConversation();
    }

    },[userFromProfile])


    useEffect(() => {

        function handleClickOutside(event) {

            if(searchBarPopup.current?.contains(event.target) && openSearchResult)
            {
                setOpenSearchResult(true);
            }
            else if((!searchBarPopup.current?.contains(event.target)) && openSearchResult)
            {
                setOpenSearchResult(false);
                setSearchQuery("")
            }

        }
            
              document.addEventListener("click", handleClickOutside);
              return () => {
                document.removeEventListener("click", handleClickOutside);
              };
            }, [searchBarPopup,openSearchResult]);

            

            useEffect(()=>{
                socket?.emit("addUser", user._id);
                socket?.on("getMessage", data=>{
                    setArrivalMessage({
                        sender: data.senderId,
                        text: data.text,
                        createdAt: Date.now(),
                    });
                });

            }, [socket,conversations,user]);

    useEffect(()=>{

        if(arrivalMessage)
        { 
            setNewmessagesArrived(prev=>[...prev,arrivalMessage]);
            if(currentChat?.members.includes(arrivalMessage.sender))
            {
                setMessages(prev=>[...prev,arrivalMessage])  
                
            }
        }

    },[arrivalMessage,currentChat,dispatch]);


    useEffect(()=>{
        if(arrivalMessage)
        { 
            dispatch({type:"UPDATE_MESSAGES_NOTIFICATION",payload: 
                    arrivalMessage});
       
        }

    },[dispatch,arrivalMessage]);

    useEffect(()=>{
        if(arrivalMessage)
        { 
            const updateArrivalMsgInDb=async()=>{
            //await axios.put("/users/" + organization._id +"/" + user._id + "/updateArrivalMsg",{sender: arrivalMessage});
          
        }
        updateArrivalMsgInDb();
    }

    },[arrivalMessage]);
   
    useEffect(()=>{
        socket?.on("getUsers",(users)=>{  //to see who is online
            setOnlineUsers(user.connections.filter((f)=> users.some((u)=>u.userId === f)));
        })
    },[user])

    useEffect(()=>{
        const getConversation = async()=>{
            try{
            const res = await axios.get("/conversations/"+ user._id);
            setConversations(res.data);
        }catch(err){
            console.log(err);
        }
    }
    getConversation();
    },[user._id,userFromProfile._id])



    useEffect(()=>{
        const getMessages = async () =>{
            try{
            const res = await axios.get("/messages/"+ currentChat?._id);
            setMessages(res.data)
            }catch(err){
                console.log(err);
            }
        }
        getMessages();

    },[currentChat]);

    const showConversation = async(friend)=>{
        setSearchQuery("");
        const conversation = await axios.get(`/conversations/${user._id }/${friend._id}`);
        if(conversation.data.length == 0) //new conversation
        {
            const newConversation ={
                senderID: user._id ,
                recieverID:friend._id
            }
            const postConversation = await axios.post(`/conversations`, newConversation);
            setCurrentChat(postConversation.data);
            const res = await axios.get("/conversations/"+ user._id);
            setConversations(res.data);

        }
        else
        {
            const res = await axios.get("/conversations/"+ user._id);
            setConversations(res.data);
            setCurrentChat(conversation.data[0]);

        }


    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id,
        };


        const recieverId = currentChat.members.find(member=> member!== user._id)

        socket?.emit("sendMessage",{
            senderId: user._id,
            recieverId,
            text: newMessage
        });

        socket?.emit("sendMessagesNotification",{
            senderId: user._id,
            recieverId,
            text: newMessage
        })

        try{
            const res = await axios.post("/messages", message);
            await axios.put("/users/" + organization._id +"/" + recieverId + "/updateArrivalMsg",{sender: message});
            setMessages([...messages, res.data]);
            setNewMessage("");

        }catch(err){
            console.log(err);
        }
    };

   
    useEffect (()=>{
        scrollRef.current?.scrollIntoView({behavior:"smooth"})
    },[messages])

    const handleSearch = async (e) => {
        try {
           
            const res = await axios.get(`/users/${organization._id}/${user._id}/search?q=${e}`);
            const users = res.data;
            setUsers(users);
        } catch (err) {
            console.error(err);
        }
          };
    
  return (
    <>
    <Topbar />
    <div className="messanger">
        <div className="chatMenu">
            <div className="chatMenuWrapper">
            <div className="searchbar" ref ={searchBarPopup}>
                     <Search className="searchIcon" />
                     <input placeholder="Search for friend"
                      className="searchInput"
                      value={searchQuery}
                      onClick = {()=> setOpenSearchResult(true)}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        handleSearch(e.target.value);
                      }}
                        />
                </div>
                {openSearchResult && users &&(users.map(user => (
                <li key={user._id} className="displayUsersInConversation" onClick={()=>showConversation(user)}>          
                <div className="searchWrapperInConversation">
                <img 
                className="searchProfileImg"
                src={user.profilePicture ? PF + user.profilePicture : PF + "person/noAvatar.png"} 
                alt=""/>
                <span className="searchOnline"></span>
            <span className="searchUsername">{user.firstName} {user.lastName}</span>
            </div>

   </li>   

      )))}
                     <hr className="profilePopUpHr"/>

                {conversations.map((c)=>(
                    <div onClick={async () => {
                        setCurrentChat(c);
                        await axios.put("/users/" +organization._id +"/" + user._id + "/removeArrivalMsg", { conversation: c });
                        setNewmessagesArrived("");
                        dispatch({
                            type: "REMOVE_MESSAGES_NOTIFICATION",
                            payload: {
                                user: user,
                                conversation: c,
                            },
                        });
                    }} key={setCurrentChat._id}>
                    <Conversation  conversation ={c} currentUser ={user} numOfUnReadMessages = {newmessagesArrived?.length} />  
                    </div>
                ))}                
            </div>
        </div>
        <div className="chatBox">
            <div className="chatBoxWrapper">
                {
                    currentChat ? (
                    <>
                <div className="chatBoxTop">
                    {messages.map(m=>(
                        <div key={m._id} ref={scrollRef}>
                        <Message message ={m} own={m.sender !== user._id}senderId= {m.sender}/>
                        </div>
                    ))}
                    

                </div>
                <div className="chatBoxBottom">
                    <textarea 
                    className="chatMessageInput" 
                    placeholder="write something..."
                    onClick={async () => {
                        await axios.put("/users/" + organization._id +"/" + user._id + "/removeArrivalMsg", { conversation: currentChat });
                        setNewmessagesArrived("");
                        dispatch({
                            type: "REMOVE_MESSAGES_NOTIFICATION",
                            payload: {
                                user: user,
                                conversation: currentChat,
                            },
                        });
                    }}
                    onChange={(e) => {
                        setNewMessage(e.target.value);
                      }}
                    value = {newMessage}>
                    </textarea>
                    <button className="chatSubmitButton" onClick={handleSubmit}>Send</button>
                </div>
                </>
                ):( 
                <span className="noConversationText">Open a conversation to chat</span>
                )}

            </div>
        </div>
        <div className="chatOnline">
            <div className="chatOnlineWrapper">
                <ChatOnline 
                    onlineUsers ={onlineUsers} 
                    currentId={user._id} 
                    setCurrentChat = {setCurrentChat} />
            </div>
        </div>

    </div>
    </>
  )
}
