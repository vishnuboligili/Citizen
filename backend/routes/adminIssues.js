const express = require('express');
const router = express.Router();
const User = require('../modules/User');
const Issue=require('../modules/Issue');
const transporter = require('../config/nodemail');

// GET /admin/userlist
router.get('/userlist', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }, '-password -otp');// exclude sensitive & unnecessary fields
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    console.error('Error fetching user list:', err.message);
    res.status(500).json({ success: false, message: "⚠️ Failed to fetch UserList" });
  }
});

router.post('/update-user', async (req, res) => {
    try {
      const { id, role, workerType } = req.body;
        console.log(role);
        console.log(workerType);
        console.log(id);
      // Basic validation
      if (!id || !role || !workerType) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }
     
      // Update user role and workerType
      const updatedUser = await User.findOneAndUpdate(
        { _id: id },
        { role: role, workerType: workerType ,isAssigned:false},
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.status(200).json({ success: true, message: "User data updated successfully" });
    } catch (err) {
      console.error('Error updating user:', err.message);
      res.status(500).json({ success: false, message: "⚠️ Failed to update the user data" });
    }
  });

  router.get('/workerlist', async (req, res) => {
    try {
      const workers = await User.find({ role: 'worker' }, '-password -otp');
      res.status(200).json({ success: true, data: workers });
    } catch (err) {
      res.status(500).json({ success: false, message: "⚠️ Failed to fetch worker list" });
    }
  });

  const categoryIndex = {
    light: 0,
    road: 1,
    garbage: 2,
    // ... other categories
  };
  
  router.get('/issues/assigned', async (req, res) => {
    try {
      const uncheckedIssues = await Issue.find({ isChecked: false ,isAssigned:true});
      // console.log(uncheckedIssues);
      const regionMap = new Map();
      const result = [];
  
      uncheckedIssues.forEach(issue => {
        const region = issue.location;
        const category = issue.category;
  
        if (!region || !category || !categoryIndex.hasOwnProperty(category)) return;
  
        if (!regionMap.has(region)) {
          const arr = new Array(Object.keys(categoryIndex).length).fill(0);
          arr[categoryIndex[category]] = 1;
          regionMap.set(region, arr);
          result.push(issue);
        } else {
          const arr = regionMap.get(region);
          if (arr[categoryIndex[category]] === 0) {
            arr[categoryIndex[category]] = 1;
            regionMap.set(region, arr);
            result.push(issue);
          }
        }
      });
      
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      console.error('Error fetching issues:', err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  router.get('/issues/notassigned', async (req, res) => {
    try {
      const uncheckedIssues = await Issue.find({ isChecked: false ,isAssigned:false});
      // console.log(uncheckedIssues);
      const regionMap = new Map();
      const result = [];
  
      uncheckedIssues.forEach(issue => {
        const region = issue.location;
        const category = issue.category;
  
        if (!region || !category || !categoryIndex.hasOwnProperty(category)) return;
  
        if (!regionMap.has(region)) {
          const arr = new Array(Object.keys(categoryIndex).length).fill(0);
          arr[categoryIndex[category]] = 1;
          regionMap.set(region, arr);
          result.push(issue);
        } else {
          const arr = regionMap.get(region);
          if (arr[categoryIndex[category]] === 0) {
            arr[categoryIndex[category]] = 1;
            regionMap.set(region, arr);
            result.push(issue);
          }
        }
      });
      
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      console.error('Error fetching issues:', err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
router.post('/assign',async(req,res)=>{
    const{pincode,issueType,address}=req.body;
    try{
        const availableWorkers = await User.find({
            pincode: pincode,
            role: 'worker',
            workerType: issueType
        });    
        res.status(200).json({success:true,workers:availableWorkers});
    }
    catch (err) {
        console.error('Error fetching issues:', err);
        res.status(500).json({ success: false, message: 'Server error' });
      }
});
router.post('/assignto',async(req,res)=>{
    const{issueId,workerEmail}=req.body;
    console.log(issueId);
    console.log(workerEmail);
    try{
        const place=await Issue.findOne({_id:issueId});
        
        const update=await Issue.updateMany({category:place.category,location:place.location,isChecked:false,},{assignedTo:workerEmail,isAssigned:true})
        console.log(update);

        // await User.findOneAndUpdate({email:workerEmail},{isAssigned:true});

        await transporter.sendMail({
              from: "boligilivishnuvardhan@gmail.com",
              to: workerEmail,
              subject: "Assignation of a Task",
              html: `<p>You have to complete a task at ${place.location}</p>`
            });
        res.status(200).json({ success: true, message: 'Updated successfully' });
    }
    catch (err) {
        console.error('Error fetching issues:', err);
        res.status(500).json({ success: false, message: 'Server error' });
      }
})
router.post('/completed', async (req, res) => {
  const { issueId } = req.body;

  try {
    const place = await Issue.findOne({ _id: issueId });

    const matchingIssues = await Issue.find({
      category: place.category,
      location: place.location,
      assignedTo: place.assignedTo,
      isChecked: false
    });

    await Issue.updateMany(
      {
        category: place.category,
        location: place.location,
        assignedTo: place.assignedTo,
        isChecked: false
      },
      {
        isChecked: true,
        status: place.status,
        AfterImage: place.AfterImage
      }
    );

    const sentEmailSet = new Set();

    if (place.status === 'resolved') {
      for (const issue of matchingIssues) {
        const id = issue.createdBy.toString();
        if (!sentEmailSet.has(id)) {
          sentEmailSet.add(id);
          const userdata = await User.findOne({ _id: id });

          await transporter.sendMail({
            from: "boligilivishnuvardhan@gmail.com",
            to: userdata.email,
            subject: "Problem Solved",
            html: `<p>Your ${issue.category} issue at ${issue.location} was solved by ${issue.assignedTo} today. Thank you for your concern for the society.</p>`
          });
        }
      }

      await User.findOneAndUpdate({ email: place.assignedTo }, { isAssigned: false });

      res.status(200).json({ success: true, message: 'Updated successfully' });

    } else {
      for (const issue of matchingIssues) {
        const id = issue.createdBy.toString();
        if (!sentEmailSet.has(id)) {
          sentEmailSet.add(id);
          const userdata = await User.findOne({ _id: id });

          await User.findOneAndUpdate({ _id: id }, { fake: userdata.fake + 1 });

          await transporter.sendMail({
            from: "boligilivishnuvardhan@gmail.com",
            to: userdata.email,
            subject: "Warning: Fake Problem Raised",
            html: `<p>A fake problem was raised by you at ${issue.location}. If you continue doing this, your account may be blocked by the admin.</p>`
          });
        }
      }

      res.status(200).json({ success: true, message: 'Fake warning emails sent.' });
    }

  } catch (err) {
    console.error('Error processing completion:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
