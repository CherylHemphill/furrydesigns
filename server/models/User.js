const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        match: [/.+@.+\..+/, 'Must match an email address!'],
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
});


userSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

     next();
});

userSchema.methods.matchPassword = async function(password) {
    return  bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);


module.exports = User;
