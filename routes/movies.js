'use strict'

/* --------------------------------------------------
    DO NOT CHANGE ANYTHING BELOW THIS COMMENT
-------------------------------------------------- */


const express = require('express');
const router = express.Router();
module.exports = router;


/* --------------------------------------------------
    DATA
-------------------------------------------------- */


const movies = [];
const requiredKeys = [
    'id',
    'title',
    'director',
    'rating',
    'producer'
];

const missingKeyError = {
    error: ''
};


/* --------------------------------------------------
    RESOURCES
-------------------------------------------------- */


router.get("/movies", (req, res) => {

    res.send(movies);
});

router.post("/movie", (req, res) => {

    const validation = validateBody(req.body);


    // Post request validation


    if (validation.valid_body) {

        const movie = addMovie(req.body);
        res.send(movie);

    } else {
        res.send(validation);
    }
});

router.put("/movie", (req, res) => {

    const validation = validateId(req.body);

    if (validation.valid_id) {

        const updatedMovie = updateMovie(req.body);
        res.send(updatedMovie);

    } else {
        res.send(validation);
    }
});

router.delete("/movie/:id", (req, res) => {

    const deletedMovie = deleteMovie(req.params.id);
    res.send(deletedMovie);
});


/* --------------------------------------------------
    HELPER FUNCTIONS
-------------------------------------------------- */


function validateBody(body) {

    const validation = {
        valid_body: true,
        message: ''
    };

    for (let key of requiredKeys) {

        if (key == 'id') { continue; }
        if (body.hasOwnProperty(key)) { continue; }
        validation.valid_body = false;
        validation.message = 'The ' + key + ' key is missing from the JSON body provided.';
        break;
    }

    for (let key in body) {

        if (body[key].length > 0) { continue; }
        validation.valid_body = false;
        validation.message = 'The ' + key + ' key value is not valid.'
    }

    return validation;
}

function addMovie(body) {

    body.id = getDateTimeStamp();
    movies.push(body);
    return body;
}

function getDateTimeStamp() {

    const date = new Date();
    const timestamp = [];
    timestamp.push(date.getDate());
    timestamp.push(date.getMonth() + 1);
    timestamp.push(date.getFullYear());
    timestamp.push(date.getHours());
    timestamp.push(date.getMinutes());
    timestamp.push(date.getSeconds());
    timestamp.push(date.getMilliseconds());
    return timestamp.join('');
}

function validateId(body) {

    const validation = {
        valid_id: true,
        message: ''
    };

    if (!body.hasOwnProperty('id')) {
        validation.valid_id = false;
        validation.message = 'The id key is missing.';
    }

    if (body.hasOwnProperty('id')) {

        if (body.id.length == 0) {
            validation.valid_id = false;
            validation.message = 'The id key value is not valid.';
        }
    }

    return validation;
}

function updateMovie(body) {

    for (let i = 0; i < movies.length; i++) {

        if (movies[i].id != body.id) { continue; }
        const updatedMovie = movies[i];

        for (let key in updatedMovie) {

            if (key == 'id') { continue; }
            if (!body.hasOwnProperty(key)) { continue; }
            updatedMovie[key] = body[key];
        }

        movies.splice(i, 1, updatedMovie);
        return updatedMovie;
    }

    return {
        valid_id: false,
        message: 'A movie with this id was not found.'
    };
}

function deleteMovie(id) {

    for (let i = 0; i < movies.length; i++) {

        if (movies[i].id != id) { continue; }
        const movie = movies[i];
        movies.splice(i, 1);
        return movie;
    }

    return {
        valid_id: false,
        message: 'A movie with this id was not found.'
    };
}
