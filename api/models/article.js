const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
        name: {
            type: String,
            required: true
        },
        date:{
            type: Date,
            required: true
        } ,
        description: {
            type: String,
            required: true
        },
        author: {
            type: String,
            required: true
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