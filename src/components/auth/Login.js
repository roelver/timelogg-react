import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

import {login} from '../../state/authActions';
import { useStateValue } from '../../util/context';

const Login = function() {

    const [{ auth, error }, dispatch] = useStateValue();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const changeEmail = (evt) => {
        setEmail(evt.target.value);
    } 
    const changePassword = (evt) => {
        setPassword(evt.target.value);
    } 
    
    const doLogin = async (event) => {
        event.preventDefault();
        const action = await login(email, password);
        dispatch(action);
    }

    if (auth && auth.token) {
        return <Redirect to='/entry' />;        
    }

    return (
        <div className="Login">
	        <h3>Please log in to use all features</h3>
            <form onSubmit={doLogin}>
                <div className="form-group">
                    <label htmlFor="email">E-Mail</label>
                    <input className="form-control" type="email" value={email} onChange={changeEmail} id="email"/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input className="form-control" type="password"  value={password} onChange={changePassword} id="password"/>
                </div>
                <div>
                { error ? <Alert className='error'>{error}</Alert> : ''}
                </div>
                <button className="btn btn-light" type="submit">Log In</button>
            </form>

        </div>
    );
}

export default Login;