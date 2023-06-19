import Autocomplete from 'react-autocomplete';
import {useState } from "react";
import axios from "axios"
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function TagInput(props) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const {organization} = useContext(AuthContext);
  const {user} = useContext(AuthContext);


  const handleInputChange = (e) => {
    setValue(e.target.value);

  };

  const handleSelect = (value, item) => {
    setValue('');
    props.onTagSelect(item); // pass the selected user to the parent component
  };

  const  getSuggestions  =  async(value) =>{
    // fetch user suggestions from the server based on the current input value
      await axios.get(`/users/${organization._id}/${user._id}/search?q=${value}`)
      .then(response => {
        setSuggestions(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <Autocomplete
      getItemValue={(item) => item.firstName}
      items={suggestions}
      renderItem={(item, isHighlighted) => (
        <div key={item._id} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
          {item.firstName} {item.lastName}
        </div>
      )}
      value={value}
      onChange={(e) => {
        {handleInputChange(e)};
        getSuggestions(e.target.value);
      }}
      onSelect={handleSelect}
      onMenuVisibilityChange={(isOpen) => isOpen && getSuggestions(value)}
    />
  );
}
