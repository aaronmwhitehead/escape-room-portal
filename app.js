const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
var hbs = require('express-handlebars');
const dotenv = require('dotenv');

const rooms = require('./routes/rooms');
const router = require('./routes/router');

dotenv.config();

mongoose.connect(/*process.env.MONGO_URI ||*/ 'mongodb://127.0.0.1:27017/haas-escape-rooms', {
    auto_reconnect: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    reconnectTries: 10, 
    reconnectInterval: 3000
}).catch(e => console.log('could not connect to mongodb', e));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));
app.set('views', path.join(__dirname, 'views'))
app.set('partials', path.join(__dirname, 'views/partials'))
app.set('view engine', 'hbs'); 

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultView: 'index',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}));

// Redirect all routes with trailing spaces to the route without
app.use((req, res, next) => {
    const test = /\?[^]*\//.test(req.url);
    if (req.url.substr(-1) === '/' && req.url.length > 1 && !test)
        res.redirect(301, req.url.slice(0, -1));
    else
        next();
});

app.get('/', router.home);
app.get('/book', router.book);
app.get('/faq', router.faq);
app.post('/faq', router.faq);
app.get('/about', router.about);
app.get('/leaderboard', router.leaderboard);

app.post('/add/rooms/:id', rooms.create);
app.post('/rooms', rooms.retrieve);
app.post('/update/rooms/:id', rooms.update);
app.post('/delete/rooms/:id', rooms.delete);

app.get('/404', router.send404);

app.get('*', (req, res) => {
    res.redirect('/404');
});

console.log('Listening on port ', process.env.PORT || 3000 );
app.listen(process.env.PORT || 3000)

