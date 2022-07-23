const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const articleSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        photo:{
            type:String,
            required: true
            
        },
        date:{
            type: Date,
            required: true
        },
        author: {
            type: ObjectId,
            ref: "Admin"
        },
        views:{
            type: Number,
            default:0            
        },
        likes:{
            type: Number,
            default:0
        }

});

module.exports = mongoose.model('Article', articleSchema);