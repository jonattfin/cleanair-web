
import _ from 'lodash';

import { getLimits } from './limits';

export const mainTypes = ['pm10', 'pm25'];
export const otherTypes = ['temperature', 'humidity'];

export function toSunburstFormat(data) {
  const groupedByCity = _.groupBy(data, item => item.city);

  const rootObject = {
    name: 'Planet Earth',
    children: [],
  };

  _.forEach(groupedByCity, (values, key) => {
    const parents = [];
    mainTypes.forEach(type => {
      const children = [];

      const limits = getLimits(type);
      for (let i = 0; i < limits.length; i++) {
        const element = limits[i];
        const nextElementValue = limits[i + 1] ? limits[i + 1].val : Number.POSITIVE_INFINITY;

        const numberOfElements = values.filter(d => element.val <= d[type] && d[type] < nextElementValue).length;
        children.push({ name: element.label, color: element.color, loc: numberOfElements });
      }

      parents.push({ name: type, children });
    })

    rootObject.children.push({
      name: key,
      children: parents,
    });
  });

  return rootObject;
}

export function toMapFormat(data) {
  const result = [];

  data.forEach((item) => {
    const { top } = item;

    result.push(...top.filter(x => x.pm10 > 50).map(x => {
      return { position: [x.latitude, x.longitude], pm10: x.pm10 }
    }))
  });

  return result;
}

export function toBumpFormat(data, type = 'pm10') {
  const groupedBySensorId = _.groupBy(data, item => item.sensorId);

  const results = []
  _.forEach(groupedBySensorId, (values, key) => {

    const obj = {
      id: _.truncate(key, { length: 20 }),
      data: [],
    };

    values.forEach(item => {
      obj.data.push({ x: item.time, y: item[type] });
    })

    results.push(obj);
  })

  return results;
}

export function toLineFormat(data, type, legend) {
  const groupedBySensorId = _.groupBy(data, item => item.sensorId);

  const limits = getLimits(type);
  const useLogScale = type === 'pm10' || type === 'pm25';

  const lineObj = {
    axisLeft: {
      tickValues: limits.map(({ val }) => val),
      legend,
    },
    axisBottom: {
      legend: 'hours',
    },
    useLogScale
  }

  const results = []
  _.forEach(groupedBySensorId, (values, key) => {

    let newData = values
      .filter(item => _.isNumber(item[type]))
      .map(item => ({ x: item.time, y: item[type] }));

    // when using logarithmic scale the values have to be greater than 0
    if (useLogScale) {
      newData = newData.filter(item => item.y > 0);
    }

    const obj = {
      id: _.truncate(key, { length: 20 }),
      data: newData,
      ...lineObj
    };

    results.push(obj);
  })

  return { data: results, ...lineObj };
}

export function toPieFormat(data, type) {
  const result = [];

  const limits = getLimits(type);
  for (let i = 0; i < limits.length; i++) {
    const element = limits[i];
    const nextElementValue = limits[i + 1] ? limits[i + 1].val : Number.POSITIVE_INFINITY;

    result.push({
      value: data.filter(d => element.val <= d[type] && d[type] < nextElementValue).length,
      id: element.label,
      label: element.label
    });
  }

  return result;
}

export function toBarFormat(data) {
  const keys = [...mainTypes, ...otherTypes];
  const items = getData();

  return { keys, items };

  function getData() {
    const filteredData = _.take(_.orderBy(data.filter(item => item.pm10 !== undefined), ['pm10'], ['desc']), 15);

    return filteredData.map((item) => {

      const obj = {
        sensorId: `${_.truncate(item.sensorId, { length: 10 })} / ${item.time}`,
      };

      keys.forEach(key => {
        obj[key] = item[key];
      })

      return obj;
    })
  }
}

export function toHeatmapFormat(data, type) {
  const keys = _.uniq(data.map(item => truncateSensor(item.sensorId)));

  const groupedByTime = _.groupBy(data, item => item.time);

  const results = [];
  _.forEach(groupedByTime, (values, key) => {

    const obj = {
      time: key,
    };

    values.forEach(value => {
      const { sensorId } = value;
      obj[truncateSensor(sensorId)] = value[type] || 0;
    });

    // we add the missing keys
    keys.forEach(sensorId => {
      if (!obj[sensorId]) {
        obj[sensorId] = 0;
      }
    })

    results.push(obj)
  });

  return {
    keys,
    items: results,
  };
}

function truncateSensor(sensorId) {
  return _.truncate(sensorId, { length: 10 });
}
