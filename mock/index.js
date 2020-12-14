/*
 * Argos Notary - A new way to secure the Software Supply Chain
 *
 * Copyright (C) 2019 - 2020 Rabobank Nederland
 * Copyright (C) 2019 - 2021 Gerard Borst <gerard.borst@argosnotary.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
const express = require("express");
const app = express();
const config = require("./config.json");

const cors = require("cors");
app.use(cors());

app.get(config.apiUrl, (_req, res) => {
  res.send({});
});

const mePersonalAccount = {
  id: "06125d50-b0e6-4015-8b8b-6a72eb16e929",
  name: "Luke Skywalker",
  email: "luke@skywalker.imp",
  roles: [
    {
      id: "fe9fe1b5-5eff-4b93-8fa4-1edd743e1726",
      name: "administrator",
      permissions: [
        "READ",
        "LOCAL_PERMISSION_EDIT",
        "TREE_EDIT",
        "VERIFY",
        "ASSIGN_ROLE"
      ]
    }
  ]
};

const dummyPersonalAccounts = [
  {
    id: "9199f4c3-6643-4a89-9daa-b84eb62aa186",
    name: "Luke Skywalker",
    email: "luke@skywalker.imp",
    permissions: ["READ", "LAYOUT_ADD", "TREE_EDIT"]
  },
  {
    id: "9199f4c3-6643-4a89-9daa-b84eb62aa187",
    name: "Leah Organa",
    email: "leah@organa.imp",
    permissions: ["READ", "LAYOUT_ADD", "VERIFY"]
  },
  {
    id: "9199f4c3-6643-4a89-9daa-b84eb62aa189",
    name: "Han Solo",
    email: "han@solo.imp",
    permissions: ["LAYOUT_ADD"]
  }
];

app.get(`${config.apiUrl}/personalaccount/me`, (_req, res) => {
  res.send(mePersonalAccount);
});

app.get(
  `${config.apiUrl}/personalaccount/:accountId/localpermission/:labelId`,
  (req, res) => {
    res.send(
      dummyPersonalAccounts.find(account => account.id === req.params.accountId)
    );
  }
);

app.get(`${config.apiUrl}/personalaccount`, (req, res) => {
  if (req.query.localPermissionsLabelId) {
    res.send(dummyPersonalAccounts);
  }

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
