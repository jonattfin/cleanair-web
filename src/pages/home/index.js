import React, { useEffect, useState } from 'react'
import { Intent, Spinner, Colors } from "@blueprintjs/core"
import _ from 'lodash'
import moment from 'moment'

import { Map, LineGraph } from './components'
import api from '../../api'
import { getLimits } from './limits'
import * as constants from '../../constants'

import styles from './home.module.css'


export default (props) => {
  const [isLoading, setIsLoading] = useState(0);
  const [data, setData] = useState(1);

  const { year = 2020 } = props;
  console.log(`year is ${year}`);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const currentData = await api.getYearAvg(year)

      setIsLoading(false);
      setData(currentData);
    }
    fetchData();
  }, []);

  if (isLoading) {
    return getLoadingScreen()
  }

  return (
    <div className={styles.topContainer}>
      <Map {...getMapData(data)} />
      <div className={styles.separator}>
        {JSON.stringify(getOutsideData(data))}
      </div>
      {constants.measurementTypes.map(type => (
        <div key={type}>
          <LineGraph  {...getLineGraphData(data, type)} type={type} />
          <center>{type}</center>
        </div>
      ))}
    </div>
  )
}

function getLoadingScreen() {
  return (
    <div className={styles.loadingScreen}>
      <Spinner intent={Intent.DANGER} >
      </Spinner>
    </div>
  )
}

function getLineGraphData(data, measurementType) {
  const result = [];

  const groupedBySensorIds = _.groupBy(data, item => item.sensorId);
  _.forEach(groupedBySensorIds, (sensorValue, sensorKey) => {

    const rr = [];
    sensorValue.forEach(item => {
      if (item.obj) {
        const currentItem = item.obj[measurementType];
        if (currentItem) {
          rr.push({
            x: moment(currentItem.stamp * 1000).format("YYYY-MM-DD"),
            y: currentItem.value,
            source: currentItem.source
          });
        }
      }

    });
    result.push({ id: sensorKey, data: rr })
  });

  return {
    data: result
  }
}

function getMapData(data) {
  const measurementType = 'pm25';

  const result = [];

  const groupedBySensorIds = _.groupBy(data, item => item.sensorId);
  _.forEach(groupedBySensorIds, (sensorValue, sensorKey) => {

    sensorValue.forEach(item => {
      if (item.obj) {
        const currentItem = item.obj[measurementType];
        if (currentItem) {
          currentItem.top.forEach((it) => {
            const { latitude, longitude } = it;
            const value = it[measurementType];

            result.push({
              position: [latitude, longitude],
              value,
              color: getColor(it, measurementType),
            })
          })
        }
      }
    });
  });

  return {
    data: result,
    center: [46.770439, 23.591423],
  }
}

function getOutsideData(data) {
  const measurementType = 'pm25';

  const result = {};

  const groupedBySensorIds = _.groupBy(data, item => item.sensorId);
  _.forEach(groupedBySensorIds, (sensorValue, sensorKey) => {
    result[sensorKey] = 0;
    sensorValue.forEach(item => {
      if (item.obj) {
        const currentItem = item.obj[measurementType];
        if (currentItem) {
          if (currentItem.value > 25) {
            result[sensorKey] += 1;
          }
        }
      }
    });
  });

  const array = Object.keys(result).map(function (key) {
    const value = result[key];
    return { sensorId: key, count: value };
  });

  return {
    data: _.orderBy(array, 'count', 'desc'),
  }
}

function getColor(item, type) {
  const limits = getLimits(type);

  for (let i = 0; i < limits.length; i++) {
    const element = limits[i];
    const nextElementValue = limits[i + 1] ? limits[i + 1].val : Number.POSITIVE_INFINITY;

    const itemValue = item[type];
    if (element.val <= itemValue && itemValue < nextElementValue) {
      return element.color;
    }
  }

  return Colors.GREEN5;
}

