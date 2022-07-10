const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../keys")
const requireLogin = require("../middleware/requireLogin")

router.get("/protected",requireLogin,(req,res) => {
  res.send("hello user")
})

router.post("/signup", (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;
  if (!firstname || !lastname || !email || !password) {
    res.status(422).json({ error: "Please fill in all fields" });
  }

  Admin.findOne({ email: email })
    .then((savedAdmin) => {
      if (savedAdmin) {
        res.status(422).json({ error: "Admin already exist with that email" });
      } else {
        bcrypt.hash(password, 12).then((hashedpassword) => {
          const admin = new Admin({
            firstname,
            lastname,
            email,
            password: hashedpassword,
          });
          admin
            .save()
            .then((admin) => {
              res.json({ message: "save admin success" });
            })

            .catch((err) => {
              console.log(err);
            });
        });
      }
    })

    .catch((err) => {
      console.log(err);
    });
});


router.post('/login',(req,res) => {
  const {email,password} =req.body
  if(!email || !password){
      return res.status(422).json({error:"please add email or password"})
  }
  Admin.findOne({email:email})
  .then(savedAdmin => {
    if(!savedAdmin){
      return res.status(422).json({error:"Invalid Email or password"})
    }
    bcrypt.compare(password,savedAdmin.password)
    .then(doMatch => {
      if(doMatch){
        // res.json({message:"successfully login"})
        const token = jwt.sign({_id:savedAdmin._id},JWT_SECRET)
        const {_id,firstname,lastname,email} = savedAdmin
        res.json({token,admin:{_id,firstname,lastname,email}})
      }
      else{
        return res.status(422).json({error:"Invalid Email or password"})
      }
    })
    .catch(err => {
      console.log(err)
    })
  })
});

module.exports = router;
