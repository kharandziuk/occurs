import {Component} from 'base'
import {Line as LineChart} from 'react-chartjs'
import moment from 'moment'
import _ from 'underscore'

const TIME_RANGE = 6 * 60 * 60 * 1000; // 6 hours to display
const PER_POINT = 1000 * 30; // 30 data sec per point
const POINTS_COUNT = TIME_RANGE / PER_POINT; // how many points to display
const LABELS_INTERVAL = 2 * 10; // label per 10 minutes

export default class Chart extends Component {
  prepareChartData(data) {
    var current = moment();

    var groupedItems = _.chain(data)
      .each( item => item.moment = moment(item.date) )
      .filter( item => current.diff(item.moment) <= TIME_RANGE)
      .groupBy( item => Math.floor(current.diff(item.moment) / PER_POINT) )
      .value()

    // each points represents 30 seconds data
    var labels = _.range(POINTS_COUNT);

    var points = _(labels).map( (p, i) => {
      if(groupedItems[i]) {
        return groupedItems[i].length;
      } else {
        return 0;
      }
    })

    labels = _(labels).map( (l, i) => {
      current.subtract(30, 's')
      if ( l % LABELS_INTERVAL == 0 ) {
        return current.format('HH:mm');
      } else {
        return '';
      }
    })

    return {
      labels: _(labels).reverse(),
      datasets: [
        {
          fillColor: "rgba(151,187,205,0)",
          strokeColor: "rgba(151,187,205,1)",
          pointColor: "rgba(151,187,205,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(151,187,205,1)",
          data: points.reverse()
        }
      ]
    }
  }

  render() {
    var chartOptions = {
      animation: false,
      //showScale: false,
      showTooltips: false,
      pointDot: false,
      datasetStrokeWidth: 0.5
    }
    var chartData = this.prepareChartData(this.props.data);
    return <LineChart data={chartData} options={chartOptions} width={POINTS_COUNT} height="250"/>
  }
}
