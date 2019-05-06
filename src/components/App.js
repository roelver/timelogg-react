import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { StateProvider } from '../util/context';
import reducer, {initialState} from '../state/reducer';

import PrivateRoute from './generic/PrivateRoute';

import TlHeader from './generic/TlHeader';
import TlFooter from './generic/TlFooter';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Entry from './Entry';
import Summary from './Summary';
import About from './About';

function App() {
	
	let startState = {...initialState};
	const authData = localStorage.getItem('user');
	if (authData) {
		const auth = JSON.parse(authData);
		auth.isLoggedIn = true;
		console.log('From localStorage', auth);
		startState = { ...initialState, auth};
	}
	const current = localStorage.getItem('currentDate');
	if (current) {
		startState.currentDate = current;
	}
	

  return (
    <div className="App">
			<StateProvider initialState={startState} reducer={reducer}>
				<BrowserRouter>
					<TlHeader></TlHeader>
						<div className="container">
							<Switch>
								<Route path="/login" component={Login}/>
								<Route path="/signup" component={Signup}/>
								<PrivateRoute path="/summary" component={Summary}/>
								<PrivateRoute path="/entry" component={Entry}/>
								<PrivateRoute path="/about" component={About}/>
								<PrivateRoute path="/" exact component={Entry}/>
							</Switch>
						</div>
					<TlFooter></TlFooter>
				</BrowserRouter>
			</StateProvider>
		</div>
	);
}

export default App;
