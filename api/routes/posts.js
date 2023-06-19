const router = require("express").Router();
const Organization = require("../models/Organization");
const Post = require("../models/Post");
const User = require("../models/User");
const io = require('socket.io-client');

let handleMultipleCorrectAnswersCalled = false; // Flag to track if handleMultipleCorrectAnswers has been called
let repeatDecision = false; // Flag to track if handleMultipleCorrectAnswers has been called

// Connect to the server
const socket = io('http://localhost:8900', {
  transports: ['websocket'], // Specify the transport mechanism
});


// create a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);  // Create a new post object
  const organizationId = req.query.organizationId;// Get the organization ID from the query parameter
  try {
    const savedPost = await newPost.save(); // Save the new post to the database
    if (req.body.type === "question") {
       handleMultipleCorrectAnswersCalled = false; // Flag to track if handleMultipleCorrectAnswers has been called
       repeatDecision = false; // Flag to track if the question is decided
      const timerDuration = 185000; // 185 seconds
      setTimeout(async () => {
        try {
          // Call the methods when the timer runs out
          await updateWeighingVotes(organizationId, savedPost._id.toString());
          await updateRightAnswer(savedPost._id.toString(), organizationId);
          if (!handleMultipleCorrectAnswersCalled) {
            await updateSkillsAndScores(organizationId, savedPost._id.toString());
            // Emit socket event if needed in order to update in real time user's score
            socket.emit("updateUserScore",{
            })
          }
        } catch (error) {
          console.error("Error occurred:", error);
        }
      }, timerDuration);
    }
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});


//update a post

