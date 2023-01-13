import React from 'react';
import { Drawer, Icon, Navigation } from 'react-mdl';
import { NavLink } from 'react-router-dom';
import styles from '../styles.scss';

import { baseRoutes as routes } from './routes';

export const DrawerMenu = () => (
    <Drawer className="mdl-color--white">
        <span className={[styles.drawerTitle, 'mdl-layout-title'].join(' ')}>
            <img src="public/logo.png" width="32" height="32" className={styles.drawerTitleLogo} />
            <span className={styles.drawerTitleText}>aerup Toggle</span>
        </span>
        <hr />
        <Navigation className={styles.navigation}>
            {routes.map(item => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={[styles.navigationLink, 'mdl-color-text--grey-900'].join(' ')}
                    activeClassName={[styles.navigationLink, 'mdl-color-text--black', 'mdl-color--blue-grey-100'].join(
                        ' '
                    )}
                >
                    <Icon name={item.icon} className={styles.navigationIcon} /> {item.title}
                </NavLink>
            ))}
        </Navigation>
        <hr />
    </Drawer>
);
