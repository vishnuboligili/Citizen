const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const Issue = require('../modules/Issue');

// POST /user/issue - Create a new issue
router.post('/issue', fetchUser, async (req, res) => {
  try {
    const { description, category, location, image ,pincode} = req.body;

    if (!description || !category || !location || !image) {
      return res.status(400).json({ message: "❌ All fields are required." });
    }

    const newIssue = new Issue({
      description,
      category,
      location,
      image,
      pincode,
      createdBy: req.user.id,
    });

    await newIssue.save();

    res.status(201).json({ message: "✅ Issue submitted successfully.", issue: newIssue });
  } catch (err) {
    console.error("Issue creation error:", err);
    res.status(500).json({ message: "⚠️ Internal server error." });
  }
});



router.get('/myissues', fetchUser, async (req, res) => { //
    try {
      const userId = req.user.id;
      const issues = await Issue.find({ createdBy: userId });
      res.json({ success: true, issues });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "⚠️ Failed to fetch issues" });
    }
  });
  

module.exports = router;
