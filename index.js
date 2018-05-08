require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const queryString = require('querystring');
const request = require('request');

const app = express();
const port = process.env.PORT;
app.use(bodyParser.json());

const redirect_uri = process.env.REDIRECT_URI;

app.get('/auth', (req, res) => {
  let params = queryString.stringify({
    response_type: 'code',
    client_id: process.env.CLIENT_ID,
    scope: 'user-read-private user-read-email',
    redirect_uri
  });

  res.redirect(`${process.env.AUTHORIZE_URI}?${params}`);
});

app.get('/callback', (req, res) => {
  if (req.query.error) {
    throw new Error(req.query.error);
  }
  let authHeader = new Buffer(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);
  let code = req.query.code;
  let options = {
    url: process.env.TOKEN_URI,
    form: {
      code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      Authorization: `Basic ${authHeader.toString('base64')}`
    },
  };
  
  request.post(options, (err, response, body) => {
    let data = JSON.parse(body) || {};
    let access_token = data.access_token;
    let uri = process.env.FRONTEND_URI;

    res.redirect(`${uri}?access_token=${access_token}`);
  })
});

// app.post('/token', (req, res) => {});

// app.post('/refresh', (req, res) => {});

// don't need these for spotify - need to refactor and make this cleaner, and actually understand oauth better
// setup form object way better, and see what new Buffer actually does before claiming it's my code and that I
// understand it.

app.listen(port, () => console.log(`Server running on port ${port}`));