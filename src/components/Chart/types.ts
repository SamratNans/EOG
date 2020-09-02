import { IMatriceTypes } from '../../utils';

export interface IDatasets {
  label: string;
  fill: boolean;
  lineTension: number;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  data: number[];
}
export interface IChartData {
  labels: string[];
  datasets: IDatasets[];
}
export interface IMeasurements {
  at: number;
  value: number;
}
export interface IMultipleMeasurements {
  metric: keyof IMatriceTypes;
  measurements: IMeasurements[];
}
export interface IGetMeasurementsResult {
  data: {
    getMultipleMeasurements: IMultipleMeasurements[];
  };
}

export interface IChartProps {
  options: string[];
}
