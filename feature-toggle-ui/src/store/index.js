import { combineReducers } from 'redux';
import features from './feature-store';
import input from './input-store';
import history from './history-store'; // eslint-disable-line
import archive from './archive-store';
import error from './error-store';
import clientInstances from './client-instance-store';
import settings from './settings';
import user from './user';
import applications from './application';
 
const unleashStore = combineReducers({
    features,
    input,
    history,
    archive,
    error, 
    clientInstances,
    settings,
    user,
    applications,
});

export default unleashStore;
