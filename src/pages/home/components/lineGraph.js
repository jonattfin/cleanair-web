import React from 'react'
import { Line } from '@nivo/line';

const commonProperties = {
  height: 1080 / 2,
  width: 1920,
  margin: { left: 50, bottom: 50, top: 50 },
  animate: true,
  enableSlices: 'x',
};

const linearProps = {
  yScale: {
    type: 'linear',
  }
}

const logarithmicProps = {
  gridYValues: [50, 100, 200, 300, 1000],
  xScale: {
    type: 'log',
    base: 2,
    max: 'auto',
  },
  // axisBottom: {
  //   legend: 'logarithmic scale (base: 2)',
  //   legendOffset: -12,
  // },
  yScale: {
    type: 'log',
    base: 10,
    max: 'auto',
  },
  // axisLeft: {
  //   tickValues: [10, 100, 1000, 10000, 100000, 1000000, 10000000],
  //   legend: 'logarithmic scale (base: 10)',
  //   legendOffset: 12,
  // },
};

export default class LineGraph extends React.Component {
  render() {
    const { data, type } = this.props

    let markers = [];
    if (type === 'pm25') {
      markers = [{
        axis: 'y',
        value: 25,
        lineStyle: { stroke: '#FF1493', strokeWidth: 3 },
        legend: 'y marker',
        legendOrientation: 'vertical',
      }];
    }

    return (
      <div>
        <Line
          {...commonProperties}
          {...linearProps}
          data={data}
          xScale={{
            type: 'time',
            format: '%Y-%m-%d',
            precision: 'day',
          }}
          xFormat="time:%Y-%m-%d"
          axisLeft={{
            legend: 'linear scale',
            legendOffset: 12,
          }}
          axisBottom={{
            format: '%b %d',
            tickValues: 'every 1 month',
            legend: 'time scale',
            legendOffset: -12,
          }}
          pointBorderWidth={1}
          pointBorderColor={{
            from: 'color',
            modifiers: [['darker', 0.3]],
          }}
          useMesh={true}
          markers={markers}
        />
      </div>
    )
  }
}
