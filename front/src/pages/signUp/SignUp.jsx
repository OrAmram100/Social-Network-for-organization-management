import "./signUp.css"
import {useRef} from "react";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import {  useEffect } from "react";
import { useState } from 'react';
import { Cancel } from "@material-ui/icons"
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Topbar from "../../components/topbar/Topbar";
import {Link} from "react-router-dom"

export default function SignUp() {
	const establishmentDate = useRef();
	const organizationName = useRef();
	const organizationDesc = useRef();
	const numOfEmployees = useRef();
    const password = useRef();
    const passwordAgain = useRef();
    const navigate = useNavigate();
    const [country, setCountry] = useState('');
	const [file,setFile] = useState(null);
	const {user} = useContext(AuthContext);

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

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

    const clearValidationMessage = (inputRef) => {
        inputRef.current.setCustomValidity("");
    };

    useEffect(() => {
        password.current.addEventListener("input", () => clearValidationMessage(password));
        passwordAgain.current.addEventListener("input", () => clearValidationMessage(passwordAgain));
    }, []);

    const handleClick = async (e)=> {
        e.preventDefault();            
    
            if(passwordAgain.current.value !== password.current.value){
                passwordAgain.current.setCustomValidity("Passwords don't match!");
            } else {
                passwordAgain.current.setCustomValidity("");
            }
    
            // Check the validity of the input fields again before submitting the form
            if(passwordAgain.current.checkValidity()) {
                const user = {
                    firstName: organizationName.current.value,
                    lastName: "Admin",
                    email: `${organizationName.current.value}@admin.com`,
                    password: password.current.value,
					userType: "Admin",
                    from: country
                }

				const organization = {
					establishmentDate: establishmentDate.current.value,
					NumOfEmployees: numOfEmployees.current.value,
					organizationName: organizationName.current.value,
					desc: organizationDesc.current.value
                }

				if (file){
					const data = new FormData();
					const filename = Date.now() + file.name;
					data.append("name",filename);
					data.append("file",file);
					organization.organizationPicture = filename;
					try{
						await axios.post("/upload", data)
					}catch(err){
						console.log(err);
					}
				}
				const Userresponse = await axios.post('/localStorageAdminUser', user);
				const Organzresponse = await axios.post('/localStorageOrganization', organization);

				window.location.href =(`http://localhost:3001/checkout/${numOfEmployees.current.value}/US/USD`);
            }
        }
    
    
    // Add this code to remove the event listener before the component is unmounted
    useEffect(() => {
        return () => {
            if(passwordAgain.current) {
                passwordAgain.current.removeEventListener("input", () => {
                    passwordAgain.current.setCustomValidity("");
                });
            }
        }
    }, []);
    
      

  return (
    <>
	<Topbar/>
	<div className="signUpTop">
	<header>
	<h1 className="signUph1">Sign Up Page</h1>
	
	</header>
	</div>
    <div className="signUp">
		
        <div className="signUpWrapper">

            <div className="signUpLeft">
                <h3 className="signUpLogo">WorkUp</h3>
                <span className="signUpDesc">
				Welcome to our platform! We're excited to have you join our community. Please take a moment to fill out the fields to create your account.
                </span>
            </div>
			
            <div className="signUpRight">
                <form className="signUpBox" onSubmit={handleClick} autoComplete="off">
				<div className="inputWrapper">
			<label htmlFor="EstablishmentDate">Establishment date:</label>
			<input 
				id="EstablishmentDate" 
				required 
				ref={establishmentDate} 
				className="loginInput" 
				type="date" 
			/>
			</div>   
					<input placeholder="Organization name" required ref= {organizationName} className="signUpInput" />
					<input placeholder="Number of employees" required ref= {numOfEmployees} className="signUpInput" />
					<textarea placeholder="Organization desc" required ref= {organizationDesc} className="signUpInput" />
                    <input placeholder="Password" required ref= {password} className="signUpInput" type ="password" minLength="6" />
                    <input placeholder="Password Again" required ref= {passwordAgain}  className="signUpInput" type ="password" />
        <select name="country" value={country} onChange={handleCountryChange} required>
        <option value="">Select a country</option>
        {countryList.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
        </select>
		<label>Organization picture:</label>
		<input placeholder="Organization Picture" type="file" id ="file" accept=".png,.jpeg,.jpg" onChange={(e)=> setFile(e.target.files[0])}/>
					{file && (
                <div className="signUpImgContainer">
                    <img className="signUpImg" src={URL.createObjectURL(file)} alt =""/>
                    <Cancel className="signUpCancelImg" onClick= {()=> setFile(null)}/>
                </div>
            )}
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <button className="signUpButton">Checkout</button>
                    </div>
                </form>
                
            </div>
			
        </div> 
		
    </div>
	<div className="signUpBottom">
	<span className="signUpcredits">Designed by Roni Khizverg and Or Amram</span>
	</div>
	
    </>
  )
}