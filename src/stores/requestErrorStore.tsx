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
