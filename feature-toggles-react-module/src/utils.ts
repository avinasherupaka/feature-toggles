import { getAllFeatureToggles } from './api';
import * as Cookies from 'js-cookie';

const createErrorMap = (featureNames): Map<String, Boolean> => {
    return featureNames.reduce((toggles, fname) => {
       toggles[fname] = false;
       return toggles;
    }, {});
}

const isValid = (cookie: string = '', env: string = '', featureNames: string[] ) => {
  
  const acceptedEnvirontmentNames = ['dev','develop', 'non-prod', 'uat', 'testing', 'np','production', 'prod', 'prd'];
  const noCookie = !cookie
  const noEnvironment = !env
  const notAValidEnvironmentVariable = !acceptedEnvirontmentNames.includes(env)
  
  if (noCookie || noEnvironment|| notAValidEnvironmentVariable) {
    if(noCookie) {
      console.error(`Feature Toggles Error: Authentication token was not passed.`);
    } else if (noEnvironment){
      console.error(`Feature Toggles Error: Environment variable was not passed.`);
    } else if (notAValidEnvironmentVariable){
      console.error(`Feature Toggles Error: Valid Environment variable was not passed, please visit our docs for the accepted list..`);
    }
    return false;
  }
  return true
}

const featureToggles = async ( featureNames: string[], env: string, token?: string ): Promise<Map<String, Boolean>> => {
  const cookieName = 'aerup-UI';
  const getCookieVal = () => Cookies.get(cookieName);
  const cookie = token ? token : getCookieVal();

  if (!isValid(cookie, env, featureNames)) {
    return createErrorMap(featureNames)
  }

  const prodList = ['production', 'prod', 'prd'];

  try {
    const allFeatureToggles = await getAllFeatureToggles(env, cookie);
    const requestedFeatures = allFeatureToggles.filter(toggle => featureNames.includes(toggle.name));
    return requestedFeatures.reduce((toggles, toggle) => {
      toggles[toggle.name] = prodList.includes(env)
        ? toggle.prodEnabled
        : toggle.nonProdEnabled;
      return toggles;
    }, {});
  } catch(e) {
    console.error(`Feature Toggles Error: ${e.message}`);
    return createErrorMap(featureNames);
  }
};

export { featureToggles, isValid, createErrorMap };