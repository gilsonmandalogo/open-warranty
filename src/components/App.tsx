import { Loading } from 'components/Loading';
import { Navbar } from 'components/Navbar';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

export const App = () => (
  <BrowserRouter>
    <Navbar/>
    <React.Suspense fallback={Loading}>
      <Switch>
        <Route exact path="/list" component={ListPage}/>
        <Route exact path="/add" component={AddPage}/>
      </Switch>
    </React.Suspense>
  </BrowserRouter>
)

const ListPage = React.lazy(() => import('pages/list'));
const AddPage = React.lazy(() => import('pages/add'));
