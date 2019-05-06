import { LOGIN, LOGOUT, LOGIN_FAILED, LOAD_LOGS, UPDATE_DATE } from '../util/constants';

import {clear, persistUser, today} from '../util/helper';

export const initialState = { allDaylogs: [], 
                              currentDate: today(), 
                              auth: {isLoggedIn: false}, 
                              error: '' };
 
const reducer = (state, action) => {
    console.log('>Action', action);
    switch(action.type) {
        case LOGIN:
            persistUser(action.payload);
            return { ...state,
                auth: {
                    userid: action.payload.user._id,
                    token: action.payload.token,
                    email: action.payload.user.email,
                    username: action.payload.user.name,
                    isLoggedIn: true
                },
                currentDate: new Date(),
                error: ''
            };

        case LOGIN_FAILED:
            clear();
            return { ...state,
                auth: {},
                error: action.payload
            };

        case LOAD_LOGS:
            console.log('LOADED', action.payload);
            return { ...state,
                allDaylogs: action.payload,
                error: ''
            };
        case LOGOUT:
            clear();
            return initialState;
        case UPDATE_DATE:
            return { ...state,
                currentDate: action.payload
            }
        default:
            return state;
    }
}

export default reducer;
