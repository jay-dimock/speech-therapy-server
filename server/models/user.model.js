const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        minlength:[2,"First name must be at least 2 characters"]},

    lastName: {
        type: String,
        required: [true, "Last name is required"],
        minlength:[2,"Last name must be at least 2 characters"]},

    email: {
        type: String,
        required: [true, "Email is required"],
        validate: {
            validator: val => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
            message: "Email must be in a valid format"
        }},

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"]}, 

    theme: {
        type: String,
        default: "dark",
    }

}, {timestamps: true});

UserSchema.virtual('passwordConfirm')
    .get(() => this._passwordConfirm)
    .set(value => this._passwordConfirm = value);

UserSchema.pre('validate', function(next) {
    if (this.password !== this.passwordConfirm) {
        this.invalidate('passwordConfirm', 'Passwords must match');
    }
    next();
});

UserSchema.pre('save', function(next) {
    bcrypt.hash(this.password, 10)
    .then(hash => {
        this.password = hash;
        next();
    })
})

module.exports.User = mongoose.model("User", UserSchema);