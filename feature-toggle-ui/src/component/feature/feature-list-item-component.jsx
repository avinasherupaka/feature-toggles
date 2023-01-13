import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, ListItem, ListItemAction } from 'react-mdl';
import { UPDATE_FEATURE } from '../../permissions';
import { calc, styles as commonStyles } from '../common';

import styles from './feature.scss';

const Feature = ({
    feature,
    toggleFeature,
    isArchived,
    revive,
    hasPermission,
    onReviveClick
}) => {
    const { name, description, prodEnabled, nonProdEnabled } = feature;
    const featureUrl = toggleFeature === undefined ? `/archive/strategies/${name}` : `/features/strategies/${name}`;

    return (
        <ListItem twoLine>
            <span className={['mdl-list__item-primary-content', styles.listItemLink].join(' ')}>
                <Link to={featureUrl} className={[commonStyles.listLink, commonStyles.truncate].join(' ')}>
                    {name}
                    <span className={['mdl-list__item-sub-title', commonStyles.truncate].join(' ')}>{description}</span>
                </Link>
            </span>


            <span className={[styles.listItemStrategies, commonStyles.hideLt920].join(' ')}>
                {/* TODO: there could be a better way to handle this via redux */}
                {!isArchived &&
                    <span>
                        <span style={{ color: prodEnabled ? "green" : "red" }}> {prodEnabled ? "Prod Enabled" : "Prod Disabled"} </span>
                        <br />
                        <span style={{ color: nonProdEnabled ? "green" : "red" }}> {nonProdEnabled ? "Non-prod Enabled" : "Non-prod Disabled"}  </span>
                    </span>
                }
            </span>



            {revive && hasPermission(UPDATE_FEATURE) ? (
                <ListItemAction style={{ cursor: "pointer" }} onClick={() => onReviveClick(feature.name)}>
                    <Button raised colored>Revive </Button>
                </ListItemAction>
            ) : (
                    <span />
                )}
        </ListItem>
    );
};

Feature.propTypes = {
    feature: PropTypes.object,
    toggleFeature: PropTypes.func,
    settings: PropTypes.object,
    metricsLastHour: PropTypes.object,
    metricsLastMinute: PropTypes.object,
    revive: PropTypes.func,
    hasPermission: PropTypes.func.isRequired,
    isArchived: PropTypes.bool,
};

export default Feature;
