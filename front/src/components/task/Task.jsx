import { Modal, useMantineTheme } from "@mantine/core";
import "./task.css";
import Select from 'react-select'
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import {io} from "socket.io-client"
import {CircularProgress} from "@material-ui/core"


export default function Task({ modalOpened, setModalOpened,userId }) {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { user, organization } = useContext(AuthContext);
  const [fetchUser,setFetchUser] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [textareaValue, setTextareaValue] = useState('');
  const [selectedEmps, setSelectedEmps] = useState([]);
  const [taskCreated, setTaskCreated] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(()=>{
    setSocket(io("ws://localhost:8900"));
    socket?.emit("addUser", user?._id);

    },[]);

    useEffect(()=>{
      const checkIfUserIdDefined = async() =>{
        const res = await axios.get(`/users/${organization._id}?userId=${userId}`);
        setFetchUser(res.data);
        setSelectedEmps([{ value: res.data._id, label: `${res.data.firstName} ${res.data.lastName}` }]);
        };
  
      if(userId)
        checkIfUserIdDefined()
      },[userId]);

    
  useEffect(() => {
    const fetchSubordinates = async () => {
      let res;
      if (user.userType === "CEO") {
        res = await axios.get(`/departments/manager/${organization._id}`);
        setEmployees(res.data);
      }
      else if (user.userType === "Manager") {
        res = await axios.get(`/departments/manager/${organization._id}/${user._id}`);
        setEmployees(res.data);
      }
    };
    fetchSubordinates();
  }, [user.userType, organization._id]);

  const handleTextareaChange = (event) => {
    setTextareaValue(event.target.value);
  }

  const handleEmpsChange = (selectedOptions) => {
    setSelectedEmps(selectedOptions);
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const newTask = {
        status: "To do",
        creatorId: user._id,
        desc: textareaValue,
        members: [...selectedEmps.map(emp => emp.value), user._id],
      };
      const task = await axios.post("/tasks", newTask);
      const updateTaskNotification ={
        operation: "task",
        senderId: user._id,
        post: task.data
    }

    for(let i=0; i < newTask.members.length; i++)
    {
      if(newTask.members[i] !== user._id)
      {
        socket?.emit("sendTask",{
          senderId: user._id,
          recieverId:newTask.members[i],
          post:task.data,
          operation:"task"
      })
      const member = employees.find(emp => emp._id === newTask.members[i]);
      const formDataToSend = new FormData();
        formDataToSend.append('to', member.email);
        formDataToSend.append('subject', 'New task assigned to you');
        formDataToSend.append('text', `You have been assigned a new task by ${user.firstName} ${user.lastName}:\n ${textareaValue}`);
        await axios.post('/send-email', formDataToSend);
        await axios.put("/users/" + organization._id +"/" + newTask.members[i] + "/NewPostNotify",updateTaskNotification);

      }
    }
        setTaskCreated(true);
    } catch (err) {
      console.log(err);
    }
  }

  const handleModalClose = () => {
    setModalOpened(false);
    setSelectedEmps([]);
    setTextareaValue('');
    setTaskCreated(false);
  }

  return (
    <Modal
      overlayColor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
      size="55%"
      opened={modalOpened}
      onClose={handleModalClose}
    >
      <div className="taskContainer">
        <form className="taskForm" onSubmit={submitHandler}>
          <h2>Create Task</h2>
          <div>
            <span>Select Employees: </span>
            <Select
              isMulti
              options={employees.map(emp => ({ value: emp._id, label: `${emp.firstName} ${emp.lastName}` }))}
              value={selectedEmps}
              onChange={handleEmpsChange}
              placeholder="Select employees to assign task"
              noOptionsMessage={() => "No employees available"}
            />
          </div>

          <div>
            <textarea
              className="descInput"
              autoFocus="autofocus"
              placeholder="Describe the task..."
              value={textareaValue}
              onChange={handleTextareaChange}
            />
          </div>

        <button className={`addButton ${isLoading || selectedEmps.length === 0 ? 'disabled' : ''}`} disabled={isLoading || selectedEmps.length === 0}>
        {isLoading ? (
          <CircularProgress color="white" size="20px" />
        ) : (
          "Add task"
        )}
      </button>          
      {taskCreated && 
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
     opened={taskCreated} onClose={() => setTaskCreated(false)}
>
          <h2> Task created successfully! </h2>
						<div className="buttonsModalFrame">
						<button className="modalOkButton" onClick={()=>  setModalOpened(false)}>Ok</button>
						</div>
					  </Modal>
          }
        </form>
      </div>

    </Modal>
  );
}
