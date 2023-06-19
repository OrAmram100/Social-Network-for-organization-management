import React from 'react';
import styled from 'styled-components';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Popup = styled.div`
  position: relative;
  top: calc(100% + 5px);
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  background-color: white;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  padding: 10px;
`;

const EmployeePopup = ({ employee }) => {
  const {organization} = useContext(AuthContext);
  
  return (
    <Popup>
      <p> Name: {employee.firstName} {employee.lastName}</p>
      <p> Organization: {organization.organizationName}</p>
      <p> Birthday: {new Date(employee.birthdayDate).toLocaleDateString('en-GB')}</p>
      <p> Role: {employee?.role}</p>


    </Popup>
  );
};

export default EmployeePopup;