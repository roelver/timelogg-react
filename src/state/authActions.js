import axios from 'axios';

import {LOGIN, LOGOUT, LOGIN_FAILED, API_URL } from '../util/constants';

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
