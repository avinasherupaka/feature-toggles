import { connect } from 'react-redux';
import { toggleFeature, fetchFeatureToggles } from '../../store/feature-actions';
import { updateSettingForGroup } from '../../store/settings/actions';

import FeatureListComponent from './list-component';
import { hasPermission } from '../../permissions';

export const mapStateToPropsConfigurable = isFeature => state => {
    const archive = state.archive.toJS()
    const settings = state.settings.toJS().feature || {};
    let features = isFeature ? state.features.toJS() : state.archive.get('list').toArray();
    if (settings.filter) {
        try {
            const regex = new RegExp(settings.filter, 'i');
            features = features.filter(
                feature =>
                    regex.test(feature.name) ||
                    regex.test(feature.description) ||
                    feature.strategies.some(s => s && s.name && regex.test(s.name))
            );
        } catch (e) {
            // Invalid filter regex
        }
    }

    if (!settings.sort) {
        settings.sort = 'name';
    }

    if (settings.sort === 'enabled') {
        features = features.sort((a, b) =>
            // eslint-disable-next-line
            a.enabled === b.enabled ? 0 : a.enabled ? -1 : 1
        );
    } else if (settings.sort === 'created') {
        features = features.sort((a, b) => (new Date(a.createdAt) > new Date(b.createdAt) ? -1 : 1));
    } else if (settings.sort === 'name') {
        features = features.sort((a, b) => {
            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }
            return 0;
        });
    } else if (settings.sort === 'strategies') {
        features = features.sort((a, b) => (a.strategies.length > b.strategies.length ? -1 : 1));
    }

    return {
        archive,
        features,
        settings,
        hasPermission: hasPermission.bind(null, state.user.get('profile')),
    };
};
const mapStateToProps = mapStateToPropsConfigurable(true);
const mapDispatchToProps = {
    toggleFeature,
    fetchFeatureToggles,
    updateSetting: updateSettingForGroup('feature'),
};

const FeatureListContainer = connect( 
    mapStateToProps,
    mapDispatchToProps
)(FeatureListComponent);

export default FeatureListContainer;
