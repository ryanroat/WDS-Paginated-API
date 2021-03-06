const express = require('express');
const mongoose = require('mongoose');
const User = require('./users');

const app = express();

mongoose.connect('mogodb://localhost/pagination', { useNewUrlParser: true });

const db = mongoose.connection;
db.once('open', async () => {
    if ((await User.countDocuments().exec) > 0) return;

    Promise.all([
        User.create({ name: 'User 1' }),
        User.create({ name: 'User 2' }),
        User.create({ name: 'User 3' }),
        User.create({ name: 'User 4' }),
        User.create({ name: 'User 5' }),
        User.create({ name: 'User 6' }),
        User.create({ name: 'User 7' }),
        User.create({ name: 'User 8' }),
        User.create({ name: 'User 9' }),
        User.create({ name: 'User 10' }),
        User.create({ name: 'User 11' }),
        User.create({ name: 'User 12' })
    ]).then(() => console.log('Added Users'));
});

// eslint-disable-next-line no-use-before-define
app.get('/users', paginatedResults(User), (req, res) => {
    res.json(res.paginatedResults);
});

function paginatedResults(model) {
    return (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};

        if (endIndex < model.length) {
            results.next = {
                page: page + 1,
                limit
            };
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit
            };
        }

        results.results = model.slice(startIndex, endIndex);
        res.paginatedResults = results;
        next();
    };
}

app.listen(3000);
