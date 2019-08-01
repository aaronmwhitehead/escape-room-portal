const nodemailer = require('nodemailer');
const Room = require('../models/room');
const Score = require('../models/score');

exports.about = (req, res, next) => {
    res.render('about', { styles: 'about.css' });
};

exports.home = function(req, res, next) {
    res.render('index', { styles: 'index.css' });
};

exports.leaderboard = (req, res, next) => {
    const scores = [];
    Score.find({})
    .then((data) => {
        data.forEach((score) => {scores.push({ time: score.time, team_name: score.team_name, photo: score.photo }) });
    })
    .then(() => {
        const compare = (a, b) => {
            const timeA = Number(a.time.replace(':', ''));
            const timeB = Number(b.time.replace(':', ''));

            let comparison = 0;
            if (timeA > timeB) {
                comparison = 1;
            } else if (timeA < timeB) {
                comparison = -1;
            }
            return comparison;
        }
        scores.sort(compare);
    })
    .catch((err) => {
        return console.log(new Error(err));
    });

    res.render('leaderboard', { styles: 'leaderboard.css', script: 'leaderboard.js', scores });
};

exports.send404 = (req, res, next) => {
    res.render('404', { layout: '', styles: '404.css' });
}

exports.book = (req, res, next) => {
    const today = new Date();
    const allTimes = [];
    const todayTimes = [];
    const today_string = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

    Room.find()
        .then((rooms) => {
            rooms.forEach((room) => {
                allTimes.push({time: room.time, date: room.date, spots_remaining: room.spots_remaining});
            });
        })
        .then(() => {
            Room.find({ date: today_string })
                .then((rooms) => {
                    rooms.forEach((room) => {
                        todayTimes.push(room.time);
                    });
                })
                .then(() => {
                    console.log(allTimes);
                    console.log(todayTimes);
                    res.render('book', { styles: 'book.css', script: 'book.js', date: `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`, allTimes, todayTimes });
                })
                .catch((err) => {
                    return console.log(new Error(err));
                })
        })
        .catch((err) => {
            return console.log(new Error(err));
        })

    
}

exports.submitForm = (req, res, next) => {
    console.log(req.body);
    // Update the database
    const players = Number(req.body.players)*-1;

    Room.findOneAndUpdate({ time: req.body.time, date: req.body.date }, {
        $push: { emails: req.body.email },
    }, { useFindAndModify: false })
    .catch((err) => {
        return console.log(new Error(err));
    })

    Room.findOneAndUpdate({ time: req.body.time, date: req.body.date }, {
        $push: { names: req.body.name },
    }, { useFindAndModify: false })
    .catch((err) => {
        return console.log(new Error(err));
    })

    Room.findOneAndUpdate({ time: req.body.time, date: req.body.date }, {
        $push: { phones: req.body.phone },
        $inc: { spots_remaining: players }
    }, { useFindAndModify: false })
    .catch((err) => {
        return console.log(new Error(err));
    })
    // Send the confirmation email
    let mailOpts, smtpTrans;
    smtpTrans = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    mailOpts = {
        from: `Haas Escape Games <${process.env.EMAIL_USER}>`,
        to: req.body.email,
        subject: `Booking Confirmation`,
        text: `HOORAY! You signed up for 'Are You Smarter Than A Kindergartener?'!`,
        html: `<h3>Haas Escape Games</h3><br>
    <span>Howdy ${req.body.name}!</span><br><br>
    <span>Thank you for booking a time for 'Are You Smarter Than A Kindergartener?'. Your game host will meet you in the <b>Haas TV Lounge</b>. Be sure to arrive at least <b>15 minutes before</b> the start of your game. Your booking details are shown below.</span><br><br>
    <span>Good luck!</span><br><br>
    <h5>Booking Details</h5>
    <span>Date: ${req.body.date}</span><br>
    <span>Time: ${req.body.time}</span><br>
    <span>Participants: ${req.body.players}</span><br>
    <span>Name: ${req.body.name}</span><br>
    <span>Email: ${req.body.email}</span><br>
    <span>Phone: ${req.body.phone}</span><br>`,
    };
    smtpTrans.sendMail(mailOpts, function (error, response) {
        if (error) {
            console.log(error)
        } else {
            console.log('Message sent!');
        }
    });
}

exports.confirmation = (req, res, next) => {
    res.render(`confirmation`, { styles: 'confirmation.css' })
}

exports.faq = (req, res, next) => {
    res.render('faq', { styles: 'faq.css' });
}

// Just added to view raw data from database
exports.admin = (req, res, next) => {
    const data = [];
    Room.find({})
    .then((rooms) => {
        rooms.forEach((room) => {
            data.push({
                date: room.date,
                time: room.time, 
                names: room.names,
                emails: room.emails
            });
        });
    })
    .then(() => {
        function compareDate(a, b) {
            const dateA = Number(a.date.replace(/\//g, ''));
            const dateB = Number(b.date.replace(/\//g, ''));

            let comparison = 0;
            if (dateA > dateB) {
                comparison = 1;
            } else if (dateA < dateB) {
                comparison = -1;
            }
            return comparison;
        }

        return data.sort(compareDate)
    })
    .then((response) => {
        res.send(response);
    })
    .catch((err) => {
        return console.log(new Error(err));
    })
}