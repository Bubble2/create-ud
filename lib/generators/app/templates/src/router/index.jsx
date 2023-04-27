import React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import renderRoutes from './renderRoutes';
import routes from './routes';

export default class RootRouter extends React.Component {
    render () {
        return (
            <Router>
                {renderRoutes(routes)}
            </Router>
        )
    }
}