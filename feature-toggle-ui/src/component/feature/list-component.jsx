import React from 'react';
import PropTypes from 'prop-types';
import Feature from './feature-list-item-component';
import { Link } from 'react-router-dom';
import { Icon, FABButton, Textfield, Menu, MenuItem, Card, CardActions, List } from 'react-mdl';
import { MenuItemWithIcon, DropdownButton, styles as commonStyles } from '../common';
import styles from './feature.scss';
import { CREATE_FEATURE } from '../../permissions';

export default class FeatureListComponent extends React.Component {
    static propTypes = {
        features: PropTypes.array.isRequired,
        fetchFeatureToggles: PropTypes.func,
        fetchArchive: PropTypes.func,
        revive: PropTypes.func,
        updateSetting: PropTypes.func.isRequired,
        toggleFeature: PropTypes.func,
        settings: PropTypes.object,
        history: PropTypes.object.isRequired,
        hasPermission: PropTypes.func.isRequired,
    };

    componentDidMount() {
        if (this.props.fetchFeatureToggles) {
            this.props.fetchFeatureToggles();
        } else {
            this.props.fetchArchive();
        }
    }

    toggleMetrics() {
        this.props.updateSetting('showLastHour', !this.props.settings.showLastHour);
    }

    setFilter(v) {
        this.props.updateSetting('filter', typeof v === 'string' ? v : '');
    }

    onReviveClick = (name)=>{
        const res = confirm("Are you sure you want to revie this feature?")
        if(res){
            this.props.revive(name)
        }
    }

    setSort(v) {
        this.props.updateSetting('sort', typeof v === 'string' ? v.trim() : '');
    }
    render() {
        const {features, toggleFeature, settings, revive, hasPermission } = this.props;
        features.forEach(e => {
            e.reviveName = e.name;
        });
        return (
            <div>
                <div className={styles.toolbar}>
                    <Textfield
                        floatingLabel
                        value={settings.filter}
                        onChange={e => {
                            this.setFilter(e.target.value);
                        }}
                        label="Search"
                        style={{ width: '100%' }}
                    />
                    {hasPermission(CREATE_FEATURE) ? (
                        <Link to="/features/create" className={styles.toolbarButton}>
                            <FABButton accent title="Create feature toggle">
                                <Icon name="add" />
                            </FABButton>
                        </Link>
                    ) : (
                        ''
                    )}
                </div>
                <Card shadow={0} className={commonStyles.fullwidth} style={{ overflow: 'visible' }}>
                    <CardActions>
                        <DropdownButton id="sorting" label={`By ${settings.sort}`} />
                        <Menu
                            target="sorting"
                            onClick={e => this.setSort(e.target.getAttribute('data-target'))}
                            style={{ width: '168px' }}
                        >
                            <MenuItem disabled={settings.sort === 'name'} data-target="name">
                                Name
                            </MenuItem>
                            <MenuItem disabled={settings.sort === 'created'} data-target="created">
                                Created
                            </MenuItem>
                        </Menu>
                    </CardActions>
                    <hr />
                    <List>
                        {features.length > 0 ? (
                            features.map((feature, i) => (
                                <Feature
                                    key={i}
                                    settings={settings}
                                    feature={feature}
                                    toggleFeature={toggleFeature}
                                    revive={revive}
                                    hasPermission={hasPermission}
                                    //TODO: there could be a better way to handle this via redux (store the archived list in redux)
                                    isArchived = { this.props.archive.list.some((f)=> f.name == feature.name)}
                                    onReviveClick = {this.onReviveClick}
                                />
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', marginTop: '50px', color: 'gray' }}>
                                Empty list of feature toggles
                            </p>
                        )}
                    </List>
                </Card>
            </div>
        );
    }
}
