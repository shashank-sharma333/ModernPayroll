const express = require("express");
const router = express.Router();
const User = require("../models/user")

router.post("/register", async(req, res) => {
  
    const {name , email , password, role, walletId} = req.body

    const newUser = new User({name , email , password, role, walletId})

    try {
        newUser.save()
        res.send('User Registered successfully')
    } catch (error) {
         return res.status(400).json({ message: error });
    }

});


router.post("/login", async(req, res) => {

    const {email,password} = req.body

    try {
        
        const user = await User.find({email,password})

        if(user.length > 0)
        {
            const currentUser = {
                name : user[0].name , 
                email : user[0].email, 
                isAdmin : user[0].isAdmin, 
                _id : user[0]._id,
                walletId: user[0].walletId,
                role:user[0].role
            }
            res.send(currentUser);
        }
        else{
            return res.status(400).json({ message: 'User Login Failed' });
        }

    } catch (error) {
           return res.status(400).json({ message: 'Something went weong' });
    }
  
});

router.post("/getDetailsByEmail", async(req, res) => {

    const {email} = req.body

    try {
        
        const user = await User.find({email})

        if(user.length > 0)
        {
            const currentUser = {
                name : user[0].name , 
                email : user[0].email, 
                isAdmin : user[0].isAdmin, 
                _id : user[0]._id,
                walletId: user[0].walletId,
                role:user[0].role
            }
            res.send(currentUser);
        }
        else{
            return res.status(400).json({ message: 'User Login Failed' });
        }

    } catch (error) {
           return res.status(400).json({ message: 'Something went weong' });
    }
  
});


router.get("/getallusers", async(req, res) => {

    try {
        const users = await User.find({role: "employee"})
        res.send(users)
    } catch (error) {
        return res.status(400).json({ message: error });
    }
  
});

router.post("/rewards", async(req, res) => {

    const {email} = req.body
    try {
        const user = await User.find({email:email})
        res.send(user)
    } catch (error) {
        return res.status(400).json({ message: error });
    }
  
});

router.put("/updatereward", async(req, res) => {

    const {email,reward} = req.body;
    var new_reward = reward + 100;
    try {
        const user = await User.findOneAndUpdate({email:email},{$set:{rewards: new_reward}});
        //console.log(user);
        res.send("successful");
    } catch (error) {
        return res.status(400).json({ message: error });
    }
  
});

router.put("/reducereward", async(req, res) => {

    const {email,reward} = req.body;
    var new_reward = reward;
    if(reward >= 100){
        new_reward = reward - 100;
    }
    
    try {
        const user = await User.findOneAndUpdate({email:email},{$set:{rewards: new_reward}});
        console.log(new_reward);
        res.send("successful");
    } catch (error) {
        return res.status(400).json({ message: error });
    }
  
});

router.put("/updateUserPayrollStatus", async(req, res) => {
    console.log(req, res);
    const {email} = req.body;
    try {
        const user = await User.findOneAndUpdate({email:email},{$set:{isPayrollRegistered: true}});
        res.send("successful");
    } catch (error) {
        return res.status(400).json({ message: error });
    }
  
});

router.put("/updateUserSalary", async(req, res) => {
    console.log(req, res);
    const {email, newSalary} = req.body;
    try {
        const user = await User.findOneAndUpdate({email:email},{$set:{salary: newSalary}});
        res.send("successful");
    } catch (error) {
        return res.status(400).json({ message: error });
    }
  
});

router.post("/deleteuser", async(req, res) => {
  
    const userid = req.body.userid

    try {
        await User.findOneAndDelete({_id : userid})
        res.send('User Deleted Successfully')
    } catch (error) {
        return res.status(400).json({ message: error });
    }

});

router.post("/getPayrollUnregisteredUsers", async (req, res) => {
    const { isPayrollRegistered } = req.body;
    try {
      const bookings = await User.find({ isPayrollRegistered: false });
      res.send(bookings);
    } catch (error) {
      return res.status(400).json({ message: "Something went wrong" });
    }
  });

module.exports = router