require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3001;
const routes = require('./routes');

app.use(bodyParser.json());
app.use(routes);  

app.listen(port, () => console.log(`Server started on ${port}.`));