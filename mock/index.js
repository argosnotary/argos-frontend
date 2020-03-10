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

const express = require("express");
const app = express();
const config = require("./config.json");

const cors = require("cors");
app.use(cors());

app.get(config.apiUrl, (_req, res) => {
  res.send({});
});

const dummyPersonalAccounts = [
  {
    name: "Henk",
    id: "12sj2a"
  },
  {
    name: "Henk-Jan",
    id: "12sj1a"
  },
  {
    name: "Hans",
    id: "12sj3a"
  },
  {
    name: "Jan",
    id: "12sj4a"
  },
  {
    name: "Jan Pieter",
    id: "12sj5a"
  }
];

app.get(`${config.apiUrl}/personalaccount`, (req, res) => {
  const accounts = dummyPersonalAccounts.filter(account => {
    if (account.name.toLowerCase().indexOf(req.query.name) > -1) {
      return account;
    }
  });

  res.send(accounts);
});

const dummyHierarchy = [
  {
    name: "neo",
    type: "LABEL",
    referenceId: "ed6ad0ee-6741-47f6-aa95-c647ff999641",
    hasChildren: false,
    children: []
  }
];

app.get(`${config.apiUrl}/hierarchy`, (_req, res) => {
  res.send(dummyHierarchy);
});

app.listen(parseInt(config.port), () =>
  console.log(`app is listening on port ${config.port}`)
);
