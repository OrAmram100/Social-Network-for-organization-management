const router = require("express").Router();
const Department = require("../models/Department");
const Organization = require("../models/Organization");
const bcrypt = require("bcrypt");


router.put("/:organizationId/:id", async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.organizationId);
    if (!organization) {
      return res.status(404).json("Organization not found");
    }

    const user = organization.users.id(req.params.id);
    if (!user) {
      return res.status(404).json("User not found");
    }


    if (req.body.userId === req.params.id) {
      if (req.body.password && user.password !== req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }

      const departments = await Department.find({organizationId: req.params.organizationId});

      // Update user in departments
      departments.forEach(async(department) =>{
        if (department.departmentManager && department.departmentManager._id.equals(user._id)) {
          Object.assign(department.departmentManager, req.body);
          await department.save();
        }

        department.teams.forEach(async(team) => {
          if (team.teamManager && team.teamManager._id.equals(user._id)) {
            Object.assign(team.teamManager, req.body);
            await department.save();
          }
          team.users.forEach(async(teamUser) =>{
            if (teamUser._id.equals(user._id)) {
              Object.assign(teamUser, req.body);
              await department.save();
            }
          });
        });
      });

      // Update user in organization
      if(user.userType === "CEO") {
        CEOUser = organization.CEO;
        Object.assign(CEOUser, req.body);
        await organization.save();
      }
      Object.assign(user, req.body);
      await organization.save();

      res.status(200).json({ message: "Account has been updated", user: user });
    } else {
      return res.status(403).json("You can update only your account!");
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});


  router.delete("/:organizationId/:id", async (req, res) => {
    try {
      const organization = await Organization.findById(req.params.organizationId);
      const user = organization.users.find(user=> user._id.toString() === req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      user.remove();
      await organization.save();
  
      res.status(200).json({ message: "User has been deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.get('/:organizationId/:userId/search', async (req, res) => {
    try {
      const organization = await Organization.findById(req.params.organizationId);
      const { q } = req.query;
      const searchWords = q.split(/\s+/).filter(Boolean);
      let matchedUsers = [];
      if (searchWords[0] && searchWords[1]) {
        matchedUsers = organization.users.filter(user => {
          const firstNameMatch = user.firstName.match(new RegExp(searchWords[0], 'i'));
          const lastNameMatch = user.lastName.match(new RegExp(searchWords[1], 'i'));
          return firstNameMatch && lastNameMatch && user._id.toString() !== req.params.userId && user.userType !== "Admin";
        });
      } else if (searchWords[0] || searchWords[1]) {
        matchedUsers = organization.users.filter(user => {
          const firstNameMatch = user.firstName.match(new RegExp(searchWords[0], 'i'));
          const lastNameMatch = user.lastName.match(new RegExp(searchWords[1] ? searchWords[1] : searchWords[0], 'i'));
          return (firstNameMatch || lastNameMatch) && user._id.toString() !== req.params.userId && user.userType !== "Admin";
        });
      }
      res.json(matchedUsers);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });




//get a user
router.get("/:organizationId", async(req, res) => {
    const organization = await Organization.findById(req.params.organizationId);
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        const user = userId ? await organization.users.find(user => user._id.toString() === userId) : await organization.users.find(user => user.firstName === username);
        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get all users
router.get("/:organizationId/allusers", async(req, res) => {

    const organization = await Organization.findById(req.params.organizationId);
    try {
        const users =  organization.users;
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});


async function generateAdjacencyMatrix(users) {
  const matrixSize = users.length;
  const adjacencyMatrix = Array(matrixSize).fill(0).map(() => Array(matrixSize).fill(0));

  // Iterate through each user
  for (let i = 0; i < matrixSize; i++) {
    const currentUser = users[i];

    // Iterate through the connections of the current user
    for (let j = 0; j < currentUser.connections.length; j++) {
      const friendId = currentUser.connections[j];

      // Find the index of the friend in the users array
      const friendIndex = users.findIndex((user) => user._id.equals(friendId));

      if (friendIndex !== -1) {
        // Mark the corresponding cell in the adjacency matrix as 1
        adjacencyMatrix[i][friendIndex] = 1;
      }
    }
  }

  return adjacencyMatrix;
}

// Route handler to get friends-of-friends
router.get("/:organizationId/:userId/friend-offers", async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.organizationId);
    const users = organization.users;

    const adjacencyMatrix = await generateAdjacencyMatrix(users);

    const userIndex = adjacencyMatrix.findIndex((row, index) => users[index]._id.equals(req.params.userId));

    if (userIndex === -1) {
      console.log("User not found in the organization.");
      return res.status(404).json({ error: "User not found" });
    }

    const friends = adjacencyMatrix[userIndex];
    const friendsOfFriends = [];

    // Iterate through the friends of the user
    for (let i = 0; i < friends.length; i++) {
      if (friends[i] === 1) {
        // Add the friends of the friend (FOF) to the friendsOfFriends array
        for (let j = 0; j < adjacencyMatrix[i].length; j++) {
          if (adjacencyMatrix[i][j] === 1 && j !== userIndex && friends[j] !== 1) {
            const fofUser = users[j];
            // Check if the user is already in the friendsOfFriends array
            const isDuplicate = friendsOfFriends.some((user) => user._id.equals(fofUser._id));
            if (!isDuplicate) {
              friendsOfFriends.push(fofUser);
            }
          }
        }
      }
    }

    return res.json({ friendsOfFriends });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});


//get user score
router.get("/:organizationId/:userId/score", async(req, res) => {

  const organization = await Organization.findById(req.params.organizationId);
  const user = organization.users.find(user => user._id.toString() === req.params.userId);
  try {
      res.status(200).json(user.score);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
  }
});


//get 3 top
router.get("/:organizationId/top3Score", async(req, res) => {

  const organization = await Organization.findById(req.params.organizationId);
  try {
      const users =  organization.users;

      // filter out CEO and Admin users
      const filteredUsers = users.filter(user => user.userType !== 'Admin');

      // get the top 3 users
      const sortedUsers = filteredUsers.sort((a, b) => b.score - a.score);
      const top3Users = sortedUsers.slice(0, 3);
      res.status(200).json(top3Users);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
  }
});


// New Post Notifications
router.put("/:organizationId/:id/NewPostNotify", async(req, res) => {
    try {
      const organization = await Organization.findById(req.params.organizationId);
      const user = organization.users.find(user => user._id.toString() === req.params.id);
      user.postNotifications.push(req.body);
      await organization.save();
      res.status(200).json("user has been updated");
    } catch (err) {
      res.status(500).json(err);
    }
  });

//updateArrivalMsg to a user
router.put("/:organizationId/:id/updateArrivalMsg", async(req, res) => {
    const sender = req.body.sender;
    const organization = await Organization.findById(req.params.organizationId);
    try {
        const user = organization.users.find(user => user._id.toString() === req.params.id);
        user.arrivalMessageNotifications.push(sender);
        await organization.save();
        res.status(200).json("user has been updated");
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put("/:organizationId/:id/removeArrivalMsg", async(req, res) => {
    const organization = await Organization.findById(req.params.organizationId);
    const recieverId = req.body.conversation.members.find(member => member !== req.params.id);
    try {
      const userIndex = organization.users.findIndex(user => user._id.toString() === req.params.id);
      const user = organization.users[userIndex];
      user.arrivalMessageNotifications = user.arrivalMessageNotifications.filter(notification => !notification.sender.includes(recieverId));
      organization.users[userIndex] = user;
      await organization.save();
      res.status(200).json("Users have been removed");
    } catch (err) {
      res.status(500).json(err);
    }
  });

//get friends connections

router.get("/:organizationId/friends/:userId", async(req, res) => {
    try {
        const organization = await Organization.findById(req.params.organizationId);
        let user = organization.users.find(user => user._id.toString() === req.params.userId);
        if (!user ) {
            return res.status(404).json({ message: "User not found" });
          }
        const friends = await Promise.all(
            user.connections.map((friendId) => {
                return organization.users.find(user => user._id.toString() === friendId.toString());
            })
        );
        let friendList = [];
        friends.map((friend) => {
            const { _id, firstName, profilePicture, lastName, email } = friend;
            friendList.push({ _id, firstName, profilePicture, lastName, email });
        });
        res.status(200).json(friendList);

    } catch (err) {
        res.status(500).json(err);
    }
})

//show friends requests
router.get("/:organizationId/friendsreq/:userId", async(req, res) => {
    try {
        const organization = await Organization.findById(req.params.organizationId);
        const currentUser = organization.users.find(user => user._id.toString() === req.params.userId);
        const recieveReqList = await Promise.all(
            currentUser.recvConnectionsReq.map((friendId) => {
                return organization.users.find(user => user._id.toString() === friendId);
            })
        );
        let friendList = [];
        recieveReqList.map((friend) => {
            const { _id, firstName, profilePicture, lastName } = friend;
            friendList.push({ _id, firstName, profilePicture, lastName });
        });
        res.status(200).json(friendList);

    } catch (err) {
        res.status(500).json(err);
    }
})

router.put("/:organizationId/:id/confirm", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const organization = await Organization.findById(req.params.organizationId);
      const user = organization.users.find(
        (user) => user._id.toString() === req.params.id
      ); //the user we want to connect with
      const currentUser = organization.users.find(
        (user) => user._id.toString() === req.body.userId
      ); // the user who wants to connect with
      if (!user.connections.includes(req.body.userId)) {
        user.connections.push(req.body.userId);
        currentUser.connections.push(req.params.id);
        user.sendConnectionsReq.pull(req.body.userId);
        currentUser.recvConnectionsReq.pull(req.params.id);
        
        await organization.save();

        res.status(200).json("Users have been connected");
      } else {
        res.status(403).json("You are already connected to this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't connect with yourself");
  }
});


  router.put("/:organizationId/:id/withdraw", async(req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const organization = await Organization.findById(req.params.organizationId);
           
            const user = organization.users.find(user => user._id.toString() === req.params.id); //the user we want to connection with
            const currentUser = organization.users.find(user => user._id.toString() === req.body.userId);// the user who want to connection with
            if (!user.connections.includes(req.body.userId)) {
                user.recvConnectionsReq = user.recvConnectionsReq.filter(connectionId => connectionId !== req.body.userId);
                currentUser.sendConnectionsReq = currentUser.sendConnectionsReq.filter(connectionId => connectionId !== req.params.id);
                await organization.save();
                res.status(200).json("users has been disconnected");

            } else {
                res.status(403).json("you are not connected to this user");
            }

        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You cant connect yourself");
    }
});

// remove post notification
router.put("/:organizationId/:id/removePostNotify", async (req, res) => {
    try {
      const organization = await Organization.findById(req.params.organizationId);
      const user = organization.users.find(user => user._id.toString() === req.params.id);
      user.postNotifications = user.postNotifications.filter(notification => {
        return  notification.post !== req.body.post;
      });
      await organization.save();
      res.status(200).json("Post notification has been removed");
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.put("/:organizationId/:id/RemovePostLikeAndCommentNotify", async (req, res) => {
    try {
      const organization = await Organization.findById(req.params.organizationId);
      const user = organization.users.find(user => user._id.toString() === req.params.id);
      user.postNotifications = user.postNotifications.filter(notification => notification.operation !== req.body.operation && notification.post !== req.body.post);
      await organization.save();
      res.status(200).json("Post notify has been removed");
    } catch (err) {
      res.status(500).json(err);
    }
  });

//decline to connection request
router.put("/:organizationId/:id/decline", async(req, res) => {
    if (req.body.userId !== req.params.id) {
        try {

            const organization = await Organization.findById(req.params.organizationId);

            const user = organization.users.find(user => user._id.toString() ===req.params.id); //the user we want to connection with
            const currentUser = organization.users.find(user => user._id.toString() === req.body.userId);
            if (!user.connections.includes(req.body.userId)) {
                user.sendConnectionsReq.pull(req.body.userId);
                currentUser.recvConnectionsReq.pull(req.params.id);
                
                await organization.save();

                res.status(200).json("users has been connected");

            } else {
                res.status(403).json("you already connect to this user");
            }

        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You cant connect yourself");
    }
});
//unconnect a user for all users
router.put("/:organizationId/:deleteUserId/unconnectFromAllConnections", async(req, res) => {
    try {
      const organization = await Organization.findById(req.params.organizationId);
  
      // Loop through all users in the organization
      for (let i = 0; i < organization.users.length; i++) {
        const user = organization.users[i];
        
        // Remove the specified user from the connections array
        if (user.connections.includes(req.params.deleteUserId)) {
          user.connections = user.connections.filter(id => id !== req.params.deleteUserId);
        }
      }
  
      await organization.save();
  
      res.status(200).json(`User ID ${req.params.deleteUserId} has been removed from the "connections" array of all users.`);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });


//unconnect a user
router.put("/:organizationId/:id/unconnect", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const organization = await Organization.findById(req.params.organizationId);
  
        const user = organization.users.find(user => user._id.toString() === req.params.id); //the user we want to unfollow him
        const currentUser = organization.users.find(user => user._id.toString() === req.body.userId); // the user who want to follow
        if (user.connections.includes(req.body.userId)) {
          user.connections.pull(req.body.userId);
          currentUser.connections.pull(req.params.id);
          await organization.save();
          res.status(200).json("user has been unconnected");
        } else {
          res.status(403).json("you dont connect this user");
        }
  
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("You cant unconnect yourself");
    }
  });

router.put("/:organizationId/:id/connectionreq", async(req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const organization = await Organization.findById(req.params.organizationId);
            const user = organization.users.find(user => user._id.toString() ===req.params.id); //the user we want to connect him
            const currentUser = organization.users.find(user => user._id.toString() === req.body.userId);
            if (!user.connections.includes(req.body.userId)) {
                user.recvConnectionsReq.push(req.body.userId);
                currentUser.sendConnectionsReq.push(req.params.id);
                await organization.save();
                res.status(200).json("connection request was sent");

            } else {
                res.status(403).json("you already connected");
            }

        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You can't send request to yourself");
    }
});

module.exports = router