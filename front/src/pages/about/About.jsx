import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./about.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";

export default function About() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const {organization} = useContext(AuthContext);

  return (
    <>
      <Topbar />
      <Sidebar />

      <div className="about" >
        <h1>About {organization.organizationName}</h1>
        <img className="companyImg" src={PF + organization?.organizationPicture} alt="" />
          <p className="aboutText">{organization.desc}.</p>
          <div className="organizationDetails">
          <p>Establishment Date: {new Date(organization.establishmentDate).toLocaleDateString('en-GB')}</p>
          <p>CEO: {organization.CEO?.firstName} {organization.CEO?.lastName}</p>
          <p>Number of Employees: {organization.NumOfEmployees}</p>
        </div>
          <div className="credits">Designed by Roni Khizverg and Or Amram</div>
        </div>
    </>
  );
}
