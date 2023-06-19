const router = require("express").Router();
const Organization = require("../models/Organization");
const User = require("../models/User");

// create a Organization
router.post("/", async(req, res) => {
    const newOrganization = new Organization(req.body)
    try {
        const savedOrganization = await newOrganization.save();
        res.status(200).json(savedOrganization);
    } catch (err) {
        res.status(500).json(err);
    }
});
    


// Update an organization
router.put("/:id", async(req, res) => {
    try {
        const updatedOrganization = await Organization.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
        );
        res.status(200).json(updatedOrganization);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete an organization
router.delete("/:id", async(req, res) => {
    try {
        await Organization.findByIdAndDelete(req.params.id);
        res.status(200).json("Organization deleted successfully.");
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get a single organization by ID
router.get("/:id", async(req, res) => {
    try {
        const organization = await Organization.findById(req.params.id);
        res.status(200).json(organization);
    } catch (err) {
        res.status(500).json(err);
    }
});


router.post("/login/organization", async(req, res) => {
    try {
        const organization = await Organization.findById(req.body.organizationId);
        res.status(200).json(organization);
    } catch (err) {
        res.status(500).json(err);
    }
});


// Get all organizations
router.get("/all/organizations", async (req, res) => {
    try {
      const organizations = await Organization.find();
      res.status(200).json(organizations);
    } catch (err) {
      res.status(500).json(err);
    }
  });


module.exports = router