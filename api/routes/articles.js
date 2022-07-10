const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin")


const Article = require("../models/article");

//get all post
router.get("/all", (req, res, next) => { 
  Article.find()
  .populate("author","_id firstname")
    .then(posts => {
      res.json({posts})
    })
    .catch((err) => {
      console.log(err);
      // res.status(500).json({
      //   error: err,
      // });
    });
});

router.get("/trending", (req, res, next) => {
  Article.find().sort({views:-1})
    .then((docs) => {
      const response = {
        count: docs.length,
        articles: docs.map((doc) => {
          return {
            name: doc.name,
            date: doc.date,
            description: doc.description,
            author: doc.author,
            views: doc.views,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:5000/articles/" + doc._id,
            },
          };
        }),
      };

      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//create new post
router.post("/createpost",requireLogin, (req, res) => {
  const {title,body,date,pic} = req.body
  console.log(title,body,date,pic)
  if(!title || !body || !date || !pic){
    return res.status(422).json({error:"please add all the fields"})
  }
  
  else{
    req.admin.password = undefined
    const article = new Article({
      title,
      body,
      date,
      photo:pic,
      author:req.admin
    })
    article.save().then(result => {
      res.json({article:result})
    })
    .catch(err => {
      console.log(err)
    })
  }
  
});

router.get("/:articleId", (req, res, next) => {
  const id = req.params.articleId;
  Article.findOneAndUpdate({ _id: id }, { $inc: { views: 1 } })
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          article: doc
        });
      } else {
        res.status(404).json({
          message: "No valid entry found for the passed ID",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});


router.put("/:articleId", requireLogin, (req, res, next) => {
  const id = req.params.articleId;
  const updateOperations = {};
  for (const operations of req.body) {
    updateOperations[operations.propName] = operations.value;
  }
  Article.updateOne({ _id: id }, { $set: updateOperations })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Article updated"
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:articleId", requireLogin,(req, res, next) => {
  const id = req.params.articleId;
  Article.findOne({ _id: id })
  .populate("author","_id")
    .exec((err,article) =>{
      if(err || !article){
        return res.status(422).json({error:err})
      }
      if(article.author._id.toString() === req.admin._id.toString()){
        article.remove()
        .then(result =>{
          res.json(result)
        }).catch(err => {
          console.log(err)
        })
      }
    })
    
});

router.post("/:articleId/like", (req, res, next) => {
  const id = req.params.articleId;
  Article.updateOne({ _id: id }, { $inc: { likes: 1 } })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Article liked",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:articleId/unlike", (req, res, next) => {
  const id = req.params.articleId;
  Article.updateOne({ _id: id }, { $: { likes: -1 } })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Article Unliked",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
