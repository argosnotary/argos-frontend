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
import { AxiosError } from "axios";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useState
} from "react";

const StoreContext = createContext<[AxiosError, Dispatch<AxiosError>]>([
  {} as AxiosError,
  () => {
    return;
  }
]);

interface IRequestErrorStoreProviderProps {
  children: ReactNode;
}

export const RequestErrorStoreProvider: React.FC<IRequestErrorStoreProviderProps> = ({
  children
}) => {
  const [state, setState] = useState();

  return (
    <StoreContext.Provider value={[state, setState]}>
      {children}
    </StoreContext.Provider>
  );
};

export const useRequestErrorStore = () => useContext(StoreContext);
