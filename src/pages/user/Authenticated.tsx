import React from "react";
import { useDispatch } from "react-redux";
import { login, loadProfile } from "../../redux/actions/userActions";
import { Token } from "../../api";

import { useLocation } from "react-router-dom";

export function handleAuthenticationToken() {
  const location = useLocation();
  const dispatch = useDispatch();

  const query = new URLSearchParams(location.search);
  const queryToken = query.get("token");
  if (queryToken) {
    dispatch(login({ token: queryToken } as Token));
    dispatch(loadProfile());
  }
}
