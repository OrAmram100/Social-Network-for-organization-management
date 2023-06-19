import "./comment.css"
import { useEffect,useState,useRef } from "react";
import axios from "axios";
import {format} from "timeago.js"
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {MoreVert,Share,Edit,Save,Delete,HowToRegOutlined,HowToReg} from "@material-ui/icons"
import {io} from "socket.io-client"
import {Modal, NumberInput, Button, useMantineTheme } from "@mantine/core";



export default function Comment({comment,post,timeLeft}) {
    const [user,setUser] = useState("");
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const {user: currentUser} = useContext(AuthContext);
    const [smallEditPopUp,setSmallEditPopUp] = useState(false);
    const [editMode,setEditMode] = useState(false);
    let commentText = useRef(comment.text);
    const ClickOutsideRef = useRef(null);
    const socket = useRef();
    const [isDeleteCommentClicked, setIsDeleteCommentClicked] = useState(false);
    const theme = useMantineTheme();
    const {organization} = useContext(AuthContext);
    const [votes,setVotes] = useState(comment.votes?.length);
    const [isVoted,setIsVoted] = useState(comment.votes?.includes((vote) => vote.userId === currentUser._id));
    const [showConfidenceModal, setShowConfidenceModal] = useState(false);
    const [confidenceLevel, setConfidenceLevel] = useState(50);
    const [isCorrect, setIsCorrect] = useState(comment.isCorrect);
    const [votesComment, setVotesComment] = useState(comment.votes);


    useEffect(() => {

      socket.current = io("ws://localhost:8900");
      socket.current.on("commentUpdated", ({ postId, commentId, text }) => {
        if (postId === post._id && commentId === comment._id) {
          comment.text = text;

        }
      });

      socket.current.on("getCorrectAnswer", ({commentId,postId }) => {
        if (commentId === comment._id && post._id === postId) {
          setIsCorrect(true);
          comment.isCorrect = true;
        }
      });

      socket.current.on("voteCommentUpdated", ({ postId, commentId, votes }) => {
        if (postId === post._id && commentId === comment._id) {
          setVotesComment(votes);
          setVotes(votes.length)
          comment.votes = votes
        }
      });

      socket.current.on("resetingVotes", ( {commentId,postId}) => {
        if (postId === post._id && commentId === comment._id) {
          setVotesComment([]);
          comment.votes = [];
          setVotes(0);
          setIsVoted(false);
        }
      });
  
      socket.current.on("deleteComment", ({ postId, commentId }) => {
        if (postId === post._id && commentId === comment._id) {
          window.location.reload();
        }
      });
  
      
    }, [post._id, comment._id,socket]);

    useEffect(() => {
      const userVote = votesComment.find((vote) => vote.userId === currentUser._id);
      setVotes(votesComment.length);
      setIsVoted(!!userVote);
    }, [votesComment, currentUser._id]);

    useEffect (() =>{
      const fetchUser = async () => {
        const res = await axios.get(`/users/${organization._id}?userId=${comment.userId}`);
        setUser(res.data);
      };
      if(comment.userId!== undefined)
          fetchUser();
    },[comment.userId]);

    
    useEffect(() => {

      function handleClickOutside(event) {
       
        
         if(!ClickOutsideRef.current?.contains(event.target) && editMode)
              setEditMode(!editMode)

        if(!ClickOutsideRef.current?.contains(event.target) && smallEditPopUp)
              setSmallEditPopUp(!smallEditPopUp)     
        if(smallEditPopUp && editMode)
              setSmallEditPopUp(false);
          
      }
          
            document.addEventListener("click", handleClickOutside);
            return () => {
              document.removeEventListener("click", handleClickOutside);
            };
          }, [ClickOutsideRef,smallEditPopUp,editMode]);

    const handleEditComment = async (e) => {
      e.preventDefault();
      try
      {
        await axios.put(`/posts/${post._id}/comment/${comment._id}`, {
          text: commentText.current.value
      })
      .then(response => {
          console.log(response.data);
      })
      .catch(error => {
          console.log(error);
      });
      // Emit the updateComment event to the Socket.IO server
    socket.current.emit('updateComment', {
      postId: post._id,
      commentId: comment._id,
      text: commentText.current.value
    });


    }
    
      catch(err)
      {
        console.log(err);
      }


    }
    
    const handleDeleteComment = async () => {
        try {
          await axios.delete(`/posts/${post._id}/comment/${comment._id}`);
          socket.current.emit("deleteComment", { postId: post._id, commentId: comment._id });

        } catch (err) {
          console.log(err);
        }
    };

    const voteHandler= async() => {
      if(timeLeft === 0 || comment.userId === currentUser._id)
        return;
      try{
          if(post.questionType === "Knowledge question" && !isVoted)
          {
            setShowConfidenceModal(true);
          }
          else
          {
            const updateComment = await axios.put("/posts/" + post._id + `/comment/${comment._id}/vote`, {userId:currentUser._id })
            socket.current.emit('updateVoteComment', {
              postId: post._id,
              commentId: comment._id,
              votes: updateComment.data.votes? updateComment.data.votes : [] 
            });
            setVotes(isVoted ? votes -1 : votes + 1);
            setIsVoted(!isVoted);
          }
      }catch(err){
          console.log(err);
      } 
  }


  const handleConfidenceSubmit = async () => {
      try {
        const updateComment = await axios.put(
          `/posts/${post._id}/comment/${comment._id}/vote`,
          { userId: currentUser._id, confidenceLevel }
        );
  
        socket.current.emit('updateVoteComment', {
          postId: post._id,
          commentId: comment._id,
          votes: updateComment.data.votes ? updateComment.data.votes : [],
        });
      } catch (err) {
        console.log(err);
      }
  
      setVotes(isVoted ? votes - 1 : votes + 1);
      setIsVoted(!isVoted);
      setShowConfidenceModal(false);
  };

      return (
        <div>
          {user !== "" && (
          <div className="comment" ref={ClickOutsideRef}>
          <div className={`commentsWrapper ${isCorrect ? "correct-commentsWrapper" : ""}`} ref={ClickOutsideRef}>
              <div className="commentTop">
                <Link
                  className="commentTop"
                  to={"/profile/" + user.firstName}
                >
                  <img
                    className="commentImg"
                    src={
                      user.profilePicture
                        ? PF + user.profilePicture
                        : PF + "person/noAvatar.png"
                    }
                    alt=""
                  />
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                </Link>
                
                <div className="commentBottom">{format(comment.createdAt)}</div>
                <div className="moreVertIconComment">
                {(user._id === currentUser._id || post.userId === currentUser._id) &&(
                <MoreVert
                        className="itemIcon"
                        onClick={() => setSmallEditPopUp(!smallEditPopUp)}
                      />
                )}
                  </div>
              </div>
              
                <div className="commentCenter">
                
                  <div className="commentFrame">
                    
                    {!editMode?(
                     <p className="commentText">{comment.text}</p>
                     
                    ):
                      (
                          <>
                          <textarea
                          defaultValue ={comment.text}
                          className="commentInput"
                          ref={commentText}/>                          
                          <button className="saveButtonComment" onClick={handleEditComment}>
                          Comment
                          </button>
                          </>
                     ) }
                     
                    </div>
                    {post.type === "question" &&
                    <div className="commentVote" title="Vote">
                    {isVoted ? (
                      <div title="Voted" style={{display: "flex"}}>
                      <HowToReg style={{ cursor: timeLeft === 0 || comment.userId === currentUser._id? "not-allowed" : "pointer" }} htmlColor="green" className="howtoRegIcon" onClick={() => voteHandler()} />
                    </div>
                    ):(
                      <HowToRegOutlined style={{ cursor: timeLeft === 0 || comment.userId === currentUser._id ? "not-allowed" : "pointer" }} className="howtoRegOutlinedIcon"  onClick={()=>voteHandler()}/>

                    )
                  }
                    <span className="voteCount"title="Total votes">{votesComment.length}</span>
                  </div>
                    }
                    <Modal
        opened={showConfidenceModal}
        onClose={() => setShowConfidenceModal(false)}
      >
        <h2>Please enter your confidence level:</h2>
        <NumberInput
          min={50}
          max={100}
          value={confidenceLevel}
          onChange={setConfidenceLevel}
          label="Confidence Level"
        />
        <Button className="submitBtn" onClick={handleConfidenceSubmit}>Submit</Button>
      </Modal>
                      <div className="popupContainer">
                      
                      {smallEditPopUp &&(
                  <div className="editPopupWindow">
                  <div className="commentOptionsPopup">
                  {currentUser._id === user._id && (
                     <div className="smallPopUpItem" onClick={ ()=> setEditMode(!editMode)}>
                        <Edit className="popItemIcon"/>
                        <span className="textButtonPopup">Edit
                        </span>
                        </div>
                      )}
                        <div className="smallPopUpItem" onClick={()=>setIsDeleteCommentClicked(!isDeleteCommentClicked)}>
                            <Delete className="popItemIcon"/>
                        <span className="textButtonPopup">
                            Delete</span>
                            </div>
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
     opened={isDeleteCommentClicked} onClose={() => setIsDeleteCommentClicked(false)}
>
        <h2>Are you sure you want to delete the comment?</h2>
        <div className="buttonsModalFrame">
        <button className="modalButton" onClick={()=> setIsDeleteCommentClicked(false)}>Cancel</button>
        <button className="modalButton" onClick={handleDeleteComment}>Delete</button>
        </div>
      </Modal>
                       </div>
                       </div>

                      )
                    }
                    </div>
            
                    </div>
                </div>
                </div>

          )}
        </div>
      );
    }