const mongoose = require('mongoose');
const Score = require('../models/score');
const Room = require('../models/room');
const { uniqueNamesGenerator } = require('unique-names-generator');

var collections = ['rooms', 'scores'];
const now = new Date();

mongoose.connect(/*process.env.MONGO_URI ||*/ 'mongodb://127.0.0.1:54321/haas-escape-rooms', {
    auto_reconnect: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    reconnectTries: 10,
    reconnectInterval: 3000
})
.then((db) => {
    collections.forEach((collection) => {
        mongoose.connection.db.dropCollection(collection, (err) => {
            if (err) {
                return new Error(err);
            }
        });
    })
})
.then(() => {
    for(let i = 0; i < 6; i++) {
        for(let j = 0; j < 3; j++) {
            var spots = Math.floor(Math.random() * Math.floor(5));
            Room.create({
                time: `${i+1}:00PM`,
                date: `${now.getMonth() + 1}/${now.getDate() + j}/${now.getFullYear()}`,
                spots_remaining: spots
            })
        }
    }
    for(let i = 0; i < 50; i++) {
        var timeA = Math.floor(Math.random() * (70 - 10)) + 10;
        var timeB = Math.floor(Math.random() * (60 - 10)) + 10;
        Score.create({
            time: `${timeA}:${timeB}`,
            team_name: /*uniqueNamesGenerator()*/'Best Team Name'
        })
    }
})

.catch(e => console.log('could not connect to mongodb', e));
