import React from 'react';
import { render } from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { Listings } from './sections/index';
import * as serviceWorker from './serviceWorker';

// instantiate constructor, connect to GraphQL API endpoint via proxy
const client = new ApolloClient({
  uri: "/api"
});

render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Listings title="Listings" />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
