import React from 'react';
import PropTypes from 'prop-types';
import { ProgressBar, Button, Card, CardText, CardTitle, CardActions, Textfield, Switch, Snackbar } from 'react-mdl';
import { Link } from 'react-router-dom';

import HistoryComponent from '../history/history-list-toggle-container';
import { styles as commonStyles } from '../common';
import { CREATE_FEATURE, DELETE_FEATURE, UPDATE_FEATURE } from '../../permissions';

export default class ViewFeatureToggleComponent extends React.Component {
    isFeatureView;
    isSnackbarActive = false;
    snackbarMessage;
    constructor(props) {
        super(props);
        this.isFeatureView = !!props.fetchFeatureToggles;
    }


    static propTypes = {
        activeTab: PropTypes.string.isRequired,
        featureToggleName: PropTypes.string.isRequired,
        features: PropTypes.array.isRequired,
        toggleFeature: PropTypes.func,
        removeFeatureToggle: PropTypes.func,
        revive: PropTypes.func,
        fetchArchive: PropTypes.func,
        fetchFeatureToggles: PropTypes.func,
        editFeatureToggle: PropTypes.func,
        featureToggle: PropTypes.object,
        history: PropTypes.object.isRequired,
        hasPermission: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.isSnackbarActive = false;
        if (this.props.features.length === 0) {
            if (this.isFeatureView) {
                this.props.fetchFeatureToggles();
            } else {
                this.props.fetchArchive();
            }
        }
    }

    render() {
        const {
            featureToggle,
            features,
            revive,
            // setValue,
            featureToggleName,
            toggleFeature,
            removeFeatureToggle,
            hasPermission,
        } = this.props;
        if (!featureToggle) {
            if (features.length === 0) {
                return <ProgressBar indeterminate />;
            }
            return (
                <span>
                    Could not find the toggle{' '}
                    {hasPermission(CREATE_FEATURE) ? (
                        <Link
                            to={{
                                pathname: '/features/create',
                                query: { name: featureToggleName },
                            }}
                        >
                            {featureToggleName}
                        </Link>
                    ) : (
                            featureToggleName
                        )}
                </span>
            );
        }

        const removeToggle = () => {
            if (
                // eslint-disable-next-line no-alert
                window.confirm('Are you sure you want to remove this toggle?')
            ) {
                removeFeatureToggle(featureToggle.name);
                this.props.history.push('/features');
            }
        };
        const reviveToggle = () => {
            revive(featureToggle.name);
            this.props.history.push('/features');
        };
        const updateFeatureToggle = e => {
            let feature = { ...featureToggle, description: featureToggle.description };
            if (Array.isArray(feature.strategies)) {
                feature.strategies.forEach(s => {
                    delete s.id;
                });
            }
            if(this.props.errors.list.length == 0){
                this.isSnackbarActive = true
                this.snackbarMessage = "Saved Changes"
            }
            this.props.editFeatureToggle(feature)
        };
        const setValue = (v, event) => {
            featureToggle[v] = event.target.value;
            this.forceUpdate();
        };

        return (
            <div>
                <Card shadow={0} className={commonStyles.fullwidth} style={{ overflow: 'visible' }}>
                    <CardTitle style={{ paddingTop: '24px', wordBreak: 'break-all' }}>{featureToggle.name}</CardTitle>
                    <CardText>
                        {this.isFeatureView && hasPermission(UPDATE_FEATURE) ? (
                            <div>
                                <Textfield
                                    floatingLabel
                                    style={{ width: '100%' }}
                                    rows={1}
                                    label="Description"
                                    required
                                    value={featureToggle.description}
                                    onChange={v => setValue('description', v)}
                                />
                            </div>
                        ) : (
                                <Textfield
                                    disabled
                                    floatingLabel
                                    style={{ width: '100%' }}
                                    rows={1}
                                    label="Description"
                                    required
                                    value={featureToggle.description}
                                />
                            )}
                    </CardText>

                    <CardActions
                        border
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <span style={{ paddingRight: '24px' }}>
                                {hasPermission(UPDATE_FEATURE) ? (
                                    <Switch
                                        disabled={!this.isFeatureView}
                                        checked={featureToggle.nonProdEnabled}
                                        onChange={() => {
                                            featureToggle.nonProdEnabled = !featureToggle.nonProdEnabled
                                            this.forceUpdate()
                                        }
                                        }
                                    >
                                        {featureToggle.nonProdEnabled ? 'Non Prod Enabled' : 'Non Prod Disabled'}
                                    </Switch>
                                ) : (
                                        <Switch disabled ripple checked={featureToggle.nonProdEnabled}>
                                            {featureToggle.nonProdEnabled ? 'Non Prod Enabled' : 'Non Prod Disabled'}
                                        </Switch>
                                    )}
                            </span>
                            <span style={{ paddingRight: '24px' }}>
                                {hasPermission(UPDATE_FEATURE) ? (
                                    <Switch
                                        disabled={!this.isFeatureView}
                                        checked={featureToggle.prodEnabled}
                                        onChange={() => {
                                            featureToggle.prodEnabled = !featureToggle.prodEnabled
                                            this.forceUpdate()
                                        }
                                        }
                                    >
                                        {featureToggle.prodEnabled ? 'Prod Enabled' : 'Prod Disabled'}
                                    </Switch>
                                ) : (
                                        <Switch disabled ripple checked={featureToggle.prodEnabled}>
                                            {featureToggle.prodEnabled ? 'Prod Enabled' : 'Prod Disabled'}
                                        </Switch>
                                    )}
                            </span>
                        </div>
                        {this.isFeatureView ? (
                            <div>
                                <Button
                                    disabled={!hasPermission(DELETE_FEATURE)}
                                    onClick={removeToggle}
                                    accent
                                    style={{ flexShrink: 0 }}
                                >
                                    Archive
                            </Button>

                                <Button
                                    onClick={updateFeatureToggle}
                                    style={{ flexShrink: 0, color: '#4242b1' }}
                                    primary
                                >
                                    Save
                            </Button>
                            </div>
                        ) : (
                                <Button
                                    disabled={!hasPermission(UPDATE_FEATURE)}
                                    onClick={reviveToggle}
                                    style={{ flexShrink: 0 }}
                                >
                                    Revive
                            </Button>
                            )}
                    </CardActions>
                </Card>
                <br />
                <Card shadow={0} className={commonStyles.fullwidth} style={{ overflow: 'visible' }}>
                    <div style={{ padding: '16px' }}>
                        <HistoryComponent toggleName={featureToggleName} />
                    </div>
                </Card>
                <Snackbar
                    active={this.isSnackbarActive}
                    onTimeout={()=>this.isSnackbarActive =false}
                    timeout={3000}
                    >{this.snackbarMessage}</Snackbar>
            </div>
        );
    }
}
