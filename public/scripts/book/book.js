$('[data-toggle="datepicker"]').datepicker({
    format: 'm/d/yyyy',
    startDate: new Date('8/30/2019'),
    endDate: new Date('9/8/2019'),
    trigger: '.fa-calendar-day',
    autoShow: true,
    filter: function(date) {
        if (date.getDay() > 0 && date.getDay() < 5) {
            return false; // Disable all Mondays, but still leave months/years, whose first day is a Mondays, enabled.
        }
    }
});
const now = new Date();
const today = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;

// May need to take this out when adding AM times
function compare(a, b) {
    const timeA = Number(a.time.match(/[0-9]+/g)[0]);
    const timeB = Number(b.time.match(/[0-9]+/g)[0]);

    let comparison = 0;
    if (timeA > timeB) {
        comparison = 1;
    } else if (timeA < timeB) {
        comparison = -1;
    }
    return comparison;
}
window.all.sort(compare);

for(let i = 1; i < 5; i++) {
    window.all.unshift(window.all[window.all.length-i]);
}

for(let i = 1; i < 5; i++) {
    window.all.pop();
}

console.log(window.all);

window.all.forEach((slot) => {
    if (slot.date === today) {
        if (slot.spots_remaining == 0) {
            $('.time-picker').append(
                `<div class='btn-time not-available' onclick='chooseTime(this)' data-date='${slot.date}' data-time='${slot.time}' data-available=${slot.spots_remaining}>
                <div class='game-time'>${slot.time}</div>
                <span class='availability'>${slot.spots_remaining} available</span>
            </div>`);
        } else {
            $('.time-picker').append(
                `<div class='btn-time' onclick='chooseTime(this)' data-date='${slot.date}' data-time='${slot.time}' data-available=${slot.spots_remaining}>
                <div class='game-time'>${slot.time}</div>
                <span class='availability'>${slot.spots_remaining} available</span>
            </div>`);
        }
    } else {
        if (slot.spots_remaining == 0) {
            $('.time-picker').append(
                `<div class='btn-time hidden not-available' onclick='chooseTime(this)' data-date='${slot.date}' data-time='${slot.time}' data-available=${slot.spots_remaining}>
                <div class='game-time'>${slot.time}</div>
                <span class='availibility'>${slot.spots_remaining} available</span>
            </div>`);
        } else {
            $('.time-picker').append(
                `<div class='btn-time hidden' onclick='chooseTime(this)' data-date='${slot.date}' data-time='${slot.time}' data-available=${slot.spots_remaining}>
                <div class='game-time'>${slot.time}</div>
                <span class='availibility'>${slot.spots_remaining} available</span>
            </div>`);
        }
    }
});

$('[data-toggle="datepicker"]').on('pick.datepicker', function (ev) {
    const date = new Date(ev.date);
    const currentDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

    document.querySelectorAll(`.btn-time`).forEach((elem) => {
        if (elem.dataset.date === currentDate) {
            elem.classList.remove('hidden');
        } else {
            elem.classList.add('hidden');
        }
    });
});

function chooseTime(target) {
    if (![...target.classList].includes('not-available')) {
        document.querySelectorAll('.btn-time').forEach((elem) => {
            elem.classList.remove('active');
        });

        target.classList.add('active');
    }
}

// FORM VALIDATION
function emailIsValid(email) {
    return /\S+@\S+\.\S+/.test(email)
}

function phoneIsValid(phone) {
    return /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(phone)
}

// Be sure to check that the time classList has 'active' and doesn't have 'hidden' in order for a time to be chosen!
function checkForm() {
    // Clear errors
    document.querySelectorAll('.error').forEach((err) => { err.style.opacity = 0 });

    // Validate form
    const inputs = document.querySelectorAll('input'); 
    const slot = document.querySelector('.active');
    const players = document.querySelector('.counter-value').dataset.value;

    if(!slot) {
        document.querySelector('.time-err').style.opacity = '1';
        $('.time-err').fadeIn('fast').delay(2000).fadeOut('slow', () => {
            document.querySelector(`.time-err`).style.display = 'block';
            document.querySelector(`.time-err`).style.opacity = '0';
        });
        return;
    }

    const classes = [...new Set(slot.classList)]; 

    for (var i = 0; i < inputs.length; i++) {
        // Validate email field
        if(inputs[i].name === 'email') {
            if(!emailIsValid(inputs[i].value)) {
                document.querySelector(`.err${i + 1}`).style.opacity = '1';
                $(`.err${i + 1}`).fadeIn('fast').delay(2000).fadeOut('slow', () => {
                    document.querySelector(`.err${i + 1}`).style.display = 'block';
                    document.querySelector(`.err${i + 1}`).style.opacity = '0';
                });
                return;
            }
        }
        if (inputs[i].name === 'phone') {
            if (!phoneIsValid(inputs[i].value)) {
                document.querySelector(`.err${i + 1}`).style.opacity = '1';
                $(`.err${i + 1}`).fadeIn('fast').delay(2000).fadeOut('fast');
                return;
            }
        }
        if (!inputs[i].value) {
            document.querySelector(`.err${i + 1}`).style.opacity = '1';
            $(`.err${i + 1}`).fadeIn('fast').delay(2000).fadeOut('fast', () => {
                document.querySelector(`.err${i + 1}`).style.display = 'block';
                document.querySelector(`.err${i + 1}`).style.opacity = '0';
            });
            return;
        }
    }

    if(classes.includes('hidden')) {
        document.querySelector('.time-err').style.opacity = '1';
        $('.time-err').fadeIn('fast').delay(2000).fadeOut('fast');
        return;
    }

    if (slot.dataset.available < players) {
        document.querySelector('.player-err').style.opacity = '1';
        $('.player-err').fadeIn('fast').delay(2000).fadeOut('fast');
        return;
    }

    // Gather data
    const data = {
        name: inputs[0].value,
        email: inputs[1].value,
        phone: inputs[2].value,
        time: slot.dataset.time,
        date: slot.dataset.date,
        players: players
    };

    $.post(`${window.location.href}`, data)
        .done(function() {
            console.log('howdy');
            window.location.replace(`${window.location.origin}/confirmation`)
        })
        .fail(function() {
            window.location.replace(`${window.location.origin}/book`)
            window.alert('An error occurred. Please try again.');
        })
}


