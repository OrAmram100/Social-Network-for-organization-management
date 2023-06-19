import "./share.css"
import {PermMedia, Label, Room, EmojiEmotions, Cancel } from "@material-ui/icons"
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useEffect,useState,useRef } from "react";
import axios from "axios"
import EmojiPicker from 'emoji-picker-react';
import TagInput from "../TagInput"
import {Link} from "react-router-dom"
import Select from 'react-select'
import {io} from "socket.io-client"
import {CircularProgress} from "@material-ui/core"
import { Modal, useMantineTheme } from "@mantine/core";


export default function Share({event,onShare,startEventDate,endEventDate,paramsPostType}) {

const {user} = useContext(AuthContext);
const PF = process.env.REACT_APP_PUBLIC_FOLDER;
const [descValue, setDescValue] = useState("");
const [file,setFile] = useState(null);
const [emojiClicked,setEmojiClicked] = useState(false);
const [tagsClicked,setTagsClicked] = useState(false);
const [postType, setPostType] = useState('');
const [isImportant, setIsImportant] = useState(false);
const shareRef = useRef(null);
const [shareHeight, setShareHeight] = useState(0);
const [location, setLocation] = useState(null);
const [tags, setTags] = useState([]);
const pattern = /@(\w+)/g;
const [replacedText,setReplacedText] = useState(descValue.replace(pattern, '<a href="/profile/$1">@$1</a>'));
const [clickOnInput,setClickOnInput] = useState(false);
const ClickOutsideRef = useRef(null);
const [socket, setSocket] = useState(null);
const {organization} = useContext(AuthContext);
const [isLoading, setIsLoading] = useState(false);
const [questionType, setQuestionType] = useState('');
const [showQuestionModal, setShowQuestionModal] = useState(false); // State to control modal visibility


useEffect(()=>{
  setSocket(io("ws://localhost:8900"));
  socket?.emit("addUser", user?._id);

  },[]);

useEffect(() => {

  function handleClickOutside(event) {
      if (ClickOutsideRef.current && ClickOutsideRef.current.contains(event.target)) {

      }
      else if(!ClickOutsideRef.current?.contains(event.target)){

          setEmojiClicked(false);
          setTagsClicked(false);
      }
      
  }
      
        document.addEventListener("click", handleClickOutside);
        return () => {
          document.removeEventListener("click", handleClickOutside);
        };
      }, [ClickOutsideRef]);

  // Define a callback function to handle mentions
  
  const typeOptions = [
    { value: true, label: "High" },
    { value: false, label: "Low" },
  ]

  const questiontypeOptions = [
    { value: "Knowledge question", label: "Professional question (specific knowledge)" },
    { value: "General question", label: "General question" },
  ]

const handlePostTypeChange = (e) => {
  setPostType(e.target.value);
};

const handleQuestionModalSubmit = () => {
  if (questionType) {
    setShowQuestionModal(false);
    submitHandler();
  } else {
    alert("Please select a question type");
  }
};

const handleTagSelect = (tag) => {
  setTags([...tags, tag]);
setDescValue((prevValue) => prevValue + '@' + tag.firstName  )
};

useEffect(() => {
  setReplacedText(descValue.replace(pattern, '<a href="/profile/$1">@$1</a>'));

}, [descValue]);

useEffect(() => {
  if(event)
    {
      setPostType("event");
    }

}, [event]);

useEffect(() => {
  if(paramsPostType === "question" && !event)
    {
      setPostType("question");

    }

    else if(paramsPostType === "post" && !event)
    {
      setPostType("post");

    }
    else if(!event)
      setPostType('');


}, [paramsPostType]);



useEffect(() => {
    if (shareRef.current) {
      setShareHeight(shareRef.current.offsetHeight);
    }
  }, [shareRef]);



const submitHandler = async (e) =>{
    e?.preventDefault();

    if(!event && postType === "question" && !questionType)
    {
      setShowQuestionModal(true);
      return;      
    } 
    
    if(!postType)
    {
        alert("Please choose type before share");
    }
    else
    {
      setIsLoading(true)
        const newPost = {
            userId: user._id,
            desc: descValue,
            type: postType,
            location: "",// Initialize location to null
            isImportant: isImportant.value,
        
        };

        if(postType === "question")
        {
          newPost.questionType = questionType.value
        }
        if (file){      
            const data = new FormData();
            const filename = Date.now() + file.name;
            data.append("name",filename);
            data.append("file",file);
            newPost.img = filename;
            try{
                await axios.post("/upload", data)
            }catch(err){
                console.log(err);
            }
        }

        if(event)
        {
          newPost.startEventDate = startEventDate;
        }
        if( event && endEventDate )
          newPost.endEventDate = endEventDate;

        
        try
        {
          
          const post = await axios.post("/posts", newPost, {
            params: {
              organizationId: organization._id,
            },
          });
          
          if(newPost.isImportant)
          {
            if (event) {
              const users = await axios.get(`/users/${organization._id}/allusers`);
              const updatedUsers = users.data.filter(u => u._id !== user._id);
              const recipients = updatedUsers.map(user => user.email);
              const formDataToSend = new FormData();
              formDataToSend.append('to', recipients.join(','));
              formDataToSend.append('subject', 'A new event has been added to the company!');
              formDataToSend.append('text', `Check out this new event from ${user.firstName} ${user.lastName}!:\n ${newPost.desc}`);
              formDataToSend.append('file', file);
              await axios.post('/send-email', formDataToSend);
              for (let i = 0; i < updatedUsers.length; i++) {
                await axios.put(`/users/${organization._id}/${updatedUsers[i]._id}/NewPostNotify`, post.data);
              }
              const sendPostPromiseArray = [];
              for (let i = 0; i < updatedUsers.length; i++) {
                const sendPostPromise = new Promise((resolve, reject) => {
                  socket?.emit("sendPost", {
                    post: post.data,
                    recieverId: updatedUsers[i]._id,
                  }, (response) => {
                    if (response.success) {
                      resolve();
                    } else {
                      reject(response.error);
                    }
                  });
                });
                sendPostPromiseArray.push(sendPostPromise);
              }
              try {
                setIsLoading(false);
                onShare("event Clicked")
                await Promise.all(sendPostPromiseArray);
                
            
              } catch (err) {
                console.log(err);
              }
            }
            else
            {
              const connections = await axios.get(`/users/${organization._id}/friends/${user._id}`);
              const recipients = connections.data.map(connection => connection.email);
              const formDataToSend = new FormData();
              formDataToSend.append('to', recipients.join(','));
              formDataToSend.append('subject', 'New post from your connection');
              formDataToSend.append('text', `Check out this new post from ${user.firstName} ${user.lastName}!:\n ${newPost.desc}`);
              formDataToSend.append('file', file);
              await axios.post('/send-email', formDataToSend);
              for (const id of user.connections)
              { 
                await axios.put("/users/" + organization._id +"/" + id + "/NewPostNotify",post.data);
              }
              const sendPostPromiseArray = [];
              for (const id of user.connections) {
                const sendPostPromise = new Promise((resolve, reject) => {
                  socket?.emit("sendPost", {
                    post: post.data,
                    recieverId: id,
                  }
                  , (response) => {
                    if (response.success) {
                      resolve();
                    } else {
                      reject(response.error);
                    }
                  });
                });
                sendPostPromiseArray.push(sendPostPromise);
              }
              try {
                if(!event)
                {
                  setTimeout(() => {
                    window.location.reload();
                }, 1000); 
              }
              else
              {
                onShare("event Clicked")
                setIsLoading(false);
              }
              await Promise.all(sendPostPromiseArray);
              } catch (err) {
                console.log(err);
              }
          }
        }

          if(event)
          {
            onShare("event Clicked")
            setIsLoading(false);
          }
          else  
            window.location.reload(); 
            
         setDescValue("");   
        }
      
        catch(err)
        {
            console.log(err);
        }
      }
}

function TextWithLinks({ text }) {
  const pattern = /@(\w+)/g;
  setReplacedText(text.replace(pattern, '<a href="/$1">@$1</a>'));
}

const handleEmojiClick = (event) => {
    setDescValue((prevValue) => prevValue + event.emoji);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log(error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };


  return (
    <div className="share">
      
        <div className="shareWrapper">
            <div className="shareTop" >
            <Link to={"/profile/" + user.firstName} style={{textDecoration:"none"}}key={user._id}>
                <img className="shareProfileImg" src={user.profilePicture ? PF + user.profilePicture : PF + "person/noAvatar.png"} alt="" />  
            </Link>

                <textarea         
                 placeholder={!event? "What's in your mind " + user.firstName + "?" : "Tell us about the long-awaited event!"}
                 className="shareInput"
                 value={descValue}
                 onChange={(e) => setDescValue(e.target.value)}
                 onClick = {()=>setClickOnInput(!clickOnInput)}/>
          {!event &&(     
    <div className="postType">
    <div className="postTypeOption">
      <input type="radio" id="question" name="postType" value="question" checked={postType === 'question'}
        onChange={handlePostTypeChange} />
      <label htmlFor="question">Question</label>
    </div>
    <div className="postTypeOption">
      <input type="radio" id="post" name="postType" value="post"checked={postType === 'post'}
        onChange={handlePostTypeChange}/>
      <label htmlFor="post">Post</label>
    </div>
  </div>
    )}
            </div>
            <Modal opened={showQuestionModal} onClose={() => {
  setShowQuestionModal(false);
  setQuestionType("");
}}
overlayOpacity={0.3}
      overlayBlur={3} >
                <h3 style={{textAlign:"center"}}>Select Question Type</h3>
                <Select placeholder="Question Type"
              className="questionOptionSelects"
              defaultValue={questionType}
              onChange={setQuestionType}
              options={questiontypeOptions}
              styles={{
                control: (provided) => ({
                  ...provided,
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  boxShadow: '0 2px 2px rgba(0, 0, 0, 0.1)',
                 // backgroundImage: `url(${PF}${user.organization.organizationPicture})`,

                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: 'black', // change text color to black
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: 'black',
                }),
                option: (provided) => ({
                  ...provided,
                  color: 'black', // change text color to black
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px',

                }),
                indicatorSeparator: () => ({ display: 'none' }),
                dropdownIndicator: (provided) => ({
                  ...provided,
                  appearance: 'none',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right center',
                  paddingRight: '20px',
                }),
              }}
            />
            <div>
          <button className="okModalBtn" onClick={handleQuestionModalSubmit}>OK</button>
        </div>
              </Modal>
            <div className="centerShare">
            <Select placeholder="Severity"
              className="postOptionSelects"
              defaultValue={isImportant}
              onChange={setIsImportant}
              options={typeOptions}
              styles={{
                control: (provided) => ({
                  ...provided,
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  boxShadow: '0 2px 2px rgba(0, 0, 0, 0.1)',
                 // backgroundImage: `url(${PF}${user.organization.organizationPicture})`,

                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: 'black', // change text color to black
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: 'black',
                }),
                option: (provided) => ({
                  ...provided,
                  color: 'black', // change text color to black
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px',

                }),
                indicatorSeparator: () => ({ display: 'none' }),
                dropdownIndicator: (provided) => ({
                  ...provided,
                  appearance: 'none',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right center',
                  paddingRight: '20px',
                }),
              }}
            />
            </div>
            <hr className="shareHr"/>
            {file && (
                <div className="shareImgContainer">
                    <img className="shareImg" src={URL.createObjectURL(file)} alt =""/>
                    <div >
                    <Cancel className="shareCancelImg" onClick= {()=> setFile(null)}/>
                </div>
                </div>
            )}
            <form className="shareBottom" onSubmit={submitHandler}ref={ClickOutsideRef}>
               <div className="shareOptions">
                <label htmlFor="file" className="shareOption">
                    <PermMedia htmlColor="tomato" className="shareIcon"/>
                    <span className="shareOptionText">Photo or video</span>
                    <input style={{display:"none"}} type="file" id ="file" accept=".png,.jpeg,.jpg" onChange={(e)=> setFile(e.target.files[0])}/>
                </label>
                <div className="shareOption"onClick = {()=>setTagsClicked(true)}>
                    <Label htmlColor="blue" className="shareIcon" />
                    <span className="shareOptionText">Tag</span>
                    { tagsClicked && (
                    <TagInput onTagSelect={handleTagSelect} />
                    )}
                </div>
                <div className="shareOption"onClick={getLocation}>
                    <Room htmlColor="green" className="shareIcon"/>
                    <span className="shareOptionText">Location</span>
                </div>
                <div className="shareOption" onClick={()=>setEmojiClicked(!emojiClicked)}>
                    <EmojiEmotions htmlColor="orange" className="shareIcon"/>
                    <span className="shareOptionText">Feelings</span>
                </div>
                {emojiClicked && (
                    <div className="emojiContainer" style={{ height: shareHeight }}>
                    <EmojiPicker className="emojiPicker" onEmojiClick={handleEmojiClick} />
                  </div>
                )}
                </div> 
                <button className={`shareButton ${(!descValue && !file) ? 'disabled' : ''}`} type="submit" disabled={!descValue && !file}>
              {!event ? (
                isLoading ? (
                  <div className="buttonWrapper">
                    <CircularProgress color="white" size="20px" />
                    <span className="buttonText">Sharing...</span>
                  </div>
                ) : (
                  <span className="buttonText">Share</span>
                )
              ) : isLoading ? (
                <div className="buttonWrapper">
                  <CircularProgress color="white" size="20px" />
                  <span className="buttonText">Adding event...</span>
                </div>
              ) : (
                <span className="buttonText">Add event</span>
              )}
            </button>
            </form>
        </div>
    </div>
  );
}
