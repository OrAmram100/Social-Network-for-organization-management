import { Modal, useMantineTheme } from "@mantine/core";
import Select from 'react-select'
import {useRef} from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {Delete} from "@material-ui/icons"
import {Undo} from "@material-ui/icons"



import "./profileModal.css"
import { useState } from "react";
export default function  ProfileModal({ modalOpened, setModalOpened }) {
  var passwordIssue = false;
  const {user, dispatch} = useContext(AuthContext);
  const theme = useMantineTheme();
  const firstName = useRef();
  const lastName = useRef();
  const city = useRef();
  const [country, setCountry] = useState(null);
  const password = useRef(null);
  const passwordAgain = useRef(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const role = useRef();
  const desc = useRef();
  //const relationship = useRef();
  const birthdayDate = useRef();
  const [userType, setUserType] = useState(null);
  const [relationship, setRelationship] = useState(null);
  const [clickedCoverPicDelete,setClickedCoverPicDelete] = useState(false);
  const [clickedProfilePicDelete,setClickedProfilePicDelete] = useState(false);
  const {organization} = useContext(AuthContext);


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

  
  const navigate = useNavigate();

  

  const [profilefile,setProfileFile] = useState(null);
  const [coverfile,setcoverfile] = useState(null);

 

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  const typeOptions = [
    { value: 'manager', label: 'Manager' },
    { value: 'employee', label: 'Employee' },
    { value: 'admin', label: 'Admin' },

  ]
  const relationshipOptions = [
    { value: 'Single', label: 'Single' },
    { value: 'Married', label: 'Married' },
    { value: '-', label: '-' },

  ]




  const handleSubmit = async (e)=> {
    e.preventDefault();
    passwordIssue = false; 
    if(password.current.value || passwordAgain.current.value)
    {
      if(password.current.value && passwordAgain.current.value)
      {
        if(passwordAgain.current.value !== password.current.value)
        {
          passwordIssue = true;
          alert("Passwords don't match!");
        }
        else
        {
          passwordIssue = false;
        }       
      }
      else 
      {
        alert("Fill the 2 password fields!")
        passwordIssue = true;
      }
    }

    if(passwordIssue)
        return;
  
    if(clickedCoverPicDelete)
    {
      user.coverPicture ="";
    }
    else if(clickedProfilePicDelete)
    {
      user.profilePicture="";
    }
      const updateUser = {
        firstName: firstName.current.value?firstName.current.value:user.firstName,
        lastName: lastName.current.value?lastName.current.value:user.lastName,
        userId: user._id,
        city: city.current.value?city.current.value:user.city,
        from: country?country:user.from,
        password: password.current.value?password.current.value:user.password,
        role: role.current.value?role.current.value: user.role,
        desc: desc.current.value?desc.current.value:user.desc,
        birthdayDate: birthdayDate.current.value?birthdayDate.current.value:user.birthdayDate,
        relationship: relationship?relationship.value: user.relationship,
      };

      if(userType)
      {
        if(userType.value === "manager")
        {
          updateUser.userType = "Manager";
        }
        else if(userType.value === "employee")
        {
          updateUser.userType = "Employee";
        }
        else if(userType.value === "admin")
        {
          updateUser.userType = "Admin";
        }
      }
      else
        updateUser.userType = user.userType

      if (coverfile){
        const data = new FormData();
        const filename = Date.now() + coverfile.name;
        data.append("name",filename);
        data.append("file",coverfile);
        updateUser.coverPicture = filename;
        try{
            await axios.post("/upload", data)
        }catch(err){
            console.log(err);
        }
    }
    else
      updateUser.coverPicture = user.coverPicture;

    
      if (profilefile){
        const data = new FormData();
        const filename = Date.now() + profilefile.name;
        data.append("name",filename);
        data.append("file",profilefile);
        updateUser.profilePicture = filename;
        try{
            await axios.post("/upload", data)
        }catch(err){
            console.log(err);
        }
    }
    else
      updateUser.profilePicture = user.profilePicture;

      
      try{
        await axios.put(`/users/${organization._id}/` + user._id,updateUser);
        if(user.userType === "CEO")
            dispatch({type:"UPDATED_ORGANIZATION_CEO",payload: updateUser});
        dispatch({type:"UPDATED_USER",payload: updateUser});
        navigate("/profile/" +updateUser.firstName);
        window.location.reload();


      }catch(err) {
          console.log(err);
      }
      
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
      size="60%"
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
    >
      <div className="profileModalContainer">
        <form
          className="infoForm"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          <h2>Your info</h2>
          <br />
  
          <div>
            <input
              type="text"
              ref={firstName}
              className="infoInput"
              name="FirstName"
              placeholder="First Name"
              defaultValue={user.firstName}
              autoComplete="off"
            />
            <input
              type="text"
              ref={lastName}
              className="lastNameInput"
              name="LastName"
              placeholder="Last Name"
              defaultValue={user.lastName}
              autoComplete="off"
            />
          </div>
  
          <div autoComplete="off">
            <input
              type="text"
              ref={city}
              className="infoInput"
              name="City"
              placeholder="City"
              autoComplete="no-random-value"
              defaultValue={user.city}
            />
            <select className="selectCountry" name="country" value={country} onChange={handleCountryChange} >
        <option value="">{user.from}</option>
        {countryList.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
          </select>

          </div>
  
          <div>
            <input
              type="password"
              minLength="6"
              ref={password}
              className="infoInput"
              name="password"
              placeholder="password"
            />
  
            <input
              type="password"
              ref={passwordAgain}
              className="confirmPasswordsInput"
              name="ConfirmPassword"
              placeholder="Confirm password"
            />
          </div>
  
          <div>
            <input
              type="text"
              ref={role}
              className="infoInput"
              name="role"
              defaultValue={user.role}
              placeholder="Role"
            />
          </div>
  
          <div>
            <input
              type="text"
              ref={desc}
              className="infoInput"
              name="desc"
              defaultValue={user.desc}
              placeholder="Description on profile"
            />
          </div>
  
          <div>
            <span>Relationship:</span>
            <Select
              className="optionSelects"
              placeholder={user.relationship}
              onChange={setRelationship}
              options={relationshipOptions}
            />
          </div>
  
          <div>
            <span>birthday date:</span>
            <br />
            <input
              type="date"
              ref={birthdayDate}
              className="infoInput"
              name="Birthday"
              placeholder="BirthdayDate"
              defaultValue={user.birthdayDate}
            />
          </div>
  
          <div>  
            <span>User type:</span>
            <Select
              className="optionSelects"
              placeholder={user.userType}
              onChange={setUserType}
              options={typeOptions}
            />
          </div>
  
          <div>
            Profile Image <span />
            <input
              type="file"
              id="ProfileFile"
              accept=".png,.jpeg,.jpg"
              name="profileImg"
              onChange={(e) => setProfileFile(e.target.files[0])}
            />
             

            <br />
            
            {user.profilePicture &&(
            <div className="profile-picture">
            <img className="editProfileImg" src={user.profilePicture && !clickedProfilePicDelete ? PF + user.profilePicture : PF + "person/noAvatar.png"} alt="Profile Picture"/>
            <div className="deleteFrame" onClick={()=> setClickedProfilePicDelete(!clickedProfilePicDelete)}>
              {!clickedProfilePicDelete &&(
                <>
            <Delete className="delete-button" />
            <span className="deleteText">Delete</span>
            </>
              )}
              {clickedProfilePicDelete &&(
                <>
            <Undo className="delete-button" />
            <span className="deleteText">Undo</span>
            </>
              )}
            </div>
          </div>
          )}
            <br />
            Cover Image <span />
            <input
              type="file"
              id="CoverFile"
              accept=".png,.jpeg,.jpg"
              name="coverImg"
              onChange={(e) => setcoverfile(e.target.files[0])}
            />
          </div>


         {user.coverPicture &&(
          <div className="cover-photo">
          <img className="editProfileImg" src={user.coverPicture ? PF + user.coverPicture : PF + "person/noAvatar.png"} alt="Profile Picture"/>
          <div className="deleteFrame" onClick={()=> setClickedCoverPicDelete(!clickedCoverPicDelete)}>
          {!clickedCoverPicDelete &&(
                <>
            <Delete className="delete-button" />
            <span className="deleteText">Delete</span>
            </>
              )}
              {clickedCoverPicDelete &&(
                <>
            <Undo className="delete-button" />
            <span className="deleteText">Undo</span>
            </>
              )}
          </div>
          </div>
          )}
  
          <button className="infoButton">Update</button>
  
      </form>
      </div>

    </Modal>
  );
}