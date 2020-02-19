import IState from "../interfaces/IState";
import Action from "../types/Action";

const genericDataFetchReducer = (state: IState, action: Action<IState>) => {
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

export default genericDataFetchReducer;
