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
import { createStore, applyMiddleware, compose } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import reduxImmutableStateInvariant from "redux-immutable-state-invariant";
import tokenRefreshMiddleware from "../pages/user/tokenRefreshMiddleware";
import thunk from "redux-thunk";

import token from "../pages/user/tokenSlice";
import profile from "../pages/user/profileSlice";
import key from "../pages/key/keySlice";
import apiCallsInProgress from "../pages/common/apiStatusSlice";
import role from "../pages/settings/roleSlice";
import refreshing from "../pages/user/tokenRefreshSlice";
import tree from "../pages/explorer/treeSlice";
import label from "../pages/label/labelSlice";
import users from "../pages/common/usersSlice";
import localPermissions from "../pages/label/localPermissionsSlice";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  token,
  profile,
  key,
  apiCallsInProgress,
  role,
  refreshing,
  tree,
  label,
  users,
  localPermissions
});

export type RootState = ReturnType<typeof rootReducer>;

const persistConfig = {
  key: "root",
  storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const win: any = window as any;

const composeEnhancers =
  typeof window === "object" && win.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? win.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

export default () => {
  const store = createStore(
    persistedReducer,
    composeEnhancers(applyMiddleware(tokenRefreshMiddleware, reduxImmutableStateInvariant(), thunk))
  );
  const persistor = persistStore(store);
  return { store, persistor };
};
