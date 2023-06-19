const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const Department = require("../models/Department");
const Organization = require("../models/Organization");
const bcrypt = require("bcrypt");


// create a Department
router.post("/:organizationId", async (req, res) => {
  try {
    const organizationId = req.params.organizationId;
    const departmentName = req.body.department;
    // check if department already exists
    const existingDepartment = await Department.findOne({
      departmentName: departmentName,
      organizationId: organizationId,
    });
    if (existingDepartment) {
      return res.json({ message: "Department already exists" });
    }
    // Generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUserId = new mongoose.Types.ObjectId(); // generate new _id for user
    const newDepartment = new Department({
      organizationId: organizationId,
      departmentName: departmentName,
      departmentManager: {
        _id: newUserId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        from: req.body.from,
        department: req.body.department,
        userType: req.body.userType,
        workStartDate:req.body.workStartDate,
        role: req.body.role
      } }, // set _id to newUserId
    )
    const organization = await Organization.findById(organizationId);
    organization.users.push(newDepartment.departmentManager); // set _id to newUserId
    await organization.save();
    const savedDepartment = await newDepartment.save();
    res.status(200).json(savedDepartment);
  } catch (err) {
    res.status(500).json(err);
  }
});






//get manager
router.get('/:departmentId/manager', async(req, res) => {
    try
    {
        const departmentId = req.params.departmentId;
        const department = await Department.findById(departmentId);
  
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      } 
        res.status(200).json(department.departmentManager);
    } catch (err) {
        res.status(500).json(err);
    }

});

