import React from 'react';
import _ from 'lodash'
import {
  Spinner,
  Intent,
} from "@blueprintjs/core";
import moment from 'moment';

import './App.css';
import LineGraph from './components/LineGraph'
import Map from './components/Map'

import * as adapters from './adapters';

export default class App extends React.Component {
  state = {
    year: 2019,
    type: 'pm10',

    pulseData: [],
    uradData: [],

    isLoadingPulse: false,
    isLoadingUrad: false,
  }

  componentDidMount() {
    this.setState({ isLoadingPulse: true });
    fetch('http://localhost:8080/api/v1/measures/last-year')
      .then(response => response.json())
      .then(data => this.setState({ pulseData: data.measures, isLoadingPulse: false }));

    this.setState({ isLoadingUrad: true });
    fetch('http://localhost:8080/api/v1/measures/last-year-urad')
      .then(response => response.json())
      .then(data => this.setState({ uradData: data.measures, isLoadingUrad: false }));
  }

  renderWhileLoading = () => {
    return (
      <div className="spinner">
        <Spinner intent={Intent.WARNING} size={Spinner.SIZE_LARGE} />
      </div>
    );
  }

  render() {
    const { pulseData, uradData, isLoadingPulse, isLoadingUrad } = this.state;

    if (isLoadingPulse || isLoadingUrad) {
      return this.renderWhileLoading();
    }

    return (
      <div>
        <div className="map_screen">
          <Map data={adapters.toMapFormat(uradData)} />
        </div>
        <div className="container">
          <LineGraph data={adaptPulse(pulseData)} outsideData={getOutsideDataPulse(pulseData)} />
          <LineGraph data={adaptUrad(uradData)} outsideData={[]} />
        </div>
      </div>
    )
  }
}

function adaptPulse(data) {
  const result = [];

  const sentinel = {
    id: 1,
    data: [{
      x: moment("2019-01-01").format("YYYY-MM-DD"),
      y: 0
    }]
  };

  result.push(sentinel);

  const groupedBySensorIds = _.groupBy(data, item => item.sensorId);
  _.forEach(groupedBySensorIds, (sensorValue, sensorKey) => {

    const filteredData = sensorValue.filter(item => item.value > 0);

    var obj = {
      id: sensorKey,
      data: filteredData.map(item => {
        return {
          x: moment(item.stamp).format("YYYY-MM-DD"),
          y: item.value,
        }
      }),
    }

    result.push(obj);
  });

  return result;
}

function adaptUrad(data) {
  const result = [];

  const sentinel = {
    id: 1,
    data: [{
      x: moment("2019-01-01").format("YYYY-MM-DD"),
      y: 0
    }]
  };

  result.push(sentinel);

  const groupedBySensorIds = _.groupBy(data, item => item.sensorId);
  _.forEach(groupedBySensorIds, (sensorValue, sensorKey) => {

    const filteredData = sensorValue.filter(item => item.pm10 > 0);

    var obj = {
      id: sensorKey,
      data: filteredData.map(item => {
        return {
          x: moment(item.stamp * 1000).format("YYYY-MM-DD"),
          y: item.pm10,
        }
      }),
    }

    result.push(obj);
  });

  return result;
}

function getOutsideDataPulse(data) {
  if (!data)
    return [];

  const result = [];

  const groupedBySensorIds = _.groupBy(data, item => item.sensorId);
  _.forEach(groupedBySensorIds, (sensorValue, sensorKey) => {

    const filteredData = sensorValue.filter(item => item.value > 50);

    var obj = {
      id: sensorKey,
      data: filteredData
    };

    result.push(obj);
  });

  return result;
}