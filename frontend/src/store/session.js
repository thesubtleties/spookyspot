import { csrfFetch, restoreCSRF } from './csrf';
import Cookies from 'js-cookie';

const SET_USER = 'user/setUser';
const LOGOUT_USER = 'user/logout';

export const setUser = (user) => ({ type: SET_USER, payload: user });
export const logoutUser = () => ({ type: LOGOUT_USER });

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;

  console.log('Login attempt:', {
    hasCSRFToken: !!Cookies.get('XSRF-TOKEN'),
    allCookies: Cookies.get(),
    timestamp: new Date().toISOString(),
  });

  try {
    const response = await csrfFetch('/session', 'POST', {
      credential,
      password,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Login response not ok:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        hasCSRFToken: !!Cookies.get('XSRF-TOKEN'),
      });
      throw new Error(
        errorData.message || 'The provided credentials were invalid'
      );
    }

    const data = await response.json();
    console.log('Login successful:', {
      userId: data.user?.id,
      hasCSRFToken: !!Cookies.get('XSRF-TOKEN'),
    });

    dispatch(setUser(data.user));
    return data;
  } catch (error) {
    console.error('Login failed:', {
      error: error.message,
      status: error.status,
      hasCSRFToken: !!Cookies.get('XSRF-TOKEN'),
      stack: error.stack,
    });
    throw error;
  }
};

export const restoreUser = () => async (dispatch) => {
  try {
    const response = await csrfFetch('/session');
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  } catch (error) {
    console.error('Session restore failed:', error);
  }
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