router.put("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("the post has been updated");
        } else {
            res.status(403).json("you can update only your post");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//delete a post

router.delete("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        await post.deleteOne();
        res.status(200).json("the post has been deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete a comment
router.delete('/:postId/comment/:commentId', async (req, res) => {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      const commentIndex = post.comments.findIndex(
        (comment) => comment._id.toString() === req.params.commentId
      );
      if (commentIndex < 0) {
        return res.status(404).json({ message: "Comment not found" });
      }
  
      const comment = post.comments[commentIndex];
      await comment.remove();
  
      await Post.updateOne(
        { _id: post._id },
        { $pull: { comments: { _id: comment._id } } }
      );
  
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  
//get all post's comments
router.get("/:postId/allComments", async(req, res) => {
  try {
      const post = await Post.findById(req.params.postId);      
      res.status(200).json(post.comments);
  } catch (err) {
      res.status(500).json(err);
  }
});  

//add comment to a post
router.post("/:id/comment", async(req, res) => {
  try {
      const post = await Post.findById(req.params.id);
      post.comments.push(req.body);
      await post.save();
      
      // Retrieve the specific comment that was just added
      const newComment = post.comments[post.comments.length - 1];
      
      res.status(200).json(newComment);
  } catch (err) {
      res.status(500).json(err);
  }
});

// Edit a comment in a post
router.put("/:id/comment/:commentId", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const commentIndex = post.comments.findIndex(
        (comment) => comment._id.toString() === req.params.commentId
      );
  
      if (commentIndex < 0) {
        return res.status(404).json({ message: "Comment not found" });
      }
  
      const comment = post.comments[commentIndex];
      comment.text = req.body.text;
      const updatedPost = await post.save();
  
      res.status(200).json({
        message: "Comment updated successfully",
        comment: updatedPost.comments[commentIndex],
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });



//get user's all posts according type
router.get("/:organizationId/profile/:username/type/:posttype", async(req, res) => {
    try {
        const organization = await Organization.findById(req.params.organizationId);
        const posttype = req.params.posttype;
        const user = organization.users.find(user => user.firstName === req.params.username);
        const posts = await Post.find({ userId: user._id.toString(), type: posttype});
        res.status(200).json(posts);

    } catch (err) {
        res.status(500).json(err);
    }
});

//get all posts according specific type

router.get("/:organizationId/timeline/:userId/type/:posttype", async(req, res) => {
    try {
        const organization = await Organization.findById(req.params.organizationId);
        const currentUser = organization.users.find(user => user._id.toString() === req.params.userId);
        const posttype = req.params.posttype;
        let userPosts = [];
        if (posttype === 'event') {
            userPosts = await Post.find({ type: posttype });
        } else {
            userPosts = await Post.find({ $and: [{userId: currentUser._id}, {type: posttype}] });
        }
        const friendPosts = await Promise.all(
            currentUser.connections.map((friendId) => {
                return Post.find({ userId: friendId,type: posttype });
            })
        );
        // Remove duplicates from friendPosts and userPosts
        let uniquePosts = [];
        userPosts.forEach((post) => {
            if (!uniquePosts.some((p) => p._id.toString() === post._id.toString())) {
                uniquePosts.push(post);
            }
        });
        friendPosts.forEach((posts) => {
            posts.forEach((post) => {
                if (!uniquePosts.some((p) => p._id.toString() === post._id.toString())) {
                    uniquePosts.push(post);
                }
            });
        });
        res.status(200).json(uniquePosts);
    } catch (err) {
        res.status(500).json(err);
    }
});


//like / dislike a post
router.put("/:id/like", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("The post has been liked");
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("The post has been disliked");

        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// Function to update weighing votes according to majority for second round voting
async function updateWeighingVotesAccordingToMajority(organizationId, postId) {
  try {
      // Find the post by postId
    const post = await Post.findOne({
      _id: postId,
    });

    if (!post) {
      throw new Error("Post not found");
    }

      // Find the organization by organizationId
    const organization = await Organization.findOne({ _id: organizationId });

    if (!organization) {
      throw new Error("Organization not found");
    }

      // Iterate through each comment in the post
    for (let i = 0; i < post.comments.length; i++) {
      const comment = post.comments[i];
      let weighingVotes = 0;

      // Calculate weighingVotes based on the total votes received by the comment
      const commentVotesCount = comment.votes.length;
      weighingVotes = commentVotesCount;
      // Update the weighingVotes field of the comment
      comment.weighingVotes = weighingVotes;
    }

    // Save the updated post and organization
    await post.save();
    await organization.save();

    return { message: "Weighing votes updated successfully" };
  } catch (error) {
    console.error("Error updating weighing votes according to majority:", error);
    throw new Error("Failed to update weighing votes according to majority");
  }
}

async function updateWeighingVotes(organizationId, postId) {
  try {
    // Find the post by postId
    const post = await Post.findOne({
      _id: postId,
    });

    if (!post) {
      throw new Error("Post not found");
    }

    // Find the organization by organizationId
    const organization = await Organization.findOne({ _id: organizationId });

    if (!organization) {
      throw new Error("Organization not found");
    }

    // Check if most of the voters have flag 0
    const totalVotes = post.comments.reduce(
      (total, comment) => total + comment.votes.length,
      0
    );
    const flag0VotesCount = post.comments.reduce(
      (count, comment) =>
        count +
        comment.votes.filter(
          (vote) =>
            organization.users.find(
              (user) => user._id.toString() === vote.userId
            )?.flag === 0
        ).length,
      0
    );
    const majorityFlag0 = flag0VotesCount >= totalVotes / 2;

    // Iterate through each comment
    for (let i = 0; i < post.comments.length; i++) {
      const comment = post.comments[i];
      let weighingVotes = 0;

      // If most of the voters have flag 0, set weighingVotes according to the total votes received by each comment
      if (majorityFlag0) {
        const commentVotesCount = comment.votes.length;
        weighingVotes = commentVotesCount;
      } else {
        // Iterate through the votes of the comment and calculate weighingVotes based on user skill
        for (let j = 0; j < comment.votes.length; j++) {
          const vote = comment.votes[j];

          // Find the user in organization.users by userId and get their skill
          const user = organization.users.find(
            (user) => user._id.toString() === vote?.userId
          );
          if (user) {
            // If this is a knowledge question and the confidence level percentage is higher than 70 or if this is a general question
            if (
              (vote.confidenceLevel && vote.confidenceLevel >= 70) ||
              !vote.confidenceLevel
            ) {
              weighingVotes += user.skill;
            }
          }
        }
      }
      // Update the weighingVotes field of the comment
      comment.weighingVotes = weighingVotes;
    }


    // Save the updated post and organization
    await post.save();
    await organization.save();
  } catch (error) {
    console.error("Error updating weighing votes:", error);
    throw new Error("Failed to update weighing votes");
  }
}

// Function to set the repeated decision flag for a post
async function repeatedDecision(postId) {
  try {
        // Find the post by postId
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    // Set the repeated decision flag to true
    post.repeatedDecision = true;

    // Save the updated post
    await post.save();
  } catch (error) {
    console.error("Error setting repeated decision flag:", error);
    throw new Error("Failed to set repeated decision flag");
  }
}


  

  // Function to handle multiple correct answers error and perform necessary actions
  async function handleMultipleCorrectAnswers(postId, organizationId) {
    try {
      // Reset votes for the post
      await resetVotes(postId);
  
      // Set repeated decision flag
      await repeatedDecision(postId);
  
      
      socket.emit("secondTimerStarted", {
          // Emit socket event if needed in order to update in real time the front second round voting timer started
        });
        // Create a new timer for 95 seconds
        const timerDuration = 95000; // 95 seconds
        setTimeout(async () => {
          try {
            // Call functions after timer ends
            await updateWeighingVotesAccordingToMajority(organizationId, postId);
            await updateRightAnswer(postId, organizationId);
            // Only execute updateSkillsAndScores if handleMultipleCorrectAnswers hasn't been called
            if (!handleMultipleCorrectAnswersCalled) {
              await updateSkillsAndScores(organizationId, postId);
              socket.emit("updateUserScore", {
                // Emit socket event if needed in order to update in real time user's score
              });
            }
          } catch (error) {
            console.error("Error updating weighing votes, correct answer, or skills and scores:", error);
          }
        }, timerDuration);
    } catch (error) {
      console.error("Error handling multiple correct answers:", error);
    }
  }
  

  async function updateRightAnswer(postId,organizationId) {
    try {
      handleMultipleCorrectAnswersCalled = false // Flag to track if handleMultipleCorrectAnswers has been called
      const post = await Post.findById(postId);
  
      if (!post) {
        throw new Error("Post not found");
      }
  
      // Find the comment(s) with the highest weighingVotes
      let highestVotes = -Infinity;
      let highestVotesComments = [];
  
      post.comments.forEach((comment) => {
        if (comment.weighingVotes > highestVotes) {
          highestVotes = comment.weighingVotes;
          highestVotesComments = [comment];
        } else if (comment.weighingVotes === highestVotes) {
          highestVotesComments.push(comment);
        }
      });
  
      if (highestVotesComments.length === 0) {
        throw new Error("No comments found");
      } else if (highestVotesComments.length > 1) {
        throw new Error("Multiple correct answers found");
      }
  
      // Mark the comment with the highest weighingVotes as the correct answer
      const correctComment = highestVotesComments[0];
      correctComment.isCorrect = true;
  
      // Save the updated post
      await post.save();
      socket.emit("correctAnswer",{
        commentId:correctComment._id,
        postId: postId
})
    } catch (error) {
      if (error.message === "Multiple correct answers found") {
        // Call the function to handle multiple correct answers error
        handleMultipleCorrectAnswersCalled = true; // Set the flag to indicate that handleMultipleCorrectAnswers has been called
        if (!repeatDecision) {
          repeatDecision = true;//The question has not been decided. Moving on to the second round.
          handleMultipleCorrectAnswers(postId, organizationId);
        }
      } else {
        console.error("Error marking correct answer:", error);
      }
    }
  }
  

  async function updateSkillsAndScores(organizationId, postId) {
    try {
      // Find the post by postId
      const post = await Post.findOne({
        _id: postId,
      });
  
      if (!post) {
        throw new Error("Post not found");
      }
  
      // Find the organization by organizationId
      const organization = await Organization.findOne({ _id: organizationId });
  
      if (!organization) {
        throw new Error("Organization not found");
      }
  
      // Iterate through the comments
      for (const comment of post.comments) {
        if (comment.isCorrect) {
          const user = organization.users.find(
            (u) => u._id.toString() === comment.userId.toString()
          );
          if (user) {
            // Update score and skill for correct answer
            user.score += 2;
            user.skill += 1;
            if (user.flag === 0) {
              user.flag = 1;
            }
          }
          for (let j = 0; j < comment.votes.length; j++) {
            const vote = comment.votes[j];
            const user = organization.users.find(
              (user) => user._id.toString() === vote.userId
            );
            if (user) {
              user.score += 1;
              user.skill += 1;
              if (user.flag === 0) {
                user.flag = 1;
              }
            }
          }
        } else {
          const user = organization.users.find(
            (u) => u._id.toString() === comment.userId.toString()
          );
          if (user) {
            // Update skill for incorrect answer
            user.skill -= 1;
            if (user.flag === 0) {
              user.flag = 1;
            }
          }
          for (let j = 0; j < comment.votes.length; j++) {
            const vote = comment.votes[j];
            const user = organization.users.find(
              (user) => user._id.toString() === vote?.userId
            );
            if (user) {
              // Update skill for incorrect answer
              user.skill -= 1;
              if (user.flag === 0) {
                user.flag = 1;
              }
            }
          }
        }
      }

      // Emit socket event to render top 3 scoring users
      socket.emit("renderTop3ScoringUsers",{          
      })
  
      // Save the updated organization
      await organization.save();
    } catch (error) {
      console.error("Error updating skills and scores:", error);
      throw new Error("Failed to update skills and scores");
    }
  }
  

router.put('/:postId/comment/:commentId/vote', async (req, res) => {
    const { postId, commentId } = req.params;
    const { userId, confidenceLevel } = req.body;
  
    try {
      const post = await Post.findById(postId);
  
      if (!post) {
        return res.status(404).json("Post not found");
      }
  
      const comment = post.comments.id(commentId);
  
      if (!comment) {
        return res.status(404).json("Comment not found");
      }
  
      const userVoteIndex = comment.votes.findIndex((vote) => vote.userId === userId);
  
      if (userVoteIndex === -1) {
        // User has not voted on this comment, add their vote with confidenceLevel
        comment.votes.push({ userId, confidenceLevel });
      } else {
        // User has already voted, remove their vote
        comment.votes.splice(userVoteIndex, 1);
      }
  
      await post.save();
      res.status(200).json(comment);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // Function to reset votes for a post
  const resetVotes = async (postId) => {
    try {
      // Find the post by postId
      const post = await Post.findById(postId);
      if (!post) {
        throw new Error("Post not found");
      }
  
      // Iterate through each comment in the post
      post.comments.forEach((comment) => {
        if (comment.votes) {
          // Reset the votes array of the comment
          comment.votes = [];
          // Emit a socket event to reset votes for the comment
          socket.emit("resetVotes", {
            commentId: comment._id,
            postId: post._id,
          });
        }
      });

      // Save the updated post
      await post.save();
    } catch (error) {
      console.error("Error resetting votes:", error);
      throw error;
    }
  };
  
  
  

//get a post
router.get("/:id", async(req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get timeline posts
router.get("/:organizationId/timeline/:userId", async(req, res) => {
    try {
        const organization = await Organization.findById(req.params.organizationId);
        const currentUser = organization.users.find(user => user._id.toString() === req.params.userId);
        const userPosts = await Post.find({ $or: [{userId: currentUser._id}, { type: 'event' }] });
        const friendPosts = await Promise.all(
            currentUser.connections.map((friendId) => {
                return Post.find({ userId: friendId, type: { $ne: 'event' } });
            })
        );
        res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
        res.status(500).json(err);
    }
});


router.get("/:postId/getComment/:commentId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const commentId = req.params.commentId;
        // Find the comment with the specified ID
    const comment = post.comments.find(comment => comment._id.toString() === commentId);    
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

//get user's all posts
router.get("/:organizationId/profile/:username", async(req, res) => {
    try {
        const organization = await Organization.findById(req.params.organizationId);
        const user = organization.users.find(user => user.firstName === req.params.username);
        const posts = await Post.find({ userId: user._id.toString() });
        res.status(200).json(posts);

    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;