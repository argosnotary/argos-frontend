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

import { AnchorButton, Button, LoaderButton, CancelButton } from "./Button";
import TransparentButton from "./TransparentButton";

export default {
  title: "Buttons"
};

export const anchor = () => <AnchorButton>Click</AnchorButton>;
export const defaultButton = () => <Button>Click</Button>;
export const loaderButton = () => (
  <>
    <LoaderButton buttonType={"button"} loading={false}>
      Click
    </LoaderButton>{" "}
    <LoaderButton buttonType={"button"} loading={true}>
      Click
    </LoaderButton>
  </>
);

export const cancelButton = () => <CancelButton>Cancel</CancelButton>;
export const transparentButto = () => (
  <TransparentButton>Click</TransparentButton>
);
