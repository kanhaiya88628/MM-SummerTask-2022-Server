const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
        name: String,
        date: Date,
        desciption: String,
        author: String

});

module.exports = mongoose.model('Article', articleSchema);