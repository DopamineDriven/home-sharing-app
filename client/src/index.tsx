import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider, useMutation } from "@apollo/react-hooks";
import "./styles/index.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
	AppHeader,
	Home,
	Host,
	Listing,
	Listings,
	Login,
	NotFound,
	User
} from "./sections/index";
import { Affix, Layout } from "antd";
import { Viewer } from "./lib/types";
import { LOG_IN } from './lib/graphql/mutations/LogIn/index';
import { 
	LogIn as LogInData, 
	LogInVariables 
} from './lib/graphql/mutations/LogIn/__generated__/LogIn';
import * as serviceWorker from "./serviceWorker";

const initalViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false
};

// instantiate constructor, connect to GraphQL API endpoint via proxy
const client = new ApolloClient({
	uri: "/api"
});

const App = () => {

	const [viewer, setViewer] = useState<Viewer>(initalViewer);
	console.log(viewer);

	return (
		<Router>
			<Layout id="app">
				<Affix offsetTop={0} className="app__affix-header">
					<AppHeader viewer={viewer} setViewer={setViewer} />
				</Affix>
				<Switch>
					<Route exact path="/" component={Home} />
					<Route exact path="/host" component={Host} />
					<Route exact path="/listing/:id" component={Listing} />
					<Route exact path="/listings/:location?" component={Listings} />
					<Route 
						exact path="/login" 
						render={
							props => <Login {...props} setViewer={setViewer} />
						} 
					/>
					<Route exact path="/user/:id" component={User} />
					<Route component={NotFound} />
				</Switch>
			</Layout>
		</Router>
	);
};

render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<App />
		</ApolloProvider>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
