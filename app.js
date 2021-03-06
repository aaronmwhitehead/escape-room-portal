const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
var hbs = require('express-handlebars');
const dotenv = require('dotenv');

const router = require('./routes/router');

dotenv.config();

var connectWithRetry = function () {
    return mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:54321/haas-escape-rooms', {useNewUrlParser: true}, function (err) {
        if (err) {
            console.error('Failed to connect to mongo on startup - retrying in 1 sec', err);
            setTimeout(connectWithRetry, 1000);
        }
    });
};
connectWithRetry();

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

// Redirect all routes with trailing slashes to the route without
app.use((req, res, next) => {
    const test = /\?[^]*\//.test(req.url);
    if (req.url.substr(-1) === '/' && req.url.length > 1 && !test)
        res.redirect(301, req.url.slice(0, -1));
    else
        next();
});

app.get('/', router.home);

app.get('/book', router.book);
app.post('/book', router.submitForm);

app.get('/confirmation', router.confirmation);
app.get('/faq', router.faq);
app.get('/about', router.about);
app.get('/leaderboard', router.leaderboard);
app.get('/admin', router.admin);

app.get('/404', router.send404);

app.get('*', (req, res) => {
    res.redirect('/404');
});

console.log('Listening on port ', process.env.PORT || 3000 );
app.listen(process.env.PORT || 3000)

