import { Colors } from "@blueprintjs/core";
import _ from 'lodash';

export function getLimits(type) {
  switch (type) {
    case 'pm10':
      return [
        { val: 0, color: Colors.GREEN5, label: 'Good' },
        { val: 51, color: Colors.GREEN4, label: 'Moderate' },
        { val: 101, color: Colors.RED5, label: 'Unhealthy' },
        { val: 201, color: Colors.RED4, label: 'Very Unhealthy' },
        { val: 301, color: Colors.ROSE1, label: 'Hazardous' },
      ];
    case 'pm25':
      return [
        { val: 0, color: Colors.GREEN5, label: 'Good' },
        { val: 30, color: Colors.GREEN4, label: 'Moderate' },
        { val: 100, color: Colors.ROSE1, label: 'Hazardous' },
      ];
    case 'temperature':
      return _.range(0, 10).map(item => ({ val: item * 5 }));
    case 'humidity':
      return _.range(0, 10).map(item => ({ val: item * 10 }));
    case 'noise':
      // https://boomspeaker.com/noise-level-chart-db-level-chart/
      return [
        { val: 0, color: Colors.GREEN5, label: 'Good' },
        { val: 60, color: Colors.GREEN4, label: 'Moderate' },
        { val: 87, color: Colors.RED5, label: 'Loud' },
        { val: 100, color: Colors.RED4, label: 'Very noisy' },
        { val: 120, color: Colors.ROSE1, label: 'Pain' },
        { val: 135, color: Colors.ROSE1, label: 'Intolerable' },
        { val: 160, color: Colors.ROSE1, label: 'Hazardous' },
      ];
    default:
      return [];
  }
}
