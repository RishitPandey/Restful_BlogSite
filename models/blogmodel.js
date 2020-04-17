const mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
    name: String,
    image: String,                                                      //What data should be included in the blogpost while creating new one.
    des: String,
    //author: String,
    created: { type: Date, default: Date.now },
    comments: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"comment"
        }
    ]
});

module.exports= mongoose.model('blog', blogSchema);                              //Modelling the database.