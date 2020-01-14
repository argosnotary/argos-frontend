const express = require('express');
const app = express();
const config = require('./config.json');

const cors = require('cors');
app.use(cors());

const authenticationMiddleware = (req, res, next) => {
  const authenticationError = JSON.stringify({error: 'Unauthorized'});

  if (
    !req.headers.hasOwnProperty('authorization') ||
    req.headers['authorization'] !== config.authenticationToken
  ) {
    res.status(401);
    return next(authenticationError);
  }

  next();
};
app.use(authenticationMiddleware);

app.get(config.apiUrl, (_req, res) => {
  res.send({});
});

app.listen(parseInt(config.port), () =>
  console.log(`app is listening on port ${config.port}`),
);
