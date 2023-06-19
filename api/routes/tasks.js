const router = require("express").Router();
const Task = require("../models/Task");
const Department = require("../models/Department");
const Organization = require("../models/Organization");
// create a task
router.post("/", async(req, res) => {
    const newTask = new Task(req.body)
    try {
        const savedTask = await newTask.save();
        res.status(200).json(savedTask);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/:organizationId/:userId/allSubordinatesTasks", async (req, res) => {
  try {
    const userId = req.params.userId;
    const organizationId = req.params.organizationId;
    const departments = await Department.find({ organizationId: req.params.organizationId });
    const organization = await Organization.findById(organizationId);
    const user = organization.users.find((user) => user._id.toString() === userId);
    let tasks = [];

    if (user.userType === "CEO") {
      const departmentManagerIds = departments.map((dep) => dep.departmentManager._id.toString());
      const teamManagerIds = departments.flatMap((dep) => dep.teams.map((team) => team.teamManager._id.toString()));
      const teamUserIds = departments.flatMap((dep) => dep.teams.flatMap((team) => team.users.map((user) => user._id.toString())));

      tasks = await Task.find({
        $or: [
          { members: { $in: departmentManagerIds } },
          { members: { $in: teamManagerIds } },
          { members: { $in: teamUserIds } }
        ]
      }).exec();
    } else {
      for (let i = 0; i < departments.length; i++) {
        if (departments[i].departmentManager._id.toString() === userId) { // The user is a department manager
          const teamManagerId = departments[i].teams.map((team) => team.teamManager._id.toString());
          const teamUserIds = departments[i].teams.flatMap((team) => team.users.map((user) => user._id.toString()));

          tasks = await Task.find({
            $or: [
              { members: { $in: [...teamManagerId, userId] } },
              { members: { $in: [...teamUserIds, userId] } }
            ]
          }).exec();         
        }
      }

      for (let i = 0; i < departments.length; i++) {
        for (let j = 0; j < departments[i].teams.length; j++) {
          if (departments[i].teams[j].teamManager._id.toString() === userId) { // The user is a team manager
            const teamUserIds = departments[i].teams[j].users.map((user) => user._id.toString());
            tasks = await Task.find({ members: { $in: [...teamUserIds, userId] } }).exec();
          }
        }
      }

      for (let i = 0; i < departments.length; i++) {
        for (let j = 0; j < departments[i].teams.length; j++) {
          for (let k = 0; k < departments[i].teams[j].users.length; k++) {
            if (departments[i].teams[j].users[k]._id.toString() === userId) { // The user is a team member
              tasks = await Task.find({ members: { $in: [departments[i].teams[j].users[k]._id.toString()] } }).exec();
            }
          }
        }
      }
    }

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json(err);
  }
});


  router.get("/:id/specificTask", async (req, res) => {
    try {
      const taskId = req.params.id;
      const task = await Task.findById(taskId);
      res.status(200).json(task);
    } catch (err) {
      res.status(500).json(err);
    }
  });


//update a task
router.put("/:id", async(req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        await task.updateOne({ $set: req.body });
        res.status(200).json("the task has been updated");
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete("/:id", async(req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        await task.deleteOne();
        res.status(200).json("the task has been deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router