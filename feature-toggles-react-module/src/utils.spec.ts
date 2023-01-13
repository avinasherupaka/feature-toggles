import { test } from 'jasmine-gherkin';
import * as api from './api';
import { createErrorMap, isValid, featureToggles } from './utils';

describe('utils', () => {
  let errorMap, validInputs, featureMap, getAllFeatureToggles, featureNames, env, cookie;

  let mockFeatureToggles = [
    { name: 'feature1', nonProdEnabled: true, prodEnabled: false },
    { name: 'feature2', nonProdEnabled: false, prodEnabled: true }
  ];

  test('createErrorMap')
    .given('I have list of feature names')
    .when('The function is invoked', () => {
      featureNames = ['featA', 'featB'];
      errorMap = createErrorMap(featureNames);
    })
    .then('I should see an error map of size 2', () => {
      expect(Object.keys(errorMap).length).toEqual(2);
    })
    .then('feat-1 key should have value of false', () => {
      expect(errorMap['feat-1']).toBeFalsy();
    })
    .then('feat-2 key should have value of false', () => {
      expect(errorMap['feat-2']).toBeFalsy();
    })
    .run();

  test('isValid')
    .given('I need to validate my required feature toggles inputs')
    .when('The function is invoked correctly', () => {
      featureNames = ['featA', 'featB'];
      env = 'np';
      cookie = '1234567890';
      validInputs = isValid(cookie, env, featureNames);
    })
    .then('validInputs should have value of true', () => {
      expect(validInputs).toBeTruthy();
    })
    .when('The function is invoked without a cookie', () => {
      featureNames = ['featA', 'featB'];
      env = 'np';
      cookie = undefined;
      validInputs = isValid(cookie, env, featureNames);
    })
    .then('validInputs should have value of false', () => {
      expect(validInputs).toBeFalsy();
    })
    .when('The function is invoked without an environment', () => {
      featureNames = ['featA', 'featB'];
      env = undefined;
      cookie = '1234567890';
      validInputs = isValid(cookie, env, featureNames);
    })
    .then('validInputs should have value of false', () => {
      expect(validInputs).toBeFalsy();
    })
    .when('The function is invoked with an incorrect environment', () => {
      featureNames = ['featA', 'featB'];
      env = 'basketball';
      cookie = '1234567890';
      validInputs = isValid(cookie, env, featureNames);
    })
    .then('validInputs should have value of false', () => {
      expect(validInputs).toBeFalsy();
    })
    .run();

  test('featureToggles')
    .given(
      'I need to check if my feature toggle is enabled in a specific environment',
      () => {
        const spy = jest.spyOn(api, 'getAllFeatureToggles');
        spy.mockResolvedValue(mockFeatureToggles);
      }
    )
    .when('The function is invoked with acceptable ', async () => {
      featureNames = ['feature1', 'feature2'];
      env = 'np';
      cookie = '1234567890';
      featureMap = await featureToggles(featureNames, env, cookie);
    })
    .then('I should see an feature map', () => {
      expect(featureMap['feature1']).toBeTruthy();
      expect(featureMap['feature2']).toBeFalsy();
    })

    .when(
      'The function is invoked with an invalid environment variable',
      async () => {
        featureNames = ['feature1', 'feature2'];
        env = 'basketball';
        cookie = '1234567890';
        featureMap = await featureToggles(featureNames, env, cookie);
      }
    )
    .then('I should see an feature map with all falses', () => {
      expect(featureMap).toEqual({ feature1: false, feature2: false });
    })

    .when(
      'The function is invoked without a cookie',
      async () => {
        featureNames = ['feature1', 'feature2'];
        env = 'np';
        cookie = undefined;
        featureMap = await featureToggles(featureNames, env, cookie);
      }
    )
    .then('I should see an feature map with all falses', () => {
      expect(featureMap).toEqual({ feature1: false, feature2: false });
    })
    .run();
});
