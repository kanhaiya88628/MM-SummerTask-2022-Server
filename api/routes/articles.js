const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, new Date().toISOString() + file.originalname);
//   },
// });
// const upload = multer({ storage: storage });

const Article = require("../models/article");

router.get("/all", (req, res, next) => {
  Article.find()
    // .select("name date description author views _id")
    .exec()
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
              url: "http://localhost:3000/articles/" + doc._id,
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

router.get("/trending", (req, res, next) => {
  Article.find().sort({views:-1})
    .exec()
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
              url: "http://localhost:3000/articles/" + doc._id,
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
router.post("/", (req, res, next) => {
  const article = new Article({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    date: req.body.date,
    description: req.body.description,
    author: req.body.author,
  });
  article
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Article created successfully",
        createdArticle: {
          name: result.name,
          date: result.date,
          description: result.description,
          author: result.author,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/articles/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:articleId", (req, res, next) => {
  const id = req.params.articleId;
  Article.findOneAndUpdate({ _id: id }, { $inc: { views: 1 } })
    // .select("name date description authors views")
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          article: doc,
          request: {
            type: "GET",
            url: "http://localhost:3000/articles/",
          },
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


router.put("/:articleId", (req, res, next) => {
  const id = req.params.articleId;
  const updateOperations = {};
  for (const operations of req.body) {
    updateOperations[operations.propName] = operations.value;
  }
  Article.updateMany({ _id: id }, { $set: updateOperations })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Article updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/articles/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:articleId", (req, res, next) => {
  const id = req.params.articleId;
  Article.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Article deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/articles",
          body: {
            name: "String",
            date: "Date",
            description: "String",
            author: "String",
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
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
