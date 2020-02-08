import React, { Suspense, lazy } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'

import Home from './home'
import { Header } from '../components'
import * as constants from '../constants'

export default (props) => (
  <Router>
    <div>
      <Header {...props} />
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          {constants.years.map(year => (
            <Route key={year} exact path={`/${year}`}>
              <Home year={year} />
            </Route>
          ))}
        </Switch>
      </Suspense>
    </div>
  </Router>
)
