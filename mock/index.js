/*
 * Copyright (C) 2019 - 2020 Rabobank Nederland
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
