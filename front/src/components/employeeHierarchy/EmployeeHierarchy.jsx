import { Tree, TreeNode } from 'react-organizational-chart';
import styled from 'styled-components';
import axios from "axios";
import { Link } from "react-router-dom";
import EmployeePopup from '../EmployeePopup';
import React, { useState, useEffect } from 'react';
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const StyledNode = styled.div`
  padding: 5px;
  border-radius: 8px;
  display: inline-block;
  border: 1px solid black;
  text-align: center;
  color:#e49758c7
  position: relative;

`;
const PF = process.env.REACT_APP_PUBLIC_FOLDER;


function EmployeeNode({ employee }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [showPopup, setShowPopup] = useState(false);

  return (
    <TreeNode label={
      <StyledNode
        onClick={() => setShowPopup(true)}
        onMouseLeave={() => setShowPopup(false)}
      >
        {employee.firstName} {employee.lastName}<Link to={`/profile/${employee.firstName}`}>
          <div className='profileFrame'>
            <img 
              className="postProfileImg" 
              src={ employee.profilePicture ? PF + employee.profilePicture : PF+"person/noAvatar.png"}
              alt =""
            />
          </div>
        </Link>
        {showPopup && <EmployeePopup employee={employee} />}
      </StyledNode>
      
    }>
    </TreeNode>
  );
}

function DepartmentNode({ department }) {
  const [manager, setManager] = useState({});
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showManagerPopup, setShowManagerPopup] = useState(false); // new state variable
  const [showPopup, setShowPopup] = useState(false);


  useEffect(() => {
    // Fetch manager of the department
    axios.get(`/departments/${department._id}/manager`)
      .then(res => {
        setManager(res.data);
      })
      .catch(err => {
        console.log(err);
      });

    // Fetch team leaders in the department
    axios.get(`/departments/${department._id}/team-managers`)
      .then(res => {
        setTeamLeaders(res.data);
      })
      .catch(err => {
        console.log(err);
      });

    // Fetch teams in the department
    axios.get(`/departments/${department._id}/teams`)
      .then(res => {
        setTeams(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, [department]);

  return (
    <TreeNode label={
      <StyledNode
        onClick={() => setShowManagerPopup(true)} // show manager popup on mouse enter
        onMouseLeave={() => setShowManagerPopup(false)} // hide manager popup on mouse leave
      >
        {department.departmentName} :
        <br />
        Department Manager: {manager.firstName} {manager.lastName}
        <Link to={`/profile/${manager.firstName}`}>
              <div className='profileFrame'>
                <img 
                  className="postProfileImg" 
                  src={ manager.profilePicture ? PF + manager.profilePicture : PF+"person/noAvatar.png"}
                  alt =""
                />
              </div>
            </Link>
        {showManagerPopup && <EmployeePopup employee={manager} />} 
      </StyledNode>
    }>
      {teamLeaders.map(teamLeader => (
        <TreeNode label={
          <StyledNode
          onClick={() => setShowPopup(true)}
            onMouseLeave={() => setShowPopup(false)}
          >
              Team Leader:
              <br />
            {teamLeader.firstName} {teamLeader.lastName}<Link to={`/profile/${teamLeader.firstName}`}>
              <div className='profileFrame'>
                <img 
                  className="postProfileImg" 
                  src={ teamLeader.profilePicture ? PF + teamLeader.profilePicture : PF+"person/noAvatar.png"}
                  alt =""
                />
              </div>
            </Link>
            {showPopup && <EmployeePopup employee={teamLeader} />} 
          </StyledNode>
        }>
          {teams.filter(team => team.teamManager._id === teamLeader._id)
            .map(team => (
              <TreeNode label={
                <StyledNode>
                  Team: {team.teamName}
                </StyledNode>
              }>
                {team.users.map(employee => (
                  <EmployeeNode key={employee.id} employee={employee} />
                ))}
              </TreeNode>
          ))}
        </TreeNode>
      ))}
    </TreeNode>
  );
}

function EmployeeHierarchy({departments }) {
  const {organization,user} = useContext(AuthContext);
  const [showCEOPopup, setShowCEOPopup] = useState(false);


  return (
    <Tree
      lineWidth={'2px'}
      lineColor={'black'}
      lineBorderRadius={'10px'}
      label={<StyledNode onClick={() => setShowCEOPopup(true)}
      onMouseLeave={() => setShowCEOPopup(false)}>CEO:
        <br />
      {organization.CEO.firstName} {organization.CEO.lastName}<Link to={`/profile/${organization.CEO.firstName}`}>
        <div className='profileFrame'>
          <img 
            className="postProfileImg" 
            src={ organization.CEO.profilePicture ? PF + organization.CEO.profilePicture : PF+"person/noAvatar.png"}
            alt =""
          />
        </div>
      </Link>
      {showCEOPopup && <EmployeePopup employee={organization.CEO} />} 
    </StyledNode>}
    >
      {departments.map(department => (
        <DepartmentNode key={department.id} department={department} />
      ))}
    </Tree>
  );
}

export default EmployeeHierarchy
