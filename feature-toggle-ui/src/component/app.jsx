import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Layout, Content, Grid, Cell } from 'react-mdl';
import { Route, Redirect, Switch } from 'react-router-dom';
import styles from './styles.scss';
import ErrorContainer from './error/error-container';
import Header from './menu/header';
import Features from '../page/features';
import { routes } from './menu/routes';

export default class App extends PureComponent {
    static propTypes = {
        location: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    };

    render() {
        return (
            <div className={styles.container}>
                <Layout fixedHeader>
                    <Header location={this.props.location} />
                    <Content className="mdl-color--grey-50">
                        <Grid noSpacing className={styles.content}>
                            <Cell col={12}>
                                <Switch>
                                    <Route
                                        exact
                                        path="/"
                                        render={() => <Redirect to="/features" component={Features} />}
                                    />
                                    {routes.map(route => (
                                        <Route key={route.path} path={route.path} component={route.component} />
                                    ))}
                                </Switch>
                                <ErrorContainer />
                            </Cell>
                        </Grid>
                    </Content>
                </Layout>
            </div>
        );
    }
}
