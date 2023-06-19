const router = require("express").Router();
const Organization = require("../models/Organization");
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/:id/register", async (req, res) => {
    try {
        // Generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const organization = await Organization.findById(req.params.id);

        // Check if user already exists
    const userExists = organization.users.some(
        (user) => user.email === req.body.email
      );
      if (userExists) {
        return res.json({ message: "User already exists" });
      }

        
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            from: req.body?.from,
            userType: req.body.userType,
            department: req.body?.department,
            workStartDate:req.body?.workStartDate,
            role: req.body?.role
        });
        if(req.body.userType === "CEO")
            organization.CEO = newUser;


        organization.users.push(newUser);
         await organization.save();
        res.status(200).json(newUser);

    } catch (err) {
        // Handle validation error
        if (err.name === "ValidationError") {
            const errors = Object.values(err.errors).map(error => error.message);
            return res.status(400).json({ errors });
        }

        // Handle other errors
        console.error(err);
        res.status(500).json({ message: "An unexpected error occurred." });
    }
});





//LOGIN
router.post("/:organizationId/login", async(req, res) => {
    try {
        const organization = await Organization.findById(req.params.organizationId);
        const user = organization.users.find(user => user.email === req.body.email);
        if (!user) {
            return res.status(404).send("User not found");
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).send("Wrong password");
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router