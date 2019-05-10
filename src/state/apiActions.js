import axios from 'axios';

import {API_URL, LOAD_LOGS, CREATE_DAYLOG, LOAD_FAILED, 
    START_RUNNING, STOP_RUNNING, API_ERROR, UPDATE_DAYLOG,
    DELETE_DAYLOG} from '../util/constants';

import {authHeader, toYYYYMMDD, nowSecs } from '../util/helper';
import { logout } from './authActions';

export const loadDaylogs = async (date, token) => {

    console.log('Get data for', date);
    const logdate = toYYYYMMDD(date);    
    const response = await axios.get(`${API_URL}/daylogs?logdate=${logdate}`, authHeader(token));

    return {
        type: LOAD_LOGS,
        payload: response.data
    }
} 

export const loadError = (error) => {
    if (error.message.indexOf('401') > 0) {
        return logout();
    }
    return {
        type: LOAD_FAILED,
        payload: error.message
    }
}

export const apiError = (error) => {
    if (error.message.indexOf('401') > 0) {
        return logout();
    }
    return {
        type: API_ERROR,
        payload: error.message
    }
}

export const createDaylog = async (date, token) => {

    const logdate = toYYYYMMDD(date);

    const newDaylog = {
        logdate,
        description: 'New...',
        isRunning: false,
        logs: []
    }

    const response = await axios.post(`${API_URL}/daylogs`, newDaylog, authHeader(token) );

    return {
        type: CREATE_DAYLOG,
        payload: response.data
    }
}

export const updateDaylog = async (daylog, currentDate, dispatch, token) => {
    
    const updDaylog = {
        logs: daylog.logs,
        description: daylog.description,
        isRunning: daylog.isRunning
    }
    console.log('Updating', updDaylog);
    const response = await axios.patch(`${API_URL}/daylogs/${daylog._id}`, updDaylog, authHeader(token) );
    await loadDaylogs(currentDate, token)
       .then(action => {
            dispatch(action);
        })
       .catch(error => loadError(error)); 
    return {
        type: UPDATE_DAYLOG,
        payload: response.data
    }
}
    
export const deleteDaylog = async (daylog, token) => {
    
    const response = await axios.delete(`${API_URL}/daylogs/${daylog._id}`, authHeader(token) );

    return {
        type: DELETE_DAYLOG,
        payload: response.data
    }
}
    
export const startRunning = async (daylogId, token) => {

    const newlogs = {
        logs: [{
            startTime: nowSecs(),
            comment: ''
        }],
        isRunning: true
    };
    const response = await axios.put(`${API_URL}/daylogs/${daylogId}`, newlogs, authHeader(token) );
    return {
        type: START_RUNNING,
        payload: response.data
    }
}

export const stopRunning = async (daylog, token) => {

        const logLen = daylog.logs.length;
        const lastLog = daylog.logs[logLen-1];
        lastLog.endTime = nowSecs();
        daylog.logs[logLen-1] = lastLog;
        
        const updlogs = {
            logs: [...daylog.logs ],
            isRunning: false
        };

        const response = await axios.patch(`${API_URL}/daylogs/${daylog._id}`, updlogs, authHeader(token) );
        return {
            type: STOP_RUNNING,
            payload: response.data
        }
    }
    
    