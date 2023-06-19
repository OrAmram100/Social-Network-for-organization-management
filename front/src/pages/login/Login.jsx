import "./login.css"
import {useEffect, useRef} from "react";
import { loginCall } from "../../apiCalls";
import { useContext } from "react";
import {AuthContext} from "../../context/AuthContext"
import {CircularProgress} from "@material-ui/core"
import { useNavigate } from "react-router-dom";
import {Link} from "react-router-dom"
import Topbar from "../../components/topbar/Topbar";
import { useState } from "react";
import axios from "axios";
import { Modal } from "antd";


export default function Login() {
    const navigate = useNavigate();
    const email = useRef();
    const password = useRef();
    const {user, isFetching, error, dispatch} = useContext(AuthContext);
    const [organizations, setOrganizations] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState("");
    const [errorModalOpen, setErrorModalOpen] = useState(false);


    useEffect(() => {
        const getAllOrganizations = async() =>{
          const response = await axios.get('/organizations/all/organizations');
          const organizations = response.data;
          setOrganizations(organizations);
        }
        getAllOrganizations();
      }, []);

      const handleLoginError = () => {
        setErrorModalOpen(true);
      };


    const handleClick = (e)=> {
        try
        {
            e.preventDefault();
            loginCall({email: email.current.value,password : password.current.value, organizationId: selectedOrg},
                dispatch,setErrorModalOpen
            );
        }
        catch(err)
        {
            handleLoginError();
        }
    }

    const  handleOrgChange = (event) =>{
        setSelectedOrg(event.target.value);
      }

      

  return (
    <>
    <Topbar/>
    <div className="login">
        <div className="loginWrapper">
            <div className="loginLeft">
                <h3 className="loginLogo">WorkUP</h3>
                <span className="loginDesc">
                    Connect with friends and the world <br/> around you on WorkUP!
                </span>
            </div>
            <div className="loginRight">
                <form className="loginBox" onSubmit={handleClick}autoComplete="off">
                <select required value={selectedOrg} onChange={handleOrgChange}>
                <option value="">Select an organization</option>
                {organizations?.map((org) => (
                    <option key={org._id} value={org._id}>
                    {org.organizationName}
                    </option>
                ))}
                </select >
                    <input placeholder="Email" type= "email"  required className="loginInput" ref ={email} />
                    <input placeholder="Password" type= "password"  required minLength="6" className="loginInput" ref= {password} />
                    <button className="loginBtn" type ="submit" disabled= {isFetching} >{isFetching ? <CircularProgress color="white" size = "20px" /> : "Log In"} </button>
                    <Modal
                    title="Error"
                    open={errorModalOpen}
                    onOk={() => setErrorModalOpen(false)}
                    onCancel={() => setErrorModalOpen(false)}
                    okButtonProps={{ style: { backgroundColor: "#e49758c7",color:"white"} }}
                    cancelButtonProps={{ style: { backgroundColor: "#e49758c7",color:"white" } }}
                    >
                
                    <p>One of the details is wrong.</p>
                </Modal>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                    <Link to={"/signup"} style={{ textDecoration: "none", color: "black" }}>
                        <span className="signUpOrganization">Sign up organization</span>
                    </Link>
                    </div>
                </form>
                
            </div>

        </div>
      
    </div>
    <div className="loginBottom">
	<span className="logincredits">Designed by Roni Khizverg and Or Amram</span>
	</div>
    </>
  )
}
