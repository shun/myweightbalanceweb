<template>
  <v-container>
  <v-container>
    <span class="deep-purple--text">●jumprope</span>
    <span class="orange--text">●abs</span>
    <span class="red--text">●konami</span>
    <v-date-picker
      landscape="landscape"
      :full-width=true
      :first-day-of-week=1
      :show-current=true
      :events="functionEvents"
    >
    </v-date-picker>
  </v-container>
  <v-container>
    <v-row>
      <v-select
        v-model="range"
        :items="rangelist"
        label="Select"
      />
    </v-row>
    <GraphItem :chartData="chartData" :chartOptions="chartOptions" v-if="loaded" />
  </v-container>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator';
import db from '../firebaseConf'
import Chart from "chart.js"
import GraphItem from '@/components/GraphItem.vue'
import BalanceData from '@/types/BalanceData.vue'

//const FONT_COLOR = "rgba(0, 255, 255, 1)";
const FONT_COLOR = "#263238";
const GRID_LINES_SETTING = {
  display: true,
  drawOnChartArea: true,
  color: "#263238",
  zeroLineColor: "#263238"
};

class DoEvents {
  public didJumprope: boolean;
  public didAbs: boolean;
  public wentKonami: boolean;

  constructor() {
    this.didJumprope = false;
    this.didAbs = false;
    this.wentKonami = false;
  }
}

@Component({
  components: {
    GraphItem
  }
})
export default class GraphComp extends Vue {
  private chartData: Chart.ChartData = {};
  private chartOptions: Chart.ChartOptions = {};
  private range: string = 'Month';
  private rangelist: string[] = ['All', 'Year', 'Month', 'Week'];
  private weights: (number | null)[] = [];
  private bodyfats: (number | null)[] = [];
  private loaded: boolean = false;
  private events: DoEvents[] = [];

  constructor() {
    super();
  }

  private getBalanceData(): BalanceData[] {
    let ary: BalanceData[] = [];

    return ary;
  }

  getDaysByMonth(year: number, month:number): number {
    let start_dt = new Date(year, month-1, 1);
    let end_dt = new Date(year, month, 1);

    return (end_dt.getTime() - start_dt.getTime()) / (1000 * 60 * 60 * 24);
  }

  getDaysByString(year: number, month: number): string[] {
    let days_str: string[] = [];

    let dt = new Date(year, month-1, 1);
    dt.setTime(dt.getTime() + 1000 * 60 * 60 * 9);
    let days = this.getDaysByMonth(dt.getFullYear(), dt.getMonth());

    for (let i = 1; i <= days; i++) {
      days_str.push(i.toString());
    }

    return days_str;
  }

  private setupOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        // display: false
        onClick(event, legendItem) {
          return;
        },
        fullWidth: true,
        labels: {
          boxWidth: 20,
          fontColor: FONT_COLOR
        },
      },
      layout: {
        padding: {
          top: 2,
          left: 2,
          bottom: 2,
          right: 2
        }
      },
      scales: {
        xAxes: [
          {
            gridLines: GRID_LINES_SETTING,
            ticks: {
              autoSkip: true,
              fontColor: FONT_COLOR,
              fontSize: 14
            },
            scaleLabel: {
              display: true,
              fontColor: FONT_COLOR,
              labelString: "day",
            },
          },
        ],
        yAxes: [
          {
            id: "yAxis_1",
            type: "linear",
            gridLines: GRID_LINES_SETTING,
            scaleLabel: {
              display: true,
              fontColor: FONT_COLOR,
              labelString: "Weight(kg)"
            },
            ticks: {
              autoSkip: true,
              fontColor: FONT_COLOR,
              fontSize: 14,
              min: 80,
              max: 110
            },
          },
          {
            id: "yAxis_2",
            type: "linear",
            gridLines: GRID_LINES_SETTING,
            scaleLabel: {
              display: true,
              fontColor: FONT_COLOR,
              labelString: "Body fat(%)"
            },
            ticks: {
              autoSkip: true,
              fontColor: FONT_COLOR,
              fontSize: 14,
              min: 10,
              max: 40
            },
            position: "right"
          }
        ],
      }
    };
  }

  private createCharData(label: string[], weights: (number | null)[], bodyfats: (number | null)[]): Chart.ChartData {
    let chartData: Chart.ChartData = {
      labels: label,
      datasets: [
        {
          yAxisID: "yAxis_1",
          type: "line",
          label: "Weight",
          backgroundColor: "#6090EF",
          borderColor: "#6090EF",
          fill: false,
          data: weights,
          spanGaps: true
        },
        {
          yAxisID: "yAxis_2",
          type: "line",
          label: "Body fat",
          backgroundColor: "#F87979",
          borderColor: "#F87979",
          fill: false,
          data: bodyfats,
          spanGaps: true
        }
      ]
    };

    return chartData;
  }

  created() {
    let self = this;
    this.setupOptions();

    let weights : (number | null)[] = [];
    let bodyfats : (number | null)[] = [];

    let dt = new Date();
    dt.setTime(dt.getTime() + 1000 * 60 * 60 * 9);

    for (let i = 0; i < 31; i++) {
      this.events.push(new DoEvents());
    }

    db.collection('balances').orderBy("date_at_epoch").get().then((query) => {
      let day = 1;
      query.forEach(function(doc) {
        let rec = doc.data();
        let [,, tmp_day] = rec['date_at'].split('-');
        while(day !== parseInt(tmp_day, 10)) {
          self.weights.push(null);
          self.bodyfats.push(null);
          day++;
        }

        if (rec['weight'] !== -1) {
          self.weights.push(rec['weight']);
        } else {
          self.weights.push(null);
        }
        if (rec['bodyfat'] !== -1) {
          self.bodyfats.push(rec['bodyfat']);
        } else {
          self.bodyfats.push(null);
        }
        if (rec['jumprope'] !== 0) {self.events[day-1].didJumprope = true;}
        if (rec['doabs'] === 1) {self.events[day-1].didAbs = true;}
        if (rec['konami'] === 1) {self.events[day-1].wentKonami = true;}
        day++;
      });

      self.chartData = self.createCharData(self.getDaysByString(dt.getFullYear(), dt.getMonth() + 1), self.weights, self.bodyfats);
      self.loaded = true;
    });

  }

  mounted() {
  }

  getEvents(date: string): string[] {
    const [,, day] = date.split('-');

    let evt = this.events[parseInt(day, 10) - 1];
    let ret: string[] = [];
    if (evt.didJumprope) ret.push('deep purple');
    if (evt.didAbs) ret.push('orange');
    if (evt.wentKonami) ret.push('red');

    return ret;
  }

  functionEvents(date: string) {
    return this.getEvents(date);
  }
}
</script>
