import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { Loading } from 'components/Loading';
import { Navbar } from 'components/Navbar';
import { host } from 'config';
import { LoadingOverlayProvider } from 'contexts/LoadingOverlay';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import typePolicies from 'typePolicies';

const client = new ApolloClient({
  cache: new InMemoryCache({ typePolicies }),
  // @ts-ignore
  link: createUploadLink({
    uri: `${host}/graphql`,
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
