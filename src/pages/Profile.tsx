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
import React from "react";
import styled from "styled-components";

import PageHeader from "../atoms/PageHeader";

import Action from "../types/Action";
import DataRequest from "../types/DataRequest";
import IState from "../interfaces/IState";
import useDataApi from "../hooks/useDataApi";
import useToken from "../hooks/useToken";

interface IProfile extends IState {
  data: {
    name: string;
    email: string;
  };
}

const dataFetchReducer = (state: IProfile, action: Action<IProfile>) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        data: action.results,
        isLoading: false
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        error: action.error,
        isLoading: false
      };
  }
};

const ProfileListItem = styled.li`
  margin: 1rem 0;
`;

const ProfilePage = () => {
  const [token] = useToken();

  const dataRequest: DataRequest = {
    method: "get",
    token,
    url: "/api/personalaccount/me"
  };

  const [result] = useDataApi(dataFetchReducer, dataRequest);

  return (
    <>
      <PageHeader>Profile</PageHeader>
      <ul>
        <ProfileListItem>Name: {result.data?.name}</ProfileListItem>
        <ProfileListItem>Email: {result.data?.email}</ProfileListItem>
      </ul>
    </>
  );
};

export default ProfilePage;
