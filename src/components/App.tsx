import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { Loading } from 'components/Loading';
import { Navbar } from 'components/Navbar';
import { LoadingOverlayProvider } from 'contexts/LoadingOverlay';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createUploadLink({
    uri: 'http://localhost:4000/graphql',
  }),
});

export const App = () => (
  <BrowserRouter>
    <LoadingOverlayProvider>
      <Navbar/>
      <React.Suspense fallback={<Loading/>}>
        <ApolloProvider client={client}>
          <Switch>
            <Route exact path="/list" component={ListPage}/>
            <Route exact path="/add" component={AddPage}/>
          </Switch>
        </ApolloProvider>
      </React.Suspense>
    </LoadingOverlayProvider>
  </BrowserRouter>
)

const ListPage = React.lazy(() => import('pages/list'));
const AddPage = React.lazy(() => import('pages/add'));
