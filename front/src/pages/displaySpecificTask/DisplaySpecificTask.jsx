import "./displaySpecificTask.css"
import {MoreVert,Share,Edit,Save,Delete,FavoriteBorderRounded,FavoriteRounded,ChatBubbleOutlineRounded} from "@material-ui/icons"
import { useEffect,useState,useRef,forwardRef } from "react";
import axios from "axios";
import {format} from "timeago.js"
import {Link} from "react-router-dom"
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Modal, useMantineTheme } from "@mantine/core";
import {useParams} from "react-router"
import Rightbar from "../../components/rightbar/Rightbar";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import {io} from "socket.io-client";


export default function DisplaySpecificTask() {
    const [editMode, setEditMode] = useState(false);
    const [task,setTask] = useState('');
    const [socket, setSocket] = useState(null);
    const taskDesc = useRef(task?.desc);
    const [user,setUser] = useState({});
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const {user: currentUser} = useContext(AuthContext);
    const [openPopup, setOpenPopup] = useState(false);
    const pattern = /@(\w+)/g;
    const [replacedText,setReplacedText] = useState(task?.desc?.replace(pattern, '<a href="/profile/$1">$1</a>'));
    const ClickOutsideRef = useRef(null);
    const theme = useMantineTheme();
    const [isDeletePostClicked, setIsDeletePostClicked] = useState(false);
    const {organization} = useContext(AuthContext);
    const [status, setStatus] = useState(task?.status);
    const [statusColor, setStatusColor] = useState(false);
    const taskId = useParams().userTask;
    const [taskOpenPopup, setTaskOpenPopup] = useState(true);
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);

    useEffect(()=>{
        setSocket(io("ws://localhost:8900"));
        socket?.emit("addUser", user?._id);
      
        },[]);

    useEffect(() => {
        const fetchTask = async () => {
          const res = await axios.get(`/tasks/${taskId}/specificTask`);
          setTask(res.data);
          setReplacedText(res.data.desc?.replace(pattern, '<a href="/profile/$1">$1</a>'))
        };
        fetchTask();
      }, [taskId]);


    useEffect (() =>{
      if (task?.status === 'To do') {
        setStatusColor('red');
      } else if (task?.status === 'In progress') {
        setStatusColor('orange');
      } else if (task?.status === 'Done') {
        setStatusColor('green');
      }
    setStatus(task?.status);
    },[task?.status]);



    useEffect(() => {

        function handleClickOutside(event) {
         
          
           if(!ClickOutsideRef.current?.contains(event.target) && editMode)
                setEditMode(!editMode)
            if(!ClickOutsideRef.current?.contains(event.target) && openPopup)
                setOpenPopup(!openPopup)     
          if(openPopup && editMode)
                setOpenPopup(false);
            
        }
            
              document.addEventListener("click", handleClickOutside);
              return () => {
                document.removeEventListener("click", handleClickOutside);
              };
            }, [ClickOutsideRef,openPopup,editMode,Modal]);
    
    
    useEffect (() =>{
        const fetchUser = async () => {
          const res = await axios.get(`/users/${organization._id}?userId=${task?.creatorId}`);
          setUser(res.data);
         // fetch members who the task was sent to
         const members = await Promise.all(
          task.members.map(async (memberId) => {
            if (memberId !== res.data._id) {
              const response = await axios.get(`/users/${organization._id}?userId=${memberId}`);
              return response.data;
            }
          })
        );
        setMembers(members.filter((member) => member !== undefined));
};
    
      fetchUser();
    }, [task?.creatorId, task?.members, organization._id]);

      

    

    const handleEdit = async (e) => {
        e.preventDefault();
        const updatedTask = {
            userId: task.creatorId,
            desc: taskDesc.current.value,
        };
        try {
          await axios.put(`/tasks/${task._id}`, updatedTask);
          setEditMode(false);
        } catch (err) {
          console.log(err);
        }
        window.location.reload();

      }

      const handleDeleteConfirm = async (e) => {
        e.preventDefault();
            try {
                await axios.delete(`/tasks/${task._id}`);
                setEditMode(false);
              } catch (err) {
                console.log(err);
              }
              window.location.reload();
      
            }
    
        
      const handlePopUp = (e) => {
        setEditMode(!editMode);

      }

      const handleTaskTypeChange = async(e) => {
        const selectedStatus = e.target.value;
        if (selectedStatus === 'To do') {
            setStatusColor('red');
          } else if (selectedStatus === 'In progress') {
            setStatusColor('orange');
          } else if (selectedStatus === 'Done') {
            setStatusColor('green');
          }
        setStatus(e.target.value);
        const updatedTask={
          status:selectedStatus
        }
        await axios.put("/tasks/"+ task._id ,updatedTask);
        const updateTaskNotification ={
          operation: "changeTaskStatus",
          senderId: currentUser._id,
          post: task.data
        }
        if(task.creatorId !== currentUser._id)
        {
          socket?.emit("sendTaskStatus",{
            senderId: currentUser._id,
            recieverId:user._id,
            post:task,
            operation: "changeTaskStatus",
          })
      await axios.put("/users/" + organization._id +"/" + user._id + "/NewPostNotify",updateTaskNotification);
      };
    }

  return (
    <>
    <Topbar/>
    <div className="displayPost">
    <Sidebar/>
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
    size={"40%"}
    overlayBlur={3}
    opened={taskOpenPopup}
    onClose={() => navigate("/")}
  >
    <div className="task" ref={ClickOutsideRef}>
            <div className="taskWrapper">              
                <div className="taskTop">
    
                <Link to= { `/profile/${user.firstName}` }className="link">
                    <div className="taskTopLeft">
                       
                        <img 
                            className="taskProfileImg" 
                            src={ user.profilePicture ? PF + user.profilePicture : PF+"person/noAvatar.png"}
                            alt =""
                        />
                        <span
                         className="taskUsername">
                            {user.firstName} {user.lastName }
                        </span>
                       
                       
                    </div>
                    </Link>
                    <div className="taskTopRight" >
                    <span className="taskDate">{format(task?.createdAt)}</span>
                    <span className="taskT"> task</span>
    
                        {currentUser._id === task?.creatorId &&
                            <MoreVert className="moreVertIcon" onClick={() => setOpenPopup(!openPopup)}/>
                        }
    
                        <div className="popWrapper" >
                {openPopup &&(
                    <div className="taskOptionsPopup">
                        <div className="popUpTaskItem" onClick={ handlePopUp}>
                        <Edit className="popTaskItemIcon"/>
                        <span className="textTaskButton">Edit
                        </span>
                        </div>
                            <div className="popUpTaskItem"onClick={ ()=>setIsDeletePostClicked(!isDeletePostClicked)}>
                            <Delete className="popTaskItemIcon"/>
                        <span className="textTaskButton">
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
     opened={isDeletePostClicked} onClose={() => setIsDeletePostClicked(false)}
>
        <h2>Are you sure you want to delete the task?</h2>
        <div className="buttonsModalFrame">
        <button className="modalButton" onClick={()=> setIsDeletePostClicked(false)}>Cancel</button>
        <button className="modalButton" onClick={handleDeleteConfirm}>Delete</button>
        </div>
      </Modal>
                       </div>
                )}
                    </div>
    
                </div>
                
            </div>
              <div className="">
            {members && members.length > 0 && (
            <span className="taskSentTo">
              {members.map((member, index) => (
                <Link to={`/profile/${member?.firstName}`} className="link" key={member?._id}>
                  <span className="memberAvatar">
                    {member?.firstName} {member?.lastName}
                  </span>
                </Link>
              ))}
            </span>
          )}
        </div>
                <div className="taskCenter">
                    {editMode && (
                        <>
                    <textarea
                     defaultValue ={task?.desc}
                     className="shareInput"
                     ref ={taskDesc}/>
                     <button className="saveButton" onClick={handleEdit}>
                        Update
                     </button>
                     </>
    
    
                    )}
                    { !editMode && (
                         <div className="taskCenter">
                        <div className="taskText" dangerouslySetInnerHTML={{ __html: replacedText }}/>
                        </div>
                    )}
                    
                </div>
                {task?.creatorId !== currentUser._id && task.members?.some(member => member !== currentUser._id) && (
                <div className="taskBottom">
                <div className="taskBottomLeft">
                  <label className={`taskButton ${status === 'To do' ? 'active' : ''}`}>
                    <input type="checkbox" name="task1" id="task1" value="To do" checked={status === 'To do'} onChange={handleTaskTypeChange}/>
                    <span>To do</span>
                  </label>
                  <label className={`taskButton ${status === 'In progress' ? 'active' : ''}`}>
                    <input type="checkbox" name="task2" id="task2" value="In progress" checked={status === 'In progress'} onChange={handleTaskTypeChange}/>
                    <span>In Progress</span>
                  </label>
                  <label className={`taskButton ${status === 'Done' ? 'active' : ''}`}>
                    <input type="checkbox" name="task3" id="task3" value="Done" checked={status === 'Done'} onChange={handleTaskTypeChange}/>
                    <span>Done</span>
                  </label>
                </div>
                    <div className="taskBottomRight">
    
                    </div>
                   
                </div>
                )}
                <div>Status:
                <span className="status" style={{ color: statusColor }}> {status}</span>
                </div> 
            </div>    
        </div>
    </Modal>
    <div className="postRightBottom">
          <Rightbar />
        </div>
    </div>
    </>
      )
    }