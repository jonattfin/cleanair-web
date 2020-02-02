import React from 'react'
import { Intent, Spinner, Colors } from "@blueprintjs/core"
import _ from 'lodash'
import moment from 'moment'

import { Map, LineGraph } from './components'
import api from '../../api'
import { getLimits } from './limits'

import styles from './home.module.css'

export default class IndexComponent extends React.Component {
  state = {
    isLoading: false,
    measurementType: '',
    mapData: []
  }

  componentDidMount = async () => {
    this.setState({
      isLoading: true
    })

    const data = await api.getYearAvg('', 2019)

    this.setState({
      isLoading: false,
      mapData: data.measures,
      measurementType: 'pm25'
    })
  }

  render() {
    const { isLoading } = this.state;

    if (isLoading) {
      return getLoadingScreen()
    }

    return (
      <div className={styles.topContainer}>
        <Map {...getMapData(this.state)} />
        <LineGraph {...getLineGraphData(this.state)} />
      </div>
    )
  }
}

function getLoadingScreen() {
  return (
    <div className={styles.loadingScreen}>
      <Spinner intent={Intent.DANGER} >
      </Spinner>
    </div>
  )
}

function getLineGraphData(state) {
  const { mapData, measurementType } = state

  const result = [];

  const sentinel = {
    id: 1,
    data: [{
      x: moment("2019-01-01").format("YYYY-MM-DD"),
      y: 1
    }]
  };

  result.push(sentinel);

  const groupedBySensorIds = _.groupBy(mapData, item => item.sensorId);
  _.forEach(groupedBySensorIds, (sensorValue, sensorKey) => {

    var obj = {
      id: sensorKey,
      data: sensorValue.map(item => {
        return {
          x: moment(item.stamp * 1000).format("YYYY-MM-DD"),
          y: item[measurementType],
        }
      }),
    }

    result.push(obj);
  });

  return {
    data: result
  }
}

function getMapData(state) {
  const { mapData, measurementType } = state

  const result = []

  mapData.forEach(item => {
    item.top.forEach((topItem) => {
      const { latitude, longitude } = topItem;
      const value = topItem[measurementType];

      result.push({
        position: [latitude, longitude],
        value,
        color: getColor(topItem, measurementType),
      })
    })
  })

  return {
    data: result,
    center: [46.770439, 23.591423],
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

