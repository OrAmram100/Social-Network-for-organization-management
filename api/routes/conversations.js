const router = require("express").Router();
const Conversation = require("../models/Conversation");
const Organization = require("../models/Organization");


//new conversation
router.post("/", async (req,res)=>{
    const newConversation = new Conversation({
        members: [req.body.senderID, req.body.recieverID],
    });
    try{
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    }catch(err){
        res.status(500).json;
    }
})

//get conversation of a user
router.get("/:userId",async (req,res)=>{
    try{
        const conversation = await Conversation.find({
            members: { $in: [req.params.userId]},
        });
        res.status(200).json(conversation);
    }
    catch(err){
        res.status(500).json;

    }
})

router.get("/:member1/:member2", async (req, res) => {
    try {
        const conversation = await Conversation.find({
        members: { $all: [req.params.member1, req.params.member2] },
      });
      res.status(200).json(conversation);


    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });



//get conv includes two userId

router.get("/find/:firstUserId/:secondUserId",async(req,res)=>{
    try{
        const conversation = await Conversation.findOne({
            members: { $all: [req.params.firstUserId, req.params.secondUserId]},
        })
        res.status(200).json(conversation);
    }
    catch(err){
        res.status(500).json(err)
    }
})


// Get friends the user has conversations with
router.get("/:organizationId/friends/sidebar/:userId", async (req, res) => {
    try {
        const conversations = await Conversation.find({
          members: { $in: [req.params.userId] },
        });

        const organization = await Organization.findById(req.params.organizationId);

    
        const friendIds = conversations.reduce((friends, conversation) => {
          conversation.members.forEach((member) => {
            if (member !== req.params.userId && !friends.includes(member)) {
              friends.push(member);
            }
          });
          return friends;
        }, []);
    
        const friends = organization.users.filter(user => friendIds.includes(user._id.toString()));

        res.status(200).json(friends);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });
    


module.exports = router;