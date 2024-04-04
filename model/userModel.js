const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const UserSchema = new Schema(
    {
        phoneNumber: {
            type: String,
            required: true,
            trim: true,
            immutable: true,
            unique: true,
        },
        points: {
            type: Number,
            default: 0
        }
      
    },
    { timestamps: true }
);

module.exports = Mongoose.model('User', UserSchema);