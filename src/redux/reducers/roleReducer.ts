import { CANCEL_SELECTING_USER } from "./../actions/roleActions";
import { Role, PersonalAccount } from "./../../api";
import {
  RoleActionTypes,
  GET_ALL_ROLES_SUCCESS,
  SEARCH_ADMINISTRATORS_SUCCESS,
  SEARCH_ACCOUNTS_SUCCESS,
  GET_PERSONAL_ACCOUNT_BY_ID_SUCCESS,
  UPDATE_USER_ROLES_SUCCESS
} from "../actions/roleActions";
import { TokenActionTypes, LOGOUT } from "../actions/tokenActions";

export interface RoleState {
  selectedUser?: PersonalAccount;
  users?: PersonalAccount[];
  administrators?: PersonalAccount[];
  roles?: Role[];
}

export default function roleReducer(state = {} as RoleState, action: RoleActionTypes | TokenActionTypes): RoleState {
  switch (action.type) {
    case GET_ALL_ROLES_SUCCESS:
      return { ...state, roles: [...action.roles] };
    case SEARCH_ADMINISTRATORS_SUCCESS:
      return { ...state, administrators: [...action.administrators] };
    case SEARCH_ACCOUNTS_SUCCESS:
      return { ...state, users: [...action.users] };
    case GET_PERSONAL_ACCOUNT_BY_ID_SUCCESS:
      return { ...state, selectedUser: { ...action.selectedUser } };
    case UPDATE_USER_ROLES_SUCCESS:
      return {
        ...state,
        users: state.users
          ? state.users.map(user => (user.id === action.selectedUser.id ? action.selectedUser : user))
          : state.users,
        selectedUser: action.selectedUser
      };
    case CANCEL_SELECTING_USER:
      return {
        ...state,
        selectedUser: {}
      };
    case LOGOUT:
      return {};
    default:
      return state;
  }
}
