import { IMatriceTypes } from './types';

const url = 'https://react.eogresources.com/graphql';
const query = `
    query ($input: [MeasurementQuery]) {
      getMultipleMeasurements(input: $input) {
        metric
        measurements {
          at
          value
          metric
          unit
          __typename
        }
        __typename
      }
      __typename
    }`;

export const metricQuery = {
  query,
  url,
};

export const MatriceTypes: IMatriceTypes = {
  flareTemp: 'Flare Temp',
  waterTemp: 'Water Temp',
  casingPressure: 'Casing Pressure',
  tubingPressure: 'Tubing Pressure',
  oilTemp: 'Oil Temp',
  injValveOpen: 'Inj Valve Open',
};