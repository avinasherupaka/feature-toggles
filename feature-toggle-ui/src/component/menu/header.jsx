import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header, Navigation } from 'react-mdl';
import { Route } from 'react-router-dom';
import { DrawerMenu } from './drawer';
import Breadcrum from './breadcrumb';

class HeaderComponent extends PureComponent {
    static propTypes = {
        location: PropTypes.object.isRequired,
    };

    componentDidUpdate(nextProps) {
        if (this.props.location.pathname !== nextProps.location.pathname) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                const layout = document.querySelector('.mdl-js-layout');
                const drawer = document.querySelector('.mdl-layout__drawer');
                // hack, might get a built in alternative later
                if (drawer.classList.contains('is-visible')) {
                    layout.MaterialLayout.toggleDrawer();
                }
            }, 10);
        }
    }

    render() {
        const style =  {};
        return (
            <React.Fragment>
                <Header title={<Route path="/:path" component={Breadcrum} />} style={style}>
                    <Navigation>
                        <img src="public/TBD.png" width="32" height="32" />
                    </Navigation>
                </Header>
                <DrawerMenu />
            </React.Fragment>
        );
    }
}

export default (HeaderComponent);
