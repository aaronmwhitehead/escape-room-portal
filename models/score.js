const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    time: String,
    team_name: String, 
    photo: String
}, {
        usePushEach: true
    });

schema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id;

        delete ret.__v;
        delete ret._id;

        return ret;
    }
});

module.exports = mongoose.model('Score', schema);