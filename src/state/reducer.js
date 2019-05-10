import  * as types  from '../util/constants';

import {clear, persistUser, today} from '../util/helper';

export const initialState = { allDaylogs: [], 
                              currentDate: today(), 
                              auth: {isLoggedIn: false}, 
                              error: undefined };
 
const reducer = (state, action) => {
    console.log('>Action', action);
    switch(action.type) {
        case types.LOGIN:
            persistUser(action.payload);
            return { ...state,
                auth: {
                    userid: action.payload.user._id,
                    token: action.payload.token,
                    email: action.payload.user.email,
                    username: action.payload.user.name,
                    isLoggedIn: true
                },
                currentDate: today(),
                error: undefined
            };

        case types.LOGIN_FAILED:
            clear();
            return { ...state,
                auth: {},
                error: action.payload
            };

        case types.LOAD_LOGS:
            return { ...state,
                allDaylogs: action.payload,
                error: undefined
            };

        case types.LOAD_FAILED:
            return { ...state,
                allDaylogs: [],
                error: action.payload
            };

        case types.API_ERROR:
            return { ...state,
                error: action.payload
            };

        case types.CREATE_DAYLOG:
            return {
                ...state,
                allDaylogs: [...state.allDaylogs, action.payload],
                error: undefined
            };
        case types.DELETE_DAYLOG:
            const delLog = action.payload;
            const nDaylogs = state.allDaylogs.filter(log => log._id !== delLog._id);
            return {
                    ...state,
                    allDaylogs: nDaylogs,
                    error: undefined
                };
        case types.LOGOUT:
            clear();
            return initialState;

        case types.UPDATE_DATE:
            return { ...state,
                currentDate: action.payload
            }

        case types.STOP_RUNNING:
        case types.START_RUNNING:
            const updLog = action.payload;
            const newDayLogs = state.allDaylogs.map(log => {
                if (log._id === updLog._id) {
                    return updLog;
                } else {
                    return log;
                }
            });
            const newState = { ...state,
                allDaylogs: newDayLogs,
                error: undefined
            };
            console.log('Start/Stop reducer', updLog, newState);
            return newState; 

        default:
            return state;
    }
}

export default reducer;
