import 'whatwg-fetch';
import 'react-mdl/extra/material.js';

import 'react-mdl/extra/css/material.blue_grey-pink.min.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Route,HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import store from './store';
import App from './component/app';
import ScrollToTop from './component/scroll-to-top';

let composeEnhancers;

if (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
} else {
    composeEnhancers = compose;
}

const unleashStore = createStore(store, composeEnhancers(applyMiddleware(thunkMiddleware)));

ReactDOM.render(
    <Provider store={unleashStore}>
        <HashRouter basename="/">
            <ScrollToTop>
                <Route path="/" component={App} />
            </ScrollToTop>
        </HashRouter>
    </Provider>,
    document.getElementById('app')
);
