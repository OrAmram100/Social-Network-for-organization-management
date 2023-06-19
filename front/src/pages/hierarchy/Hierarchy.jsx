import EmployeeHierarchy from "../../components/employeeHierarchy/EmployeeHierarchy";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./hierarchy.css"
import { useEffect, useState } from "react";
import axios from "axios";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Rightbar from "../../components/rightbar/Rightbar";
export default function Hierarchy()
{

    const [departments, setDepartments] = useState([]);
    const {user:currentUser} = useContext(AuthContext);
    const {organization} = useContext(AuthContext);

    useEffect(()=>{
        const getDepartments = async () =>{
          try{
            const departmentsList = await axios.get(`/departments/${organization._id}/all`)
            setDepartments(departmentsList.data);
          }
          catch(err){
            console.log(err);
          }
        };
        getDepartments();
      },[])

    return (
      <>
       <Topbar/>
       <br></br>
       <div style={{ display: "flex"}} >
      <Sidebar />
      
        <div className="employeeHierarchy">
        <h1>{organization.organizationName} Hierarchy</h1>
        { ((departments?.length !== 0 && departments !== null) || organization.CEO) &&
        <EmployeeHierarchy departments={departments} />
        }
       
        
      </div>
      <Rightbar/>
      </div>
      </>
    );
  }
  