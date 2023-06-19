import "./addEmployee.css"
import {useRef} from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import Topbar from "../../components/topbar/Topbar";
import { useState } from 'react';
import Select from 'react-select'
import { Modal, useMantineTheme } from "@mantine/core";



export default function AddEmployee() {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER;
	const workStartDate = useRef();
	const theme = useMantineTheme();
    const firstName = useRef();
    const lastName = useRef();
	const role = useRef();
    const email = useRef();
	const teamName = useRef();
    const password = useRef();
    const passwordAgain = useRef();
    const navigate = useNavigate();
    const {user:currentUser} = useContext(AuthContext);
	const {organization} = useContext(AuthContext);
	const {dispatch} = useContext(AuthContext);

    //const organization = user.organization;
    const [country, setCountry] = useState('');
	const [department, setDepartment] = useState('');
	const [isManager, setIsManager] = useState(null);
	const [isAlertPopupOpen, setIsAlertPopupOpen] = useState(null);
	const [isDepartmentAlertPopupOpen, setIsDepartmentAlertPopupOpen] = useState(null);
	const [addEmpByManagerAlert, setAddEmpByManagerAlert] = useState(null);
	const [addEmpAlert, setAddEmpAlert] = useState(null);

	

	const [fetchDepartment, setFetchDepartment] = useState(null);



	const departmentList = [
		"Research and Development (R&D)",
		"Artificial Intelligence or Machine Learning (AI or ML)",
		"User Interface or User Experience (UI or UX)",
		"Quality Assurance (QA)",
		"Cybersecurity",
		"Development Operations (DevOps)",
		"Cloud Computing",
		"Big Data Analytics",
		"Internet of Things (IoT)",
		"Robotics",
		"Blockchain",
		"Augmented Reality or Virtual Reality (AR or VR)",
		"Mobile Development",
		"Gaming",
		"3D Printing",
		"Bioinformatics",
		"Nanotechnology",
		"Quantum Computing",
		"Aerospace Engineering",
		"Automotive Engineering",
		"Management",
	    "Marketing"
	  ];
    const countryList = [
	"Afghanistan",
	"Albania",
	"Algeria",
	"American Samoa",
	"Andorra",
	"Angola",
	"Anguilla",
	"Antarctica",
	"Antigua and Barbuda",
	"Argentina",
	"Armenia",
	"Aruba",
	"Australia",
	"Austria",
	"Azerbaijan",
	"Bahamas (the)",
	"Bahrain",
	"Bangladesh",
	"Barbados",
	"Belarus",
	"Belgium",
	"Belize",
	"Benin",
	"Bermuda",
	"Bhutan",
	"Bolivia (Plurinational State of)",
	"Bonaire, Sint Eustatius and Saba",
	"Bosnia and Herzegovina",
	"Botswana",
	"Bouvet Island",
	"Brazil",
	"British Indian Ocean Territory (the)",
	"Brunei Darussalam",
	"Bulgaria",
	"Burkina Faso",
	"Burundi",
	"Cabo Verde",
	"Cambodia",
	"Cameroon",
	"Canada",
	"Cayman Islands (the)",
	"Central African Republic (the)",
	"Chad",
	"Chile",
	"China",
	"Christmas Island",
	"Cocos (Keeling) Islands (the)",
	"Colombia",
	"Comoros (the)",
	"Congo (the Democratic Republic of the)",
	"Congo (the)",
	"Cook Islands (the)",
	"Costa Rica",
	"Croatia",
	"Cuba",
	"Curaçao",
	"Cyprus",
	"Czechia",
	"Côte d'Ivoire",
	"Denmark",
	"Djibouti",
	"Dominica",
	"Dominican Republic (the)",
	"Ecuador",
	"Egypt",
	"El Salvador",
	"Equatorial Guinea",
	"Eritrea",
	"Estonia",
	"Eswatini",
	"Ethiopia",
	"Falkland Islands (the) [Malvinas]",
	"Faroe Islands (the)",
	"Fiji",
	"Finland",
	"France",
	"French Guiana",
	"French Polynesia",
	"French Southern Territories (the)",
	"Gabon",
	"Gambia (the)",
	"Georgia",
	"Germany",
	"Ghana",
	"Gibraltar",
	"Greece",
	"Greenland",
	"Grenada",
	"Guadeloupe",
	"Guam",
	"Guatemala",
	"Guernsey",
	"Guinea",
	"Guinea-Bissau",
	"Guyana",
	"Haiti",
	"Heard Island and McDonald Islands",
	"Holy See (the)",
	"Honduras",
	"Hong Kong",
	"Hungary",
	"Iceland",
	"India",
	"Indonesia",
	"Iran (Islamic Republic of)",
	"Iraq",
	"Ireland",
	"Isle of Man",
	"Israel",
	"Italy",
	"Jamaica",
	"Japan",
	"Jersey",
	"Jordan",
	"Kazakhstan",
	"Kenya",
	"Kiribati",
	"Korea (the Democratic People's Republic of)",
	"Korea (the Republic of)",
	"Kuwait",
	"Kyrgyzstan",
	"Lao People's Democratic Republic (the)",
	"Latvia",
	"Lebanon",
	"Lesotho",
	"Liberia",
	"Libya",
	"Liechtenstein",
	"Lithuania",
	"Luxembourg",
	"Macao",
	"Madagascar",
	"Malawi",
	"Malaysia",
	"Maldives",
	"Mali",
	"Malta",
	"Marshall Islands (the)",
	"Martinique",
	"Mauritania",
	"Mauritius",
	"Mayotte",
	"Mexico",
	"Micronesia (Federated States of)",
	"Moldova (the Republic of)",
	"Monaco",
	"Mongolia",
	"Montenegro",
	"Montserrat",
	"Morocco",
	"Mozambique",
	"Myanmar",
	"Namibia",
	"Nauru",
	"Nepal",
	"Netherlands (the)",
	"New Caledonia",
	"New Zealand",
	"Nicaragua",
	"Niger (the)",
	"Nigeria",
	"Niue",
	"Norfolk Island",
	"Northern Mariana Islands (the)",
	"Norway",
	"Oman",
	"Pakistan",
	"Palau",
	"Palestine, State of",
	"Panama",
	"Papua New Guinea",
	"Paraguay",
	"Peru",
	"Philippines (the)",
	"Pitcairn",
	"Poland",
	"Portugal",
	"Puerto Rico",
	"Qatar",
	"Republic of North Macedonia",
	"Romania",
	"Russian Federation (the)",
	"Rwanda",
	"Réunion",
	"Saint Barthélemy",
	"Saint Helena, Ascension and Tristan da Cunha",
	"Saint Kitts and Nevis",
	"Saint Lucia",
	"Saint Martin (French part)",
	"Saint Pierre and Miquelon",
	"Saint Vincent and the Grenadines",
	"Samoa",
	"San Marino",
	"Sao Tome and Principe",
	"Saudi Arabia",
	"Senegal",
	"Serbia",
	"Seychelles",
	"Sierra Leone",
	"Singapore",
	"Sint Maarten (Dutch part)",
	"Slovakia",
	"Slovenia",
	"Solomon Islands",
	"Somalia",
	"South Africa",
	"South Georgia and the South Sandwich Islands",
	"South Sudan",
	"Spain",
	"Sri Lanka",
	"Sudan (the)",
	"Suriname",
	"Svalbard and Jan Mayen",
	"Sweden",
	"Switzerland",
	"Syrian Arab Republic",
	"Taiwan",
	"Tajikistan",
	"Tanzania, United Republic of",
	"Thailand",
	"Timor-Leste",
	"Togo",
	"Tokelau",
	"Tonga",
	"Trinidad and Tobago",
	"Tunisia",
	"Turkey",
	"Turkmenistan",
	"Turks and Caicos Islands (the)",
	"Tuvalu",
	"Uganda",
	"Ukraine",
	"United Arab Emirates (the)",
	"United Kingdom of Great Britain and Northern Ireland (the)",
	"United States Minor Outlying Islands (the)",
	"United States of America (the)",
	"Uruguay",
	"Uzbekistan",
	"Vanuatu",
	"Venezuela (Bolivarian Republic of)",
	"Viet Nam",
	"Virgin Islands (British)",
	"Virgin Islands (U.S.)",
	"Wallis and Futuna",
	"Western Sahara",
	"Yemen",
	"Zambia",
	"Zimbabwe",
	"Åland Islands"
];

const typeOptions = [
    { value: 'manager', label: 'Manager' },
    { value: 'employee', label: 'Employee' },
  ]


  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

    const clearValidationMessage = (inputRef) => {
        inputRef.current.setCustomValidity("");
    };

	const handleDepartmentChange = (event) => {
		setDepartment(event.value);
	  };
	

    useEffect(() => {
        firstName.current.addEventListener("input", () => clearValidationMessage(firstName));
        lastName.current.addEventListener("input", () => clearValidationMessage(lastName));
        password.current.addEventListener("input", () => clearValidationMessage(password));
        passwordAgain.current.addEventListener("input", () => clearValidationMessage(passwordAgain));
    }, []);

	useEffect(() => {

		const getDepartment = async()=>{
			const currentDepartment =  await axios.get(`/departments/${department}/${organization._id}/byName`);
			setFetchDepartment(currentDepartment.data);
		}
		if(department !== "")
			getDepartment()
        
    }, [department]);


    const handleClick = async (e)=> {
        e.preventDefault();
        if(currentUser.userType === "Admin" || currentUser.userType === "Manager" || currentUser.userType === "CEO")
        {
            const firstNameValue = firstName.current.value.trim();
            const lastNameValue = lastName.current.value.trim();
            if(!/^[A-Z]/.test(firstNameValue)) {
                firstName.current.setCustomValidity("First name should start with a capital letter");
            } else {
                firstName.current.setCustomValidity("");
            }
            if(!/^[A-Z]/.test(lastNameValue)) {
                lastName.current.setCustomValidity("Last name should start with a capital letter");
            } else {
                lastName.current.setCustomValidity("");
            }
    
            if(passwordAgain.current.value !== password.current.value){
                passwordAgain.current.setCustomValidity("Passwords don't match!");
            } else {
                passwordAgain.current.setCustomValidity("");
            }
    
            // Check the validity of the input fields again before submitting the form
            if(firstName.current.checkValidity() && lastName.current.checkValidity() && passwordAgain.current.checkValidity()) {
                const user = {
                    firstName: firstName.current.value,
                    lastName: lastName.current.value,
                    email: email.current.value,
					role: role.current.value,
                    password: password.current.value,
                    from: country,
					department: department,
					workStartDate: workStartDate.current.value 
                }
			if(isManager)
			{
				if(isManager.value === "manager")
				{
					user.userType = "Manager";
				}
				else if(isManager.value === "employee")
				{
					user.userType = "Employee";
				}
			}
                try{                    
					if(currentUser.userType === "CEO")
					{
						const departmentRes = await axios.post(`/departments/${organization._id}`,user);
						if(departmentRes.data.message === "Department already exists")
						{
							setIsDepartmentAlertPopupOpen(true);
							return;
						}
						else if(departmentRes.data.message === "User already exists")
						{
							setIsAlertPopupOpen(true);
							return;
						}
						dispatch({type:"UPDATED_ORGANIZATION_USERS",payload: user});

					}
					else if(currentUser.userType === "Manager" && user.userType === "Manager"
					&& currentUser.email === fetchDepartment.departmentManager.email) // it means this is department manager
					{//add team manager
						user.teamName = teamName.current.value;
						const departmentRes = await axios.post(`/departments/${fetchDepartment._id}/teams`,user);
						if(departmentRes.data.message === "User already exists")
						{
							setIsAlertPopupOpen(true);
							return;						
						}
					}
					else if(currentUser.userType === "Manager" && user.userType === "Employee") // it means this is team manager
					{//add team member
						user.teamName = teamName.current.value;
						let validOperation = false;
						for(let i=0; i< fetchDepartment.teams.length; i++)
						{
							if(fetchDepartment.teams[i].teamName === teamName.current.value && fetchDepartment.teams[i].teamManager.email === currentUser.email) //the team who we want to add the user
							{
								validOperation = true;
								const departmentRes = await axios.post(`/departments/${fetchDepartment._id}/teams/${fetchDepartment.teams[i]._id}/users`,user);
								if(departmentRes.data.message === "User already exists")
								{
									setAddEmpAlert(true);
									return;						
								}
							}
						}
						if(!validOperation)
						{
							setAddEmpByManagerAlert(true);
							return;
						}
					}

                navigate("/login");
                }catch(err) {
                    console.log(err);
                }
            }
        }
    }
    
    // Add this code to remove the event listener before the component is unmounted
    useEffect(() => {
        return () => {
            if(firstName.current) {
                firstName.current.removeEventListener("input", () => {
                    firstName.current.setCustomValidity("");
                });
            }
            if(lastName.current) {
                lastName.current.removeEventListener("input", () => {
                    lastName.current.setCustomValidity("");
                });
            }
            if(passwordAgain.current) {
                passwordAgain.current.removeEventListener("input", () => {
                    passwordAgain.current.setCustomValidity("");
                });
            }
        }
    }, []);

	const departmentOptions = departmentList.map((department) => ({
		value: department,
		label: department,
	  }));
	      

  return (
    <>
    <Topbar/>
    <div className="login">
        <div className="loginWrapper">
            <div className="loginLeft">
			<img className="orgaImg" src={PF + organization?.organizationPicture} alt="" />
                <span className="addEmployeeDesc">
				Connect with colleagues and the work <br/> community  around you on {organization.organizationName}.
                </span>
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
					 opened={isAlertPopupOpen} onClose={() => setIsAlertPopupOpen(false)}
				>
						<h2> manager already exists! </h2>
						<div className="buttonsModalFrame">
						<button className="modalOkButton" onClick={()=> setIsAlertPopupOpen(false)}>Ok</button>
						</div>
					  </Modal>

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
					 opened={addEmpAlert} onClose={() => setAddEmpAlert(false)}
				>
						<h2> Employee already exists! </h2>
						<div className="buttonsModalFrame">
						<button className="modalOkButton" onClick={()=> setAddEmpAlert(false)}>Ok</button>
						</div>
					  </Modal>

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
					 opened={isDepartmentAlertPopupOpen} onClose={() => setIsDepartmentAlertPopupOpen(false)}
				>
						<h2>Department already exists! </h2>
						<div className="buttonsModalFrame">
						<button className="modalOkButton" onClick={()=> setIsDepartmentAlertPopupOpen(false)}>Ok</button>
						</div>
					  </Modal>	

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
					 opened={addEmpByManagerAlert} onClose={() => setAddEmpByManagerAlert(false)}
				>
						<h2>You can add employees only to your department! </h2>
						<div className="buttonsModalFrame">
						<button className="modalOkButton" onClick={()=> setAddEmpByManagerAlert(false)}>Ok</button>
						</div>
					  </Modal>	  	  
            <div className="loginRight">
                <form className="addEmployeeBox" onSubmit={handleClick} autoComplete="off">
				<div className="inputWrapper">
			<label htmlFor="workStartDate">Work Start Date:</label>
			<input 
				id="workStartDate" 
				required 
				ref={workStartDate} 
				className="loginInput" 
				type="date" 
			/>
			</div>            
			<Select placeholder="User type"
              defaultValue={isManager}
              onChange={setIsManager}
              options={typeOptions}
            />
			<Select  placeholder="Choose department" required onChange={handleDepartmentChange} options={departmentOptions}
					/>
					{currentUser.userType === "Manager" &&
					<input placeholder="Team name" required ref= {teamName} className="loginInput" />
					}
					{(currentUser.userType === "Manager" || currentUser.userType === "CEO") &&
					<input placeholder="Role" required ref= {role} className="loginInput" />
					}
                    <input placeholder="First Name" required ref= {firstName} className="loginInput" />
                    <input placeholder="Last Name" required ref= {lastName} className="loginInput" />
                    <input placeholder="Email" required ref= {email}  className="loginInput" type ="email" />
                    <input placeholder="Password" required ref= {password} className="loginInput" type ="password" minLength="6" />
                    <input placeholder="Password Again" required ref= {passwordAgain}  className="loginInput" type ="password" />
        <select name="country" value={country} onChange={handleCountryChange} required>
        <option value="">Select a country</option>
        {countryList.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
        </select>
                    <button className="loginButton" type= "submit"> Add Employee</button>
                </form>
                
            </div>
        </div>   
    </div>
    </>
  )
}
