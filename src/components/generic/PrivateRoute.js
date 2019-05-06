import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { useStateValue } from '../../util/context';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const [{ auth }] = useStateValue();
    
    return (
      <Route
        {...rest}
        render={props =>
          auth.isLoggedIn ? (
            <Component {...props} />
          ) : (
            <Redirect to="/login"/>
          )
        }
      />
    );
  }
  
  export default PrivateRoute;
