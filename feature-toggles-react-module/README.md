# aerup Feature Toggles
This is the NPM package for checking if your toggle is enabled.

## Installation 

```bash
npm i @aerup/aerup-feature-toggles
```

## Implementation

### Best Practices

Name your feature toggles after your Aha! ID for the feature you are toggling.

### Example in React UI

```js
import { FeatureToggles, FeatureTogglesContext } from '@aerup/aerup-feature-toggles';
```

```jsx
<FeatureToggles features={['aerup-7845']} env={environmentVariable}>
  <FeatureTogglesContext.Consumer>
    {features => (
      features['aerup-7845'] &&
      <div>
       Hello World
      </div>
    )}
  </FeatureTogglesContext.Consumer>
</FeatureToggles>
```
Example for using more than one toggle.

```jsx
<FeatureToggles features={['aerup-7845', 'aerup-7654']} env={environmentVariable}>
  <FeatureTogglesContext.Consumer>
    {features => (
      features['aerup-7654'] &&
      <div>
       Hello aerup
      </div>
    )}
  </FeatureTogglesContext.Consumer>
  <FeatureTogglesContext.Consumer>
    {features => (
      features['aerup-7845'] &&
      <div>
       Hello World
      </div>
    )}
  </FeatureTogglesContext.Consumer>
</FeatureToggles>
```

## Example in Node API

```js
import { featureToggles } from '@aerup/aerup-feature-toggles/dist/server';
```

```js
const features = ['aerup-7845']

const featureToggle = await featureToggles(features, ENVIRONMENT)
                              .then( result => return result['aerup-7845'] )// false
```
