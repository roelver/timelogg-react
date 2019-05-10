import React from 'react';
import { NavLink, Link } from "react-router-dom";

import { useStateValue } from '../../util/context';

import { logout } from '../../state/authActions';

const TlHeader = function() {

    const [{ auth: { username, isLoggedIn} }, dispatch ] = useStateValue();
    
    const doLogout = () => {
        dispatch(logout());
    }
    
    return (
        <div className="header">
            <img src="img/timelogg_logo.png" alt="Timelog Logo" className="logo"/>
            <div className="active-user">{username}</div>
            <div className="navbar">
                { isLoggedIn ?
                   <div className="nav">
                        <div className="nav-item">
                            <NavLink to="/entry">Entry</NavLink>
                        </div>
                        <div className="nav-item">
                            <NavLink to="/summary">Summary</NavLink>
                        </div>
                        <div className="nav-item">
                            <NavLink to="/about">About</NavLink>
                        </div>
                    </div>
               : <div className="nav"/>
               }
                { isLoggedIn ?
                    <div className="nav nav-right">
                        <div className="nav-item">
                            <Link to="/login" onClick={doLogout}>Logout</Link>
                        </div>
                    </div>
                    :
                    <div className="nav nav-right">
                        <div className="nav-item">
                            <NavLink to="/signup">Sign up</NavLink>
                        </div>
                        <div className="nav-item">
                            <NavLink to="/login">Login</NavLink>
                        </div>
                </div> }
            </div>

        </div>
    );
}

export default TlHeader;