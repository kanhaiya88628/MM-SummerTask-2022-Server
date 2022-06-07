const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

const Article =  require('./models/article');

router.get('/', (req,res,next) =>{
    Article.find()
    .exec()
    .then(docs => {
        console.log(docs);
        
            res.status(200).json(docs);
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

router.post('/', (req,res,next) =>{
 
    const article =new Article({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        date: req.body.date,
        desciption: req.body.desciption,
        author: req.body.author
    });
    article
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'POST request to /article',
            createdArticle: result
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        })
    });
});

router.get('/:articleId',(req,res,next) =>{
    const id = req.params.articleId;
    Article.findById(id)
    .exec()
    .then(doc => {
        console.log("From database",doc);
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(404).json({
                message:"No valid entry found for the passed ID"
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}); 

router.put('/:articleId',(req,res,next) =>{
    Article.upda
});

router.delete('/:articleId',(req,res,next) =>{
    const id = req.params.articleId;
    Article.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});



module.exports = router;