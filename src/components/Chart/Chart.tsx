import React, { useEffect } from 'react';
import { Provider, createClient, useQuery } from 'urql';
import { Line } from 'react-chartjs-2';
import { MatriceTypes, metricQuery, IMatriceTypes } from '../../utils';
import { IChartProps, IGetMeasurementsResult, IChartData, IMeasurements } from './types';

const defaultChartValue: IChartData = {
  labels: [],
  datasets: [],
};
const MatriceColorList: IMatriceTypes = {
  flareTemp: '#6600CC',
  waterTemp: '#608f0c',
  casingPressure: '#FFC300',
  tubingPressure: '#FF5733',
  oilTemp: '#C70039',
  injValveOpen: '#900C3F',
};
const MatriceBorderColor: IMatriceTypes = {
  flareTemp: '#6600ccaa',
  waterTemp: '#608f0caa',
  casingPressure: '#FFC300aa',
  tubingPressure: '#FF5733aa',
  oilTemp: '#C70039aa',
  injValveOpen: '#900C3Faa',
};

const formatTime = (d: Date | number) => {
  if (typeof d === 'number') d = new Date(d);
  const hr = d.getHours();
  const min = d.getMinutes();

  return `${hr}:${min < 10 ? '0' + min : min}`;
};
export interface IMeasurementsMap {
  [key: string]: IMeasurements;
}
export const convertMeasurementsData = (measurements: IMeasurements[]) => {
  const measurementsMap = measurements.reduce(
    (a, { at, value }) => {
      a[formatTime(at)] = { at, value };
      return a;
    },
    {} as IMeasurementsMap,
  );
  return Object.values(measurementsMap).sort((a, b) => a.at - b.at);
};

const { query, url } = metricQuery;
const maxDataPoints = 200;
const client = createClient({ url });

const Chart = (props: JSX.IntrinsicAttributes & IChartProps) => (
  <Provider value={client}>
    <ChartComp {...props} />
  </Provider>
);

const ChartComp = (props: IChartProps) => {
  const { options } = props;
  const [fetchedData, setFetchedData] = React.useState(defaultChartValue);
  const getMeasurements = () => {
    const after = new Date().getTime() - 30 * 60 * 1000;
    return { input: options.map(metricName => ({ metricName, after })) };
  };
  const [result] = useQuery({
    query,
    variables: getMeasurements(),
  });
  const { data } = result as IGetMeasurementsResult;
  useEffect(() => {
    if (data && data.getMultipleMeasurements) {
      const { getMultipleMeasurements } = data;
      const dataValue = getMultipleMeasurements.reduce(
        (a: IChartData, b) => {
          let { metric, measurements } = b;
          measurements = convertMeasurementsData(measurements);
          measurements = measurements
            .reverse()
            .slice(0, maxDataPoints)
            .reverse();
          a.labels = measurements.map(({ at: time }) => formatTime(new Date(time)));
          const backgroundColor = MatriceColorList[metric];
          const borderColor = MatriceBorderColor[metric];
          const label = MatriceTypes[metric];
          a.datasets.push({
            label,
            fill: false,
            lineTension: 0.5,
            backgroundColor,
            borderColor,
            borderWidth: 1,
            data: measurements.map(({ value }) => value),
          });
          return a;
        },
        { labels: [], datasets: [] },
      );
      setFetchedData(dataValue);
    }
  }, [data]);
  return (
    <Line
      data={fetchedData}
      options={{
        title: {
          display: true,
          text: 'Measurements Matricees',
          fontSize: 20,
        },
        legend: {
          display: true,
          position: 'right',
        },
      }}
    />
  );
};

export default Chart;