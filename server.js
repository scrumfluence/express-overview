'use strict'

const port = process.env.PORT || 3000;
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//------------------------------------------------------------------

app.use('/', require('./routes/movies'));

//------------------------------------------------------------------

app.listen(port, () => console.log(`Listening on port ${port}...`));