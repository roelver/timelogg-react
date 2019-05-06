import axios from 'axios';

import {LOGIN, LOGOUT, LOGIN_FAILED, API_URL, UPDATE_DATE, LOAD_LOGS} from '../util/constants';

import {authHeader, toYYYYMMDD } from '../util/helper';

export const login = async (email, password) => {
    try {
        const userInfo = await axios.post(`${API_URL}/login`, {email, password});
        return {
            type: LOGIN,
            payload: userInfo.data
        }
    } catch (error){
        console.log(error);
        return {
            type: LOGIN_FAILED,
            payload: 'Login failed'
        }
    }
}

export const logout = () => {
    return {
        type: LOGOUT
    }
}

export const updateDate = (newDate) => {
    return {
        type: UPDATE_DATE,
        payload: newDate
    }
} 

export const loadDaylogs = async (date, token) => {

    console.log('Get data for', date);
    const logdate = toYYYYMMDD(date);    
    const response = await axios.get(`${API_URL}/daylogs?logdate=${logdate}`, authHeader(token));

    return {
        type: LOAD_LOGS,
        payload: response.data
    }
} 