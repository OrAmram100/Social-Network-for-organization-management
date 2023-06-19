
import {React} from 'react';
import './paymentSuccess.css';
import {Link} from "react-router-dom"
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import { useState } from 'react';
import {  useEffect } from "react";

function PaymentSuccess() {

  const [user,setUser] = useState('');
  const [organization,setOrganization] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userPromise = axios.get("/localStorageAdminUser");
    const organizationPromise = axios.get("/localStorageOrganization");

    userPromise.then(res => setUser(res.data));
    organizationPromise.then(res => setOrganization(res.data))
}, []);


  const handleFormSubmit = async (event) => {
    event.preventDefault();
        
    const organizationRes = await axios.post("/organizations",organization);
   const userRes = await axios.post(`/auth/${organizationRes.data._id}/register`,user);
  
    // Navigate to localhost:3000
  window.location.href = 'http://localhost:3000';




  };

  return (
    <div className="payment-success">
      <h1>Payment Successful!</h1>
      <p>Thank you for your purchase.</p>
      <form onSubmit={handleFormSubmit}>
        <button className='signUpButton' type="submit">Login page</button>
      </form>
    </div>
  );
}

export default PaymentSuccess;