import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

import {signup} from '../../state/authActions';
import { useStateValue } from '../../util/context';

const Signup = function() {

    const [{ auth, error }, dispatch] = useStateValue();
    
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [password2, setPassword2] = useState('');
        const [name, setName] = useState('');
        
        const changeEmail = (evt) => {
            setEmail(evt.target.value);
        } 
        const changePassword = (evt) => {
            setPassword(evt.target.value);
        } 
        const changePassword2 = (evt) => {
            setPassword2(evt.target.value);
        } 
        const changeName = (evt) => {
            setName(evt.target.value);
        } 
        const doSignup = async (event) => {
            event.preventDefault();

            const action = await signup(email, password, name);
            dispatch(action);
        }

        const isValid = () => {
            return email && password && password2 && name && password === password2;
        }
    
        if (auth && auth.token) {
            return <Redirect to='/entry' />;        
        }
        
    return (
        <div className="Signup">
            <h3>Please sign up first to use this application</h3>
            <form onSubmit={doSignup}>
                <div className="form-group">
                    <label htmlFor="email">E-Mail</label>
                    <input className="form-control" type="email" id="email" value={email} onChange={changeEmail}/>
                </div>
                <div className="form-group">
                    <label htmlFor="fullname">Full name</label>
                    <input className="form-control" type="text" id="fullname" value={name} onChange={changeName}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input className="form-control" type="password" id="password" value={password} onChange={changePassword}/>
                </div>
                <div className="form-group">
                    <label htmlFor="password-confirm">Password (confirm)</label>
                    <input className="form-control" type="password" id="password-confirm" value={password2} onChange={changePassword2}/>
                </div>
                <Alert>{error}</Alert>
                <button className="btn btn-light" type="submit" disabled={!isValid}>Sign up</button>
            </form>

        </div>
    );
}
export default Signup;
