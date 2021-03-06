// Actions
export const LOGIN = '#LOGIN';
export const LOGIN_FAILED = '#LOGIN_FAILED';
export const SIGNUP = '#SIGNUP';
export const SIGNUP_FAILED = '#SIGNUP_FAILED';
export const LOGOUT = '#LOGOUT';

export const UPDATE_DATE = '#UPDATE_DATE';
export const LOAD_LOGS = '#LOAD_LOGS';
export const LOAD_FAILED = '#LOAD_FAILED';
export const CREATE_DAYLOG = '#CREATE_DAYLOG';
export const UPDATE_DAYLOG = '#UPDATE_DAYLOG';
export const DELETE_DAYLOG = '#DELETE_DAYLOG';
export const API_ERROR = '#API_ERROR';

export const START_RUNNING = '#START_RUNNING';
export const STOP_RUNNING = '#STOP_RUNNING';

// API_URL must be empty on Heroku. When running on dev (localhost) the API runs on port 3000
export const API_URL =
   window.location.hostname.indexOf('localhost') >= 0
      ? 'http://localhost:3001'
      : '';
