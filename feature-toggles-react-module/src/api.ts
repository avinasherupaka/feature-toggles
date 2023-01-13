import fetch from 'node-fetch';

export const getAllFeatureToggles = ( env: string,  token?: string) => {
  const baseUrl = 'https://api-aerup-feature-toggle.agro.services/api';

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    Authorization: `Bearer ${token}`,
    Env: env,
  };

  try {
    return fetch(`${baseUrl}/admin/features`, {
      headers,
      method: 'GET'
    })
      .then(res => res.json())
      .then(data => {
        return data.features;
      })
  } catch (err) {
    console.error(`Feature Toggles Error: Error occured while fetching feature toggles list.`, err);
    throw err;
  }
};
