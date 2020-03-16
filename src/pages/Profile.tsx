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

import DataRequest from "../types/DataRequest";
import useDataApi from "../hooks/useDataApi";
import useToken from "../hooks/useToken";
import { customGenericDataFetchReducer } from "../stores/genericDataFetchReducer";

interface IProfile {
  name: string;
  email: string;
}

interface IProfileApiReponse {
  isLoading: boolean;
  data: IProfile;
}

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

  const [profileApiResponse] = useDataApi<IProfileApiReponse, IProfile>(
    customGenericDataFetchReducer,
    dataRequest
  );

  return (
    <>
      <PageHeader>Profile</PageHeader>
      <ul>
        <ProfileListItem>Name: {profileApiResponse.data?.name}</ProfileListItem>
        <ProfileListItem>
          Email: {profileApiResponse.data?.email}
        </ProfileListItem>
      </ul>
    </>
  );
};

export default ProfilePage;
