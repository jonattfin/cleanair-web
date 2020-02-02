import React from 'react'
import { Line } from '@nivo/line';

const commonProperties = {
  height: 1080,
  width: 1920,
  margin: { left: 50, bottom: 50, top: 50 },
  animate: true,
  enableSlices: 'x',
}

export default class LineGraph extends React.Component {
  render() {
    const { data } = this.props

    return (
      <div>
        <Line
          {...commonProperties}
          data={data}
          xScale={{
            type: 'time',
            format: '%Y-%m-%d',
            precision: 'day',
          }}
          xFormat="time:%Y-%m-%d"
          yScale={{
            type: 'linear',
          }}
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
          markers={[
            {
              axis: 'y',
              value: 50,
              lineStyle: { stroke: '#FF1493', strokeWidth: 3 },
              legend: 'y marker',
              legendOrientation: 'vertical',
            },
          ]}
        />
      </div>
    )
  }
}
