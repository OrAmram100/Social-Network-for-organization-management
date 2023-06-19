import Profile from "./pages/profile/Profile";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import AddEmployee from "./pages/addEmployee/AddEmployee";
import Attendance from "./pages/attendance/Attendance"
import Hierarchy from "./pages/hierarchy/Hierarchy"
import About from "./pages/about/About";
import SignUp from "./pages/signUp/SignUp";
import PaymentSuccess from "./pages/paymentPage/paymentSuccess/PaymentSuccess";
import paymentFailed from "./pages/paymentPage/paymentFailed/paymentFailed";
import DisplaySpecificPost from "./pages/displaySpecificPost/DisplaySpecificPost";
import DisplaySpecificTask from "./pages/displaySpecificTask/DisplaySpecificTask";



import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Messanger from "./pages/messanger/Messanger";

function App() {

    const {user} = useContext(AuthContext);

        return (
            <Router>
                <Routes>
                <Route exact path="/attendance" element={<Attendance/>}/>
                <Route exact path="/" element={user ? <Home/> : <Login/>}/>
                <Route exact path="/login" element={user ? <Navigate to="/" /> : <Login/>}/>
                <Route exact path="/register" element={user && !user.userType==="Admin" && !user.userType === "Manager" ?<Navigate to="/" /> : <AddEmployee/>}/>
                <Route exact path="/messanger" element={!user ?<Navigate to="/" /> : <Messanger/>}/>
                <Route exact path="/hierarchy" element={!user ?<Navigate to="/" /> : <Hierarchy/>}/>
                <Route exact path="/about" element={!user ?<Navigate to="/" /> : <About/>}/>
                <Route exact path="/profile/:username" element={<Profile/>}/>
                <Route exact path="/messanger/:username" element={<Messanger/>}/>
                <Route exact path="/signup" element={<SignUp/>}/>
                <Route exact path="/successPayment" element={<PaymentSuccess/>}/>
                <Route exact path="/failedPayment" element={<paymentFailed/>}/>
                <Route exact path="/post/:userPost" element={<DisplaySpecificPost/>}/>
                <Route exact path="/task/:userTask" element={<DisplaySpecificTask/>}/>
                <Route exact path="/:postType" element={user ? <Home/> : <Login/>}/>





                </Routes>
            </Router>
          );
}

export default App;