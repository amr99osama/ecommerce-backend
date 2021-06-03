const mongoose = require('mongoose')
// creating database schema to define Attributes of the table
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    StreetAddress: {
        type: String,
        default: ''
    },
    zip: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    apartment: {
        type: String,
        default: ''
    }
})
// userSchema.virtual('id').get(function () {
//     return this._id.toHexString();
// });

// userSchema.set('toJSON', {
//     virtuals: true,
// });
// Data to push to database
exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;