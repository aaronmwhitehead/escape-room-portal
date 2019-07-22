const mongoose = require('mongoose');

exports.clear = async () => {
    var collections = ['companies', 'locations', 'rooms', 'franchises'];
    await mongoose.connect('mongodb://127.0.0.1:23456/escapopedia', {
        useNewUrlParser: true,
        useCreateIndex: true
    }).then((db) => {
        collections.forEach((collection) => {
            mongoose.connection.db.dropCollection(collection, (err) => {
                if (err) {
                    return new Error(err);
                }
            });
        });
    }).catch((err) => {
        if(err) {
            return console.log(err);
        }
    });
};