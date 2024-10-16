import { csrfFetch } from './csrf';

const SET_USER = 'user/setUser';
const LOGOUT = 'user/logout';

export const setUser = (user) => ({ type: SET_USER, payload: user });
export const logout = () => ({ type: LOGOUT });

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

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case LOGOUT:
      return { ...state, user: null };
    default:
      return state;
  }
};

export default sessionReducer;
