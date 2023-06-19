import { useEffect, useState } from "react";
import axios from "axios";
import Topbar from "../../components/topbar/Topbar";
import "./attendance.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction";
import { Modal, Form, Input, Button, Select, InputNumber, Table,Space  } from "antd";
import Sidebar from "../../components/sidebar/Sidebar";
import Rightbar from "../../components/rightbar/Rightbar";
import Share from "../../components/share/Share";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Attendance() {
  const [isAttendanceVisible, setIsAttendanceVisible] = useState(false);
  const [hours, setHours] = useState();
  const [events, setEvents] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [dateClicked, setisDateClicked] = useState(false);
  const [date, setDate] = useState('');
  const [endDateShare, setEndDateShare] = useState('');

  const { user, organization } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [isEventClicked, setisEventClicked] = useState(false);
  const [addEventSuccessfully,setAddEventSuccessfully] = useState(false);
  const [presenceError,setPresenceError] = useState(false);
  const [addPresenceSuccessfully,setAddPresenceSuccessfully] = useState(false);
  const [endDate, setEndDate] = useState(null);
  const [isSelectedEvent, setIsSelectedEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [present, setPresent] = useState(true);
  const [reasonOfAbsence, setReasonOfAbsence] = useState('-');
  const [employees, setEmployees] = useState([]);
  const [employeeAttendances, setEmployeeAttendances] = useState([]);
  const[selectedEventAttendance,setSelectedEventAttendance] = useState(null);
  const [isSelectedEventAttendance, setIsSelectedEventAttendance] = useState(false);


  const { Option } = Select;


  useEffect(() => {
    const fetchSubordinates = async () => {
      let res;
      res = await axios.get(`/departments/${organization._id}/subordinates/${user._id}`);
      setEmployees(res.data);
    };
    fetchSubordinates();
  }, [user.userType, organization._id]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAddPresenceSuccessfully(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [addPresenceSuccessfully]);


  useEffect(() => {
    const timeout = setTimeout(() => {
      setAddEventSuccessfully(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [addEventSuccessfully]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPresenceError(false);
    }, 2500);
    return () => clearTimeout(timeout);
  }, [presenceError]);

  const fetchCalendarEvents = async () => {
    try {
      const response = await axios.get(`/CalendarEvents/events/${organization._id}`);
      setEvents(response.data);
      const attendances = await axios.get(`/attendances/${user._id}`);
      setEvents([...response.data, ...attendances.data]);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCalendarEvents();
  }, []);

  const fetchSubordinates = async () => {
    try {
      const promises = employees.map(async (employee) => {
        const attendances = await axios.get(`/attendances/${employee._id}`);
        return attendances.data;
      });
  
      const results = await Promise.all(promises);
  
      const allAttendances = results.flat(); // Combine all attendance data into a single array
  
      setEmployeeAttendances(allAttendances);
    } catch (error) {
      console.error(error);
    }
  };
 
  useEffect(() => {
    fetchSubordinates();
  }, [employees]);


  const showModal = (event) => {
    const date = new Date(event.dateStr);
    const currentDate = new Date();
      setDate(date);
      setSelectedDate([{ key: "1", date: date.toISOString().split('T')[0], hours: 0 }]);
      date.setHours(0,0,0,0);
      setReasonOfAbsence('-');
      setVisible(false);
      setHours(0);    
      setPresent(true);
      setSelectedEventAttendance(null);
      setSelectedEventAttendance(null);
      setTitle('');
     if(user.userType === "Employee")
     {
      if(date <= currentDate)
      {
        setIsAttendanceVisible(true);
      }
      else
      {
        setPresenceError(true);
      }

     }
     else
     {   
      
      setisDateClicked(true)
       
     }

  };

  

  const handleOkOption = () => {
    const today = new Date();
    today.setHours(0,0,0,0); // Set the time to 00:00:00.000
    date.setHours(0,0,0,0)
    if(selectedOption === "update-attendance")
    {
      if (date <= today) {
      setIsAttendanceVisible(true);
      setisDateClicked(false);
      }
      else{
        setPresenceError(true)
        setisDateClicked(false);
      }
    }
    else if (selectedOption === "show employees attendances") {
      const selectedDateISO = new Date(selectedDate[0].date).toISOString();
      const filteredAttendances = employeeAttendances.filter((attendance) => {
        return attendance.start.slice(0, 10) === selectedDateISO.slice(0, 10);
      });
      const data = filteredAttendances.map((attendance) => {
          return {
            key: attendance._id,
            employeeName: attendance.userName,
            date: new Date(attendance.start).toLocaleDateString('en-GB'),
            hours: attendance.hours,
            isAttend: attendance.isAttend,
            reasonOfAbsence: attendance.reasonOfAbsence,
          };
        });
        const handleDownloadPDF = () => {
          const doc = new jsPDF();
          doc.text(`Employees Attendance for ${new Date(date).toLocaleDateString('en-GB')}`, 14, 16);
          doc.autoTable({
            startY: 20,
            head: [["Employee Name", "Date", "Hours","Attendance","Reason of Absence"]],
            body: data.map(({ employeeName, date, hours, isAttend,reasonOfAbsence}) => [employeeName, date, hours,isAttend,reasonOfAbsence]),
          });
          doc.save(`Attendance table for ${new Date(date).toLocaleDateString('en-GB')}.pdf`);
        };
    
      const columns = [
        {
          title: 'Employee Name',
          dataIndex: 'employeeName',
          key: 'employeeName',
        },
        {
          title: 'Date',
          dataIndex: 'date',
          key: 'date',
        },
        {
          title: 'Hours',
          dataIndex: 'hours',
          key: 'hours',
        },
        {
          title: 'Attendance',
          dataIndex: 'isAttend',
          key: 'isAttend',
          render: (isAttend) => isAttend ? 'Present' : 'Absent',
        },
        {
          title: 'Reason of Absence',
          dataIndex: 'reasonOfAbsence',
          key: 'reasonOfAbsence',
        },
      ];
    
      Modal.info({
        width: "60%",
        height: "80%",
        title: "Employee Attendances",
        bodyStyle: { maxHeight: "700vh", overflow: "auto",width:"100%" },
        content: (
            <Table id="table" columns={columns} dataSource={data} />
        ),
        okButtonProps: {
          style: { backgroundColor: "#e49758c7", color: "white" },
        },
        maskStyle: {
          backgroundColor: "'rgba(240, 240, 240, 0.8)",
          opacity: 0.2,
          backdropFilter: "blur(3px)",
        },
        footer: [
          <div style={{ float: "right" }}>
          <Space key="buttonGroup">
          <Button key="download"style= {{ backgroundColor: "#e49758c7", color: "white" }}  onClick={handleDownloadPDF}>
            Download as PDF
          </Button>
          <Button key="ok"style= {{ backgroundColor: "#e49758c7", color: "white" }}  type="primary" onClick={()=> Modal.destroyAll()}>
            Ok
          </Button>
          </Space>
          </div>

    ],
        
      });
    }
    else
      setisEventClicked(true);

       
};

  const handleEventOk = async ()=>{
    // create a new event object
  const newEvent = {
    title: title,
    start: selectedDate[0]?.date,
    end: endDate? endDate[0].date:selectedDate[0]?.date,
    organizationId: organization._id,
    userId: user._id

  };
  // add the new event to the events array

  // clear the form inputs
  setTitle('');
  setSelectedDate([]);
  setEndDate(null);

  setisEventClicked(false);
  setisDateClicked(false);

    // save Event to the database  
  try {
    // send the new event data to the server
    const event = await axios.post("/CalendarEvents/events", newEvent);
    setEvents([...events, event.data]);

    console.log('Event saved to the database');
  } catch (error) {
    console.error(error);
  }

  }
  


  const handleOk = async() => {
    const newAttendanceEvent = {
      title: "Attendance Submitted",
      start: selectedDate[0].date,
      userId: user._id,
      userName: user.firstName + " " + user.lastName,
      isAttend: present,
      reasonOfAbsence:reasonOfAbsence,
      hours: hours
    };

    try {
      if(selectedEventAttendance !== null)
      {
        const response = await axios.put(
          `/attendances/${selectedEventAttendance._def.extendedProps._id}`,
          newAttendanceEvent
        );
        const updatedEvent = response.data;
        setEvents((prevState) => {
          return prevState.map((event) =>
            event._id === selectedEventAttendance._def.extendedProps._id ? updatedEvent : event
          )
        });
      }
      else
      {
        const event =  await axios.post("/attendances", newAttendanceEvent);
        setEvents([...events, event.data]);   
        console.log('Event saved to the database');
      }
    } catch (error) {
      console.error(error);
    }
    setIsAttendanceVisible(false);
    setIsSelectedEventAttendance(false)
    setAddPresenceSuccessfully(true)  
    setReasonOfAbsence('-');
    setHours(0);    
    setPresent(true);
    setSelectedEventAttendance(null);
  };



  const handleCancel = () => {
    setIsAttendanceVisible(false);
    setIsSelectedEventAttendance(false)
    setisEventClicked(false);
    setIsSelectedEvent(false);
  };

  const handleSelectChange = (value) => {
    if (value === "not present") {
      setPresent(false);
      setVisible(true);
    } else if(value === "present") {
      setPresent(true)
      setVisible(false);
    }
    else{
      setReasonOfAbsence(value)
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    ...(visible
      ? []
      : [
          {
            title: "Hours",
            dataIndex: "hours",
            key: "hours",
            render: (text, record) => (
              <InputNumber
                min={0}
                max={24}
                value={hours}
                onChange={(value) => {
                  setHours(value);
                }}
              />
            ),
          },
        ]),
  ];
  const handleEventDelete = async () => {
    try {
      // Close the modal first
      setIsSelectedEvent(false);
  
      // Open a confirmation modal before deleting the selected event
      Modal.confirm({
        title: "Are you sure you want to delete this event?",
        okText: "Delete",
        okType: "danger",
        cancelButtonProps: { style: { backgroundColor: "#e49758c7",color:"white" } },
        okButtonProps: { style: { backgroundColor: "#e49758c7", color:"white"} },
        maskStyle: {
          backgroundColor: "'rgba(240, 240, 240, 0.8)",
          opacity: 0.2,
          backdropFilter: "blur(3px)",
        },
        cancelText: "Cancel",
        onOk: async () => {
          // Remove the selected event from the events array
          setEvents((prevEvents) =>
            prevEvents.filter((event) => event._id !== selectedEvent._def.extendedProps._id)
          );

          // Delete the event from the database
          await axios.delete(`/CalendarEvents/events/${selectedEvent._def.extendedProps._id}`);
        },
        onCancel() {
          setisEventClicked(false);
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleEventClick = (info) => {
    const event = info.event;
    const date = info.event.start
    setSelectedDate([{ key: "1", date: date.toISOString().split('T')[0], hours: 0 }]);
    setSelectedEventAttendance(null);
    setTitle('');
    setHours(0);
    setVisible(false);
    setReasonOfAbsence('-');
    setSelectedEvent(null);
    if (event._def.title === "Attendance Submitted") {
      setSelectedEventAttendance(event);
      setTitle(event._def.title);
      setHours(event._def.extendedProps.hours);
      if (event._def.extendedProps.isAttend) {
        setPresent(true);
        setVisible(false);
      } else {
        setPresent(false);
        setVisible(true);
        setReasonOfAbsence(event._def.extendedProps.reasonOfAbsence);
      }
      setIsSelectedEventAttendance(true);
    } else {
      if(user.userType !== "Employee")
      {
        if(event._def.extendedProps.userId === user._id)
        {
          // allow editing event
          setSelectedEvent(event);
          setTitle(event._def.title);
          setIsSelectedEvent(true);
        }
      }
    }
  };

  
  
  

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleShare = (e) => {
    if(e === "event Clicked")
    {
      setAddEventSuccessfully(true);
      handleEventOk();
    }
  }

  const handleEndDateChange = event => {
    const value = event.target.value;
    const today = new Date();
    const date = value ? new Date(value) : null;
    setEndDateShare(date);
    setEndDate(value ? [{
      key: "1",
      date: date.toISOString().split('T')[0],
      hours: 0
    }] :[{ key: "1",
    date: today.toISOString().split('T')[0],
    hours: 0}]);
  };

  const handleEventEdit = async() => {
    try {
      selectedEvent._def.title = title;
    setEvents((prevEvents) =>
    prevEvents.map((event) =>
      event.id === selectedEvent.id ? selectedEvent : event
    )
  );
      // Update the event in the database
    await axios.put(`/CalendarEvents/events/${selectedEvent._def.extendedProps._id}`, selectedEvent._def);
    setIsSelectedEvent(false);
  } catch (error) {
    console.log(error);
  }
  };
  

  const handleEventMouseEnter = (info) => {
    info.el.style.backgroundColor = 'white'; // change the background color
    info.el.style.color = 'white'; // change the background color
  };
  
  const handleEventMouseLeave = (info) => {
    
    info.el.style.backgroundColor = ''; // reset the background color
    info.el.style.color = ''; // change the background color

  };

  return (
    <>
      <Topbar />
      <div style={{ display: "flex"}} >

      <Sidebar />
      
        <div className="calendar-container" >
        <div className="calendarTitle">Calender</div>

          
        <div className="h3">add an event or update attendance</div>

          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            height="100%"
            dateClick={showModal}
            eventContent={(eventInfo) => (
              <div title={eventInfo.event.title} style={{ fontSize: '10px', whiteSpace: 'normal', wordWrap: 'break-word',backgroundColor:"#e49758c7" }}>
                {eventInfo.event.title}
              </div>
            )}
            editable={true}
      
            eventClick={handleEventClick}
            eventMouseEnter={handleEventMouseEnter}
          eventMouseLeave={handleEventMouseLeave}
          
/>

{isSelectedEvent && (
       <Modal
       maskStyle={{
        backgroundColor: isSelectedEvent ? 'rgba(0, 0, 0, 0.5)' : 'rgba(240, 240, 240, 0.8)',
        opacity: 0.9,
        backdropFilter: 'blur(3px)',
      }}
       title="Edit or Delete Event"
       open={isSelectedEvent}
       onCancel={handleCancel}
       footer={
         <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
           <Button style={{ backgroundColor:"#e49758c7", color:"white" }} onClick={handleCancel}>
             Cancel
           </Button>
           <Button style={{ backgroundColor:"#e49758c7", color:"white" }} onClick={handleEventEdit}>
             Ok
           </Button>
           <Button style={{ backgroundColor:"#e49758c7", color:"white" }} onClick={handleEventDelete}>
             Delete
           </Button>
         </div>
       }
     >
       <Form>
         <Form.Item label="Title">
           <Input onChange={handleTitleChange} value={title} />
         </Form.Item>
       </Form>
     </Modal>
      )}

        <Modal
         maskStyle={{
          backgroundColor: isSelectedEvent ? 'rgba(0, 0, 0, 0.5)' : 'rgba(240, 240, 240, 0.8)',
          opacity: 0.9,
          backdropFilter: 'blur(3px)',
        }}
          open={dateClicked}
          onCancel={() => setisDateClicked(false)}
          onOk={handleOkOption}
          okButtonProps={{ style: { backgroundColor: "#e49758c7",color: "white" } }}
          cancelButtonProps={{ style: { backgroundColor: "#e49758c7",color: "white" } }}
        >
          <div>Select an option:</div>
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value={null}>-- Select --</option>
            <option value="add-event">Add Event</option>
            <option value="update-attendance">Update Attendance</option>
            <option value="show employees attendances">Show employees</option>

          </select>
        </Modal>

        <Modal
        maskStyle={{
          backgroundColor: isSelectedEvent ? 'rgba(0, 0, 0, 0.5)' : 'rgba(240, 240, 240, 0.8)',
          opacity: 0.9,
          backdropFilter: 'blur(3px)',
        }}
      title="Add Event"
      open={isEventClicked}
      onCancel={handleCancel}
      footer={null}
      width={650}
      >
      <Form.Item label="Title">
      <Input onChange={handleTitleChange} value={title} />
      </Form.Item>
      <Form.Item label="End Date">
  <input type="date" onChange={handleEndDateChange} value={endDate?.date} defaultValue={selectedDate?.date} />
</Form.Item>
      <Share event={true} onShare={handleShare} startEventDate = {date} endEventDate= {endDateShare}/>
        
    </Modal>

    <Modal
    maskStyle={{
      backgroundColor: isSelectedEvent ? 'rgba(0, 0, 0, 0.5)' : 'rgba(240, 240, 240, 0.8)',
      opacity: 0.9,
      backdropFilter: 'blur(3px)',
    }}
        title="Event Added"
        open={addEventSuccessfully}
        onOk={() => setAddEventSuccessfully(false)}
        onCancel={() => setAddEventSuccessfully(false)}
        okButtonProps={{ style: { backgroundColor: "#e49758c7",color: "white" } }}
        cancelButtonProps={{ style: { backgroundColor: "#e49758c7",color: "white" } }}
      >
        <p>Your event has been added.</p>
      </Modal>

      <Modal
      maskStyle={{
        backgroundColor: isSelectedEvent ? 'rgba(0, 0, 0, 0.5)' : 'rgba(240, 240, 240, 0.8)',
        opacity: 0.9,
        backdropFilter: 'blur(3px)',
      }}
        title="Attendance confirmed!"
        open={addPresenceSuccessfully}
        onOk={() => setAddPresenceSuccessfully(false)}
        onCancel={() => setAddPresenceSuccessfully(false)}
        okButtonProps={{ style: { backgroundColor: "#e49758c7",color: "white" } }}
        cancelButtonProps={{ style: { backgroundColor: "#e49758c7",color: "white" } }}
      >
        <p>Attendance was successfully recorded!</p>
      </Modal>

      <Modal
      maskStyle={{
        backgroundColor: isSelectedEvent ? 'rgba(0, 0, 0, 0.5)' : 'rgba(240, 240, 240, 0.8)',
        opacity: 0.9,
        backdropFilter: 'blur(3px)',
      }}
        title="Presence error"
        open={presenceError}
        onOk={() => setPresenceError(false)}
        onCancel={() => setPresenceError(false)}
        okButtonProps={{ style: { backgroundColor: "#e49758c7",color: "white" } }}
        cancelButtonProps={{ style: { backgroundColor: "#e49758c7",color: "white" } }}
      >
        <p>Attendance cannot be added on this date!</p>
      </Modal>

          <Modal
          maskStyle={{
            backgroundColor: isSelectedEvent ? 'rgba(0, 0, 0, 0.5)' : 'rgba(240, 240, 240, 0.8)',
            opacity: 0.9,
            backdropFilter: 'blur(3px)',
          }}
            title="Update Attendance"
            open={(isAttendanceVisible || isSelectedEventAttendance)}
            onOk={handleOk}
            onCancel={handleCancel}
            okButtonProps={{ style: { backgroundColor: "#e49758c7",color: "white" } }}
          cancelButtonProps={{ style: { backgroundColor: "#e49758c7",color: "white" } }}
          >
            <Select
              value={present ? "Present": "Not Present"}
              style={{ width: 120, marginBottom: 16 }}
              onChange={handleSelectChange}
            >
              <Option value="present">Present</Option>
              <Option value="not present">Not Present</Option>
            </Select>
            {visible && (
              <Form.Item label="Reason" name="reason">
                <Select
                defaultValue={reasonOfAbsence}
                  style={{ width: 120, marginBottom: 16 }}
                  onChange={handleSelectChange}
                >
                  <Option value="sick">Sick</Option>
                  <Option value="vacation">Vacation</Option>
                  <Option value="personal">Personal</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            )}
            <Table
              columns={columns}
              dataSource={ selectedDate}
              pagination={false}
              size="small"
            />
          </Modal>
          
          
        </div>   
          <Rightbar />
      </div>
      
    </>
  )
}