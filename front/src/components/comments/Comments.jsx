import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./comments.css"
import {useRef} from "react";
import { useState } from "react"
import Comment from "../../components/comment/Comment"
import { useEffect } from "react"

export default function Comments ({post}) {
    const { user } = useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const comment = useRef();
    const [comments,setComments] = useState([]);
    const [recieveComment,setRecieveComment] = useState(comment?.current?.value !== undefined);

    useEffect(()=>{ 
      recieveComment&&
      setComments(prev=>[...prev,comment])
  },[comment,recieveComment]);

  useEffect (() =>{
    const fetchComments = async () => {
      await axios.get(`/comments?postId=${post._id}`).then(response => {
        setComments(response.data);
      })
    };
  
    fetchComments();
  },[post._id]);

    const submitHandler = async (e) =>{
      e.preventDefault();
      const newComment = {
        userId: user._id,
        text: comment.current.value,
        postId: post._id
    };
    try
    {
      const res= await axios.post("/comments", newComment);
      setComments(comments =>[...comments, res.data]);
      setRecieveComment(!recieveComment)

    }
      catch(err)
      {
        console.log(err);
      }
    }
    
    return (
      <>
      <div className="wrapper">{comments.map(c=>(
        <Comment comment ={c} own={c.userId !== user._id}/>
    ))}
             </div>
   
      <form className="postCommentBottom" onSubmit={submitHandler}>
      <div className="comments">
        <div className="containerComments">
        <img className="profileImg" src={user.profilePicture ? PF + user.profilePicture : PF + "person/noAvatar.png"} alt=""/>
          <input className="text" type="text" placeholder="write a comment" ref={comment}/>
          <button className="sendBtn"type= "submit">Send</button>
        </div>        
      </div>
      </form>
      </>
    );
  };