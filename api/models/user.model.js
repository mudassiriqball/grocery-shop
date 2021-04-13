const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

const User = new Schema({
    mobile: {
        type: String,
        unique: true,
        sparse: true
    },
    fullName: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
    },
    licenseNo: {
        type: String,
    },
    role: {
        type: String,
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    avatar: {
        type: String
    },
    entry_date: {
        type: Date
    },
    is_deleted: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
    },
    cart: [
        {
            p_id: { type: Schema.Types.ObjectId },
            vendor_id: { type: Schema.Types.ObjectId },
            quantity: { type: Number },
            entry_date: { type: Date },
        }
    ]
});

User.plugin(mongoosePaginate);

User.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}

module.exports = mongoose.model("Users", User);