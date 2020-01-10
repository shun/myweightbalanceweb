<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator';
import Chart from "chart.js"
import { Line, mixins } from 'vue-chartjs'

@Component({})
export default class GraphItem extends Mixins(Line, mixins.reactiveProp) {
  @Prop() public chartData: Chart.ChartData;
  @Prop() public chartOptions: Chart.ChartOptions;

  constructor() {
    super();
    //this.chartData = {};
    //this.chartOptions = {};
  }

  public mounted() {
    this.renderChart(this.chartData, this.chartOptions);
  }
}
</script>
