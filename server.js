const express = require('express');

const app = express();

// eslint-disable-next-line no-use-before-define
app.get('/users', paginatedResults(users), (req, res) => {
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
