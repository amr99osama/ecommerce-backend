const mongoose = require('mongoose')
// creating database schema to define Attributes of the table
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String
    },
    icon: {
        type: String
    },
})
// Data to push to database
exports.Category = mongoose.model('categories', categorySchema);