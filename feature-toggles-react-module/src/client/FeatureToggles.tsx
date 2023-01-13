import { createContext, useEffect, useState, Dispatch, SetStateAction } from 'react';
import * as React from 'react';
import { featureToggles as buildFeatureToggles  } from '../utils';

export interface FeatureToggleProps {
  features: Array<string>;
  env: string;
  children: React.ReactNode;
}

const FeatureTogglesContext = createContext({})

const FeatureToggles = ({ features, env, children }: FeatureToggleProps) => {
    const [featureToggles, setFeatureToggles]: [{}, Dispatch<SetStateAction<{}>>] = useState([]);
    useEffect(() => {
      let isSubscribed = true;
      buildFeatureToggles(features, env)
        .then(featureData => {
          if (isSubscribed) {
            setFeatureToggles(featureData);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      return () => {
        isSubscribed = false;
      };
    }, []);

    return (
      <FeatureTogglesContext.Provider value={featureToggles}>
        {children}
      </FeatureTogglesContext.Provider>
    )
};

export { FeatureToggles, FeatureTogglesContext };
