import React, { useState, useEffect, useRef } from "react";
import { render } from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider, useMutation } from "@apollo/react-hooks";
import { StripeProvider, Elements } from "react-stripe-elements";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
	AppHeader,
	Home,
	Host,
	Listing,
	Listings,
	Login,
	NotFound,
	Stripe,
	User
} from "./sections";
import { Affix, Spin, Layout } from "antd";
import { Viewer } from "./lib/types";
import { LOG_IN } from './lib/graphql/mutations';
import { 
	LogIn as LogInData, 
	LogInVariables 
} from './lib/graphql/mutations/LogIn/__generated__/LogIn';
import { AppHeaderSkeleton, ErrorBanner } from './lib/components';
import "./styles/index.css";
import * as serviceWorker from "./serviceWorker";

// instantiate constructor, connect to GraphQL API endpoint via proxy
// https://www.apollographql.com/docs/react/get-started/#configuration-options
const client = new ApolloClient({
	uri: "/api",
	request: async operation => {
		const token = sessionStorage.getItem("token");
		operation.setContext({
			headers: {
				"X-CSRF-TOKEN": token || ""
			}
		});
	}
});

const initalViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false
};

const App = () => {
	const [viewer, setViewer] = useState<Viewer>(initalViewer);
	const [logIn, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
		onCompleted: data => {
			if (data && data.logIn) {
				setViewer(data.logIn);

				data.logIn.token 
					? sessionStorage.setItem("token", data.logIn.token)
					: sessionStorage.removeItem("token");
			}
		}
	});
	const logInRef = useRef(logIn);

	useEffect(() => {
		logInRef.current()
	}, []);

	const logInErrorBannerElement = error ? (
		<ErrorBanner description="unable to verify authenticated status; please try again"/>
	) : null;

	return !viewer.didRequest && !error ? (
		<Layout className="app-skeleton">
			<AppHeaderSkeleton />
			<div className="app-skeleton__spin-section">
				<Spin size="large" tip="Launching App" />
			</div>
		</Layout>
		) : (
		<StripeProvider apiKey={process.env.REACT_APP_S_PUBLISHABLE_KEY as string}>
			<Router>
				<Layout id="app">
					{logInErrorBannerElement}
					<Affix offsetTop={0} className="app__affix-header">
						<AppHeader viewer={viewer} setViewer={setViewer} />
					</Affix>
					<Switch>
						<Route exact path="/">
							<Home />
						</Route>
						<Route exact path="/host" >
							<Host viewer={viewer} />
						</Route>
						<Route exact path="/listing/:id" >
							<Elements>
								<Listing viewer={viewer} />
							</Elements>
						</Route>
						<Route exact path="/listings/:location?">
							<Listings />
						</Route>
						<Route exact path ="/login">
							<Login setViewer={setViewer} />
						</Route>
						<Route exact path="/stripe">
							<Stripe viewer={viewer} setViewer={setViewer} />
						</Route>
						<Route exact path="/user/:id">
							<User viewer={viewer} setViewer={setViewer} />
						</Route>
						<Route>
							<NotFound />
						</Route>
					</Switch>
				</Layout>
			</Router>
		</StripeProvider>
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
