const mongoose = require('mongoose')
const categorySchema = new mongoose.Schema({
    'title': {
        type: String,
        required: true
    },
    'slug': {
        type: String,
        required: true
    }
})

const Category = mongoose.model('Cattegory', categorySchema)

module.exports = Category