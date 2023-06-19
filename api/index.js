const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const taskRoute = require("./routes/tasks");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const organizationRoute = require("./routes/organizations");
const departmentRoute = require("./routes/departments");
const calendarEventsRoute = require("./routes/CalendarEvents");
const attendanceRoute = require("./routes/attendances");



const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./localStorage');


const conversationRoute = require("./routes/conversations");
//const commentsRoute = require("./routes/comments");
const messageRoute = require("./routes/messages");
const multer = require("multer");
const path = require("path");
const nodemailer = require('nodemailer');


dotenv.config();

mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true, useUnifiedTopology: true},()=>{
    console.log("Connected to MongoDB");
});

app.use("/images", express.static(path.join(__dirname,"public/images")));


//middleware

app.use(express.json())// a body parser when u make post request its gonna parser it
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, "public/images");
    },
    filename: (req,file,cb) => {
        cb(null,req.body.name);
    },
});

const upload = multer({storage: storage});
app.post("/api/upload", upload.single("file"), (req,res)=>{
    try{
        return res.status(200).json("file uploaded successfully.")
    }
    catch(err)
    {
        console.log(err);
    }
});

// Route to retrieve localStorage value
app.post('/api/localStorageAdminUser', (req, res) => {
    const localStorageValue = req.body;
    localStorage.setItem("adminUser", JSON.stringify(localStorageValue));
    res.send(localStorageValue);
  });

// Route to retrieve localStorage value
app.post('/api/localStorageOrganization', (req, res) => {
    const localStorageValue = req.body;
    localStorage.setItem("organization",JSON.stringify(localStorageValue));
    res.send(localStorageValue);
  });

  app.get('/api/localStorageAdminUser', (req, res) => {
    const user = JSON.parse(localStorage.getItem("adminUser"));
    res.send(user);
  });

// Route to retrieve localStorage value
app.get('/api/localStorageOrganization', (req, res) => {
    const organization = JSON.parse(localStorage.getItem("organization"));
    res.send(organization);
  });

const uploadFile = multer();
app.post('/api/send-email',uploadFile.single('file'), (req, res) => {
    // create reusable transporter object using SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: "workup.noreply@gmail.com",
            pass: 'axqzkkegqxupgpjx' // my actual password
          }
    });
    let mailOptions ;
    if(req.file)
    {
    // setup email data with attachments
        mailOptions = {
            to: req.body.to, // list of receivers
            subject: req.body.subject, // Subject line
            text: req.body.text, // plain text body
            attachments: [{
                filename: req.file.originalname,
                content: req.file.buffer
            }]
        };
    }
    else
    {
        mailOptions = {
            to: req.body.to, // list of receivers
            subject: req.body.subject, // Subject line
            text: req.body.text, // plain text body
        };
    }


    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send(error);
        } else {
            console.log('Message %s sent: %s', info.messageId, info.response);
            res.send('Email sent successfully!');
        }
    });
});



app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/posts",postRoute);
app.use("/api/conversations",conversationRoute);
app.use("/api/messages",messageRoute);
app.use("/api/tasks",taskRoute);
app.use("/api/organizations",organizationRoute);
app.use("/api/departments",departmentRoute);
app.use("/api/CalendarEvents",calendarEventsRoute);
app.use("/api/attendances",attendanceRoute);



//app.use("/api/comments",commentsRoute);






app.listen(8082,()=> {
    console.log("Backend server is running!");
})
