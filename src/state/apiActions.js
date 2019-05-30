import axios from 'axios';

import {API_URL, LOAD_LOGS, CREATE_DAYLOG, LOAD_FAILED, 
    START_RUNNING, STOP_RUNNING, API_ERROR, UPDATE_DAYLOG,
    DELETE_DAYLOG} from '../util/constants';

import {authHeader, toYYYYMMDD, nowSecs, today } from '../util/helper';
import { logout } from './authActions';

export const loadDaylogs = async (date, token) => {

    const logdate = toYYYYMMDD(date);    
    const response = await axios.get(`${API_URL}/api/daylogs?logdate=${logdate}`, authHeader(token));

    return {
        type: LOAD_LOGS,
        payload: response.data
    }
} 

export const loadDaylogForTask = async (date, taskDesc, token) => {
        const logdate = toYYYYMMDD(date);    
        const response = await axios.get(`${API_URL}/api/daylogs?logdate=${logdate}&taskDesc=${taskDesc}`, authHeader(token));
        return  response.data;
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

export const createTimelog = async (date, taskLog, dispatch, token) => {
    
       const existing =  await loadDaylogForTask(date, taskLog.description, token);
       
        if (!existing) {
            throw Error('Task not found today');
        }
        let running = existing.isRunning;

        if (date === today() && taskLog.log.endTime > nowSecs()) {
            taskLog.log.endTime = undefined;
            running = true;
        }
        const newDaylog = {
                logs: [taskLog.log],
                isRunning: running
            };
        const response = await axios.put(`${API_URL}/api/daylogs/${existing._id}`, newDaylog, authHeader(token) );
        await loadDaylogs(date, token)
                .then(action => {
                    dispatch(action);
                })
                .catch(error => loadError(error)); 
        return {
            type: UPDATE_DAYLOG,
            payload: response.data
        }
    }
    
    export const createDaylog = async (date, token, description = 'New...') => {

    const logdate = toYYYYMMDD(date);

    const newDaylog = {
        logdate,
        description,
        isRunning: false,
        logs: []
    }

    const response = await axios.post(`${API_URL}/api/daylogs`, newDaylog, authHeader(token) );

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
    console.log('UpdateDaylog action', updDaylog);
    const response = await axios.patch(`${API_URL}/api/daylogs/${daylog._id}`, updDaylog, authHeader(token) );
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
    
    const response = await axios.delete(`${API_URL}/api/daylogs/${daylog._id}`, authHeader(token) );

    return {
        type: DELETE_DAYLOG,
        payload: response.data
    }
}
    
export const copyRecentTasks = async (date, dispatch, token) => {
    
    const taskResponse = await axios.get(`${API_URL}/api/tasklist/3`, authHeader(token) );
    const taskResponseToday = await axios.get(`${API_URL}/api/tasklist/0`, authHeader(token) ) || [];
    
    const newTasks = taskResponse.data.filter(task => {
        return !taskResponseToday.data.includes(task);
    });
    for (const task of newTasks) {
        await createDaylog(date, token, task);
    };
    await loadDaylogs(date, token)
        .then(action => {
            dispatch(action);
        })
        .catch(error => loadError(error)); 

}

export const startRunning = async (daylogId, token) => {

    const newlogs = {
        logs: [{
            startTime: nowSecs(),
            comment: ''
        }],
        isRunning: true
    };
    const response = await axios.put(`${API_URL}/api/daylogs/${daylogId}`, newlogs, authHeader(token) );
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

        const response = await axios.patch(`${API_URL}/api/daylogs/${daylog._id}`, updlogs, authHeader(token) );
        return {
            type: STOP_RUNNING,
            payload: response.data
        }
    }
    
    