const mongoose = require('mongoose')
const pageSchema = new mongoose.Schema({
    'title':{
        type:String,
        required:true,
    },
    'slug':{
        type:String,
        required:true
    },
    'content':{
        type:String,
        required:true
    },
    'sorting':{
        type:Number,
    }
},{
    timestamps:true
});

const Page = mongoose.model('Page', pageSchema);

module.exports=Page;