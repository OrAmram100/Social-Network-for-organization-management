import { Modal, useMantineTheme } from "@mantine/core";
import './sendingEmail.css';
import { useState } from "react";
import axios from "axios"



export default function SendingEmail({ modalOpened, setModalOpened }) {
    const [formData, setFormData] = useState({
        from: '',
        to: '',
        subject: '',
        text: '',
        file: null
      });
    const theme = useMantineTheme();
    const [sentEmailSuccessfully, setSentEmailSuccessfully] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value
        }));
      };

      const handleFileChange = (event) => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          file: event.target.files[0]
        }));
      };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
      const formDataToSend = new FormData();
        formDataToSend.append('from', formData.from); //user.mail
        formDataToSend.append('to', formData.to);
        formDataToSend.append('subject', formData.subject);
        formDataToSend.append('text', formData.text);
        formDataToSend.append('file', formData.file);
        try
        {
            const response = await axios.post('/send-email', formDataToSend);
            if(response.data === "Email sent successfully!")
            {
              setSentEmailSuccessfully(true);
            }
      } catch (error) {
            console.error(error);
      }
      //to clean the fields
      setFormData( {from: '',
      to: '',
      subject: '',
      text: '',
      file: null
      });
    };

  return (
    <Modal
    styles={{
      modal: {
        boxShadow: "none",
        borderRadius: 0,
        border: "none",
      },
    }}
      overlayColor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
      size="40%"
      opened={modalOpened}
      onClose={() => setModalOpened(false)}
    >
            <h2 className="sendingEmailText">Send Email</h2>
        <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="to">To:</label>
          <input type="email" id="to" name="to" value={formData.to} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="subject">Subject:</label>
          <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleInputChange} required />
        </div>
        <div>
          <label htmlFor="text">Body:</label>
          <textarea id="text" name="text" value={formData.text} onChange={handleInputChange}required></textarea>
           </div>
           <div>
             <label htmlFor="file">Attachment:</label>
             <input type="file" id="file" name="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handleFileChange} />
           </div>
           <button type="submit">Send</button>
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
     opened={sentEmailSuccessfully} onClose={() => setSentEmailSuccessfully(false)}
>
          <h2> Email sent successfully! </h2>
						<div className="buttonsModalFrame">
						<button className="modalOkButton" onClick={()=>  setModalOpened(false)}>Ok</button>
						</div>
					  </Modal>
        </form>
      </div>

    </Modal>
     );
   };