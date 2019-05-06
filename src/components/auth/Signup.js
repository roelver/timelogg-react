import React from 'react';

const Signup = function() {
    return (
        <div className="Signup">
            <h3>Please sign up first to use this application</h3>
            <form>
                <div className="form-group">
                    <label htmlFor="email">E-Mail</label>
                    <input className="form-control" type="email" id="email"/>
                </div>
                <div className="form-group">
                    <label htmlFor="fullname">Full name</label>
                    <input className="form-control" type="text" id="fullname"/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input className="form-control" type="password" id="password"/>
                </div>
                <div className="form-group">
                    <label htmlFor="password-confirm">Password (confirm)</label>
                    <input className="form-control" type="password" id="password-confirm"/>
                </div>
                <button className="btn btn-light" type="submit">Sign up</button>
            </form>

        </div>
    );
}
export default Signup;
