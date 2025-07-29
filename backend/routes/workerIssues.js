const express = require('express');
const router = express.Router();
const User = require('../modules/User');
const Issue=require('../modules/Issue');

const categoryIndex = {
    light: 0,
    road: 1,
    garbage: 2,
    // ... other categories
  };
  

router.post('/issues',async(req,res)=>{
    const {email}=req.body;
    try{
        const uncheckedIssues = await Issue.find({
            isChecked: false,
            isAssigned: true,
            assignedTo: email,
            status: { $in: ['pending', 'progress'] }
          });
          
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
        res.status(200).json({success:true,data:result})
    }
    catch (err) {
        console.error('Error fetching issues:', err);
        res.status(500).json({ success: false, message: 'Server error' });
      }
})

router.put('/issues/status',async(req,res)=>{
    const{email,issueId,status}=req.body;
    try{
        const place=await Issue.findOne({_id:issueId});
        const update=await Issue.updateMany({category:place.category,location:place.location,isChecked:false,assignedTo:email},{status:status});
        console.log(update);
        res.status(200).json({success:true});
    }
    catch (err) {
        console.error('Error fetching issues:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
})
router.post('/issues/submit', async (req, res) => {
    console.log("req.body ===>", req.body);
    const { email, issueId, status, afterImage } = req.body;
  
    try {
      const place = await Issue.findOne({ _id: issueId });
      if (!place) {
        return res.status(404).json({ success: false, message: 'Issue not found' });
      }
  
      const update = await Issue.updateMany(
        {
          category: place.category,
          location: place.location,
          isChecked: false,
          assignedTo: email,
        },
        {
          status,
          AfterImage: afterImage,
        }
      );
  
      res.status(200).json({ success: true });
    } catch (err) {
      console.error('Error submitting issue:', err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  
module.exports = router;