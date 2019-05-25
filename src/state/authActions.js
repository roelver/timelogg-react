import axios from 'axios';

import {LOGIN, LOGOUT, LOGIN_FAILED, SIGNUP, SIGNUP_FAILED, API_URL } from '../util/constants';

export const login = async (email, password) => {
    try {
        const userInfo = await axios.post(`${API_URL}/api/login`, {email, password});
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

export const signup = async (email, password, name) => {
    try {
        const userInfo = await axios.post(`${API_URL}/api/signin`, {email, password, name});
        return {
            type: SIGNUP,
            payload: userInfo.data
        }
    } catch (error){
        console.log(error);
        return {
            type: SIGNUP_FAILED,
            payload: 'Sign up failed'
        }
    }
}

export const logout = () => {
    return {
        type: LOGOUT
    }
}