//get all department managers according email
router.get('/manager/:organizationId', async (req, res) => {
  try {
    const departments = await Department.find({organizationId: req.params.organizationId});
    const departmentManagers = [];

    for (let i = 0; i < departments.length; i++) {
      const department = departments[i];
      departmentManagers.push(department.departmentManager);
    }

    res.status(200).json(departmentManagers);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all subordinates accoding to current user id
router.get('/manager/:organizationId', async (req, res) => {
  try {
    const departments = await Department.find({organizationId: req.params.organizationId});
    const departmentManagers = [];

    for (let i = 0; i < departments.length; i++) {
      const department = departments[i];
      departmentManagers.push(department.departmentManager);
    }

    res.status(200).json(departmentManagers);
  } catch (err) {
    res.status(500).json(err);
  }
});

//check if userId is subordinate to the currentuser
//get all team leaders
router.get('/manager/:organizationId/:userId/:currentUserId', async (req, res) => {
  try {
    const organizationId = req.params.organizationId;
    const currentUserId = req.params.currentUserId;
    const userId = req.params.userId;

    const organization = await Organization.findById(organizationId);
    const user = organization.users.find(user => user._id.toString() === currentUserId);
    // Find all departments and teams that the employee belongs to
    const departments = await Department.find({ organizationId: organizationId });
    if(user.userType === "CEO")
    {
      for (let i = 0; i < departments.length; i++) {
        if(departments[i].departmentManager._id.toString() === userId) // the user is department Manager
        {
            return res.status(200).send(true);
          }
        }
    }

    for (let i = 0; i < departments.length; i++) {
      if(departments[i].departmentManager._id.toString() === currentUserId) // the user is department Manager
      {
        for(let j=0; j < departments[i].teams.length; j++)
        {
          if(departments[i].teams[j].teamManager._id.toString() === userId)
            return res.status(200).send(true);
        }
      }
    }
    for (let i = 0; i < departments.length; i++) {
      for(let j=0; j < departments[i].teams.length; j++)
      {
          if(departments[i].teams[j].teamManager._id.toString() === currentUserId)  // the user is team Manager
          {
            for(let k =0; k< departments[i].teams[j].users.length; k++)
            {
              if(departments[i].teams[j].users[k]._id.toString() === userId)
                return res.status(200).send(true);
            }
          }
    }
  }
   res.status(200).send(false);
  } catch (err) {
    console.error(err);
    return false;
  }
})

router.get('/:organizationId/subordinates/:userId', async (req, res) =>{
  try {
    const userId = req.params.userId;
    const organizationId = req.params.organizationId;
    const departments = await Department.find({organizationId: req.params.organizationId});
    const organization = await Organization.findById(organizationId);
    const user = organization.users.find(user => user._id.toString() === userId);
    const subordinates = [];

    if(user.userType === "CEO")
    {
      for (let i = 0; i < departments.length; i++) {
        subordinates.push(departments[i].departmentManager);
        for(let j=0; j < departments[i].teams.length; j++) {
          subordinates.push(departments[i].teams[j].teamManager);
          for(let k =0; k< departments[i].teams[j].users.length; k++) {
            subordinates.push(departments[i].teams[j].users[k]);
          }
        }
      }
    }
    else
    {
      for (let i = 0; i < departments.length; i++) {
        if(departments[i].departmentManager._id.toString() === userId) // the user is department Manager
        {
          for(let j=0; j < departments[i].teams.length; j++) {
            subordinates.push(departments[i].teams[j].teamManager);
            for(let k =0; k< departments[i].teams[j].users.length; k++)
            {
              subordinates.push(departments[i].teams[j].users[k]);
            }
          }
        }
    }

    for (let i = 0; i < departments.length; i++) {
      for(let j=0; j < departments[i].teams.length; j++)
      {
          if(departments[i].teams[j].teamManager._id.toString() === userId)  // the user is team Manager
          {
            for(let k =0; k< departments[i].teams[j].users.length; k++)
              subordinates.push(departments[i].teams[j].users[k]);
          }
    }
  }
}

    res.status(200).json(subordinates);
  } catch (err) {
    res.status(500).json(err);
  }
});



//get all team leaders
router.get('/manager/:organizationId/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const departments = await Department.find({organizationId: req.params.organizationId});
    const subordinates = [];

    for (let i = 0; i < departments.length; i++) {
      if(departments[i].departmentManager._id.toString() === userId) // the user is department Manager
      {
        for(let j=0; j < departments[i].teams.length; j++)
          subordinates.push(departments[i].teams[j].teamManager);
      }
    }
    for (let i = 0; i < departments.length; i++) {
      for(let j=0; j < departments[i].teams.length; j++)
      {
          if(departments[i].teams[j].teamManager._id.toString() === userId)  // the user is team Manager
          {
            for(let k =0; k< departments[i].teams[j].users.length; k++)
              subordinates.push(departments[i].teams[j].users[k]);
          }
    }
  }

    res.status(200).json(subordinates);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:departmentId/team-managers', async (req, res) => {
    try {
      const departmentId = req.params.departmentId;
      const department = await Department.findById(departmentId);
      
      if (!department) {
        return res.status(404).json({ message: 'Department not found' });
      }
  
      const teamManagers = [];
  
      department.teams.forEach(team => {
        if (team.teamManager) {
          teamManagers.push(team.teamManager);
        }
      });
  
      res.status(200).json(teamManagers);
    } catch (err) {
      res.status(500).json(err);
    }
  });


  router.get('/:departmentId/teams', async (req, res) => {
    try {
      const departmentId = req.params.departmentId;
      const department = await Department.findById(departmentId);
      
      if (!department) {
        return res.status(404).json({ message: 'Department not found' });
      }
  
  
      res.status(200).json(department.teams);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.post("/:departmentId/teams", async (req, res) => {
    try {
      const departmentId = req.params.departmentId;
  
      const department = await Department.findById(departmentId);
  
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      } 
      const organization = await Organization.findById(department.organizationId);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
      // Check if user already exists
      const userExists = organization.users.some(
        (user) => user.email === req.body.email
      );
      if (userExists) {
        return res.json({ message: "User already exists" });
      }
  
      const newUserId = new mongoose.Types.ObjectId(); // generate new _id for user
      const newTeam = {
        teamName: req.body.teamName,
        teamManager: {
          _id: newUserId,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hashedPassword,
          from: req.body.from,
          department: req.body.department,
          userType: req.body.userType,
          workStartDate:req.body.workStartDate,
          role: req.body.role
        }
      };
  
      department.teams = [...department.teams, newTeam];
  
      organization.users.push(newTeam.teamManager);
      await organization.save();
  
      const savedDepartment = await department.save();
  
      res.status(200).json(savedDepartment);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  
  
  router.post("/:departmentId/teams/:teamId/users", async (req, res) => {
    try {
      const departmentId = req.params.departmentId;
      const teamId = req.params.teamId;
  
      const department = await Department.findById(departmentId);
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }

      const organization = await Organization.findById(department.organizationId);
        // Check if user already exists
      const userExists = organization.users.some(
      (user) => user.email === req.body.email
    );
    if (userExists) {
      return res.json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
      const team = department.teams.id(teamId);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }

    const newUserId = new mongoose.Types.ObjectId();
    const newUser ={
      _id: newUserId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      from: req.body.from,
      department: req.body.department,
      userType: req.body.userType,
      workStartDate:req.body.workStartDate,
      role: req.body.role
    };


      team.users.push(newUser);

      organization.users.push(newUser);
      await organization.save();
  
      const result = await department.save();
  
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  
  
  


// Update an department
router.put("/:id", async(req, res) => {
    try {
        const updatedDepartment = await Department.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
        );
        res.status(200).json(updatedDepartment);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete an department
router.delete("/:id", async(req, res) => {
    try {
        await Department.findByIdAndDelete(req.params.id);
        res.status(200).json("Department deleted successfully.");
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get a single department by ID
router.get("/:id", async(req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        res.status(200).json(department);
    } catch (err) {
        res.status(500).json(err);
    }
});



// Get a single department by Name
router.get("/:departmentName/:organizationId/byName", async(req, res) => {
    try {
        const department = await Department.findOne({ departmentName: req.params.departmentName, organizationId: req.params.organizationId });
        res.status(200).json(department);
    } catch (err) {
        res.status(500).json(err);
    }
});


router.post("/login/department", async(req, res) => {
    try {
        const department = await Department.findById(req.body.departmentId);
        res.status(200).json(department);
    } catch (err) {
        res.status(500).json(err);
    }
});


// Get all departments
router.get("/:organizationId/all", async (req, res) => {
    try {
      const departments = await Department.find({ organizationId: req.params.organizationId });
      res.status(200).json(departments);
    } catch (err) {
      res.status(500).json(err);
    }
  });


module.exports = router