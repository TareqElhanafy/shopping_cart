const mongoose = require('mongoose')
const Category = require('./category')
const productSchema = new mongoose.Schema({
    'name': {
        type: String,
        required: true,
    },
    'slug':{
        type:String,
        required:true
    },
    'category_id': {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: Category
    },
    'price': {
        type: Number,
        required:true
    },
    'image': {
        type: String,
        required:true
    }
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product