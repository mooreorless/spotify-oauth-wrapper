require('dotenv').config('../../env');

const express = require('express');
const queryString = require('query-string');
const randomString = require('randomstring');

const router = express.Router();

const { 
  redirect,
  requestToken,
  refreshToken,
} = require('../../util'); 

let spotify_url = process.SPOTIFY_ACCOUNT_URI;
let scopes = process.env.SCOPES;

router.get('/login', (req, res, next) => {
  return redirect(res, {
    url: `${spotify_url}/authorize`,
    params: {
      response_type: 'code',
      client_id: process.env.CLIENT_ID,
      scopes,
      redirect_uri: process.env.CALLBACK_URI,
      state: randomString.generate(), // helps to validate for auth request
      showDialog: true
    }
  })
});

router.get('/callback', (req, res, next) => {
  if (req.query.error) {
    throw new Error(req.query.error);
  }
  let { code, state } = req.query;

  return requestToken(res, {
    url: `${spotify_url}/api/token`,
    params: {
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.CALLBACK_URI
    }
  })
  .then(data => {
    return redirect(res, {
      url: process.env.FRONTEND_URI,
      params: JSON.parse(data)
    })
  })
  .catch(err => next(err));
});

router.post('/refresh', (req, res, next) => {
  let { refresh_token } = req.query;
  
  return refreshToken(res, {
    url: `${spotify_url}/api/token`,
    params: {
      grant_type: 'refresh_token',
      refresh_token,
    }
  })
  .then(token => {
    if (token) {
      res.send(token);
    }
  })
  .catch(err => next(err));
});


module.exports = router;