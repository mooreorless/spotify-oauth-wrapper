require('dotenv').config('../.env');

const queryString = require('query-string');
const request = require('request-promise');

let auth = new Buffer(
  `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);
let headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
  Authorization: `Basic ${auth.toString('base64')}`
}

const redirect = (resp, cxt) => {
  let params = queryString.stringify(cxt.params);

  return resp.redirect(
    `${cxt.url}?${params}`
  );
};

const requestToken = (resp, cxt) => {
  return request({
    uri: cxt.url,
    method: 'POST',
    body: queryString.stringify(cxt.params), // as form data
    headers,
  })
};

const refreshToken = (resp, cxt) => {
  return request({
    uri: cxt.url,
    method: 'POST',
    body: queryString.stringify(cxt.params),
    headers,
  })
};


module.exports = { redirect, requestToken, refreshToken };