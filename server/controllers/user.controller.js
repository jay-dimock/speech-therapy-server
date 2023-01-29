const {User} = require('../models/user.model');
const bcrypt = require('bcrypt');

module.exports.createUser = (req, res) => {
    //console.log(req.body);
    User.findOne({ email: req.body.email })
        .then(existingUser => {
            //console.log(existingUser);
            if (existingUser !== null) {
                res.status(400).json({errors: { email: {message: "A user already exists with this email" }}});
            } else {
                const user = new User(req.body);
                user
                    .save() //before save, the password confirm validation will happen
                    .then(() => res.json(user))
                    .catch(err => res.status(400).json(err));
            }
        })
        .catch(err => res.status(400).json(err));
}

module.exports.login = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user === null) {
                return res.status(400).json({errors: { email: {message: "Email was not found" }}});
            } 
            bcrypt.compare(req.body.password, user.password)
                .then(bcryptResponse => {
                    //console.log("bcrypt response: ", bcryptResponse);
                    if(!bcryptResponse) {
                        return res.status(400).json({errors: { password: {message: "Password is invalid" }}});
                    } 
                    return res.json({
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        theme: user.theme,
                    });
                })
        })
        .catch(err => res.status(400).json(err));
}

module.exports.updateUser = (req, res) => {
    User.findOneAndUpdate({ _id: req.params.id }, req.body, {new:true})
        .then(user => res.json({user: user}))
            // if (user !== null) {
            //     user.theme = req.body.theme;
            //     user.save();
            // }

        .catch(err => res.status(400).json(err));
}