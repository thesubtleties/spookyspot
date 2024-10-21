import { csrfFetch } from './csrf';

const SET_USER = 'user/setUser';
const LOGOUT_USER = 'user/logout';

export const setUser = (user) => ({ type: SET_USER, payload: user });
export const logoutUser = () => ({ type: LOGOUT_USER });

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch('/session', 'POST', {
    credential,
    password,
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch('/session');
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export const signup = (user) => async (dispatch) => {
  const response = await csrfFetch('/users', 'POST', user);
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export const logout = () => async (dispatch) => {
  const response = await csrfFetch('/session', 'DELETE');
  dispatch(logoutUser());
  return response;
};

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case LOGOUT_USER:
      return { ...state, user: null };
    default:
      return state;
  }
};

export const selectCurrentUserId = (state) => state.session.user?.id;

export default sessionReducer;
