<template>
  <LineGenerate
    :chart-data="chartData"
    :chart-options="chartOptions"
    :height="height"
  />
</template>

<script>
// DataPage.vue
import { Line as LineGenerate } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

export default {
  name: "LineChart",
  props: {
    scoreList: {
      type: Array,
    },
    height: {
      type: Number,
      default: 400,
    },
  },
  components: { LineGenerate },
  data() {
    return {
      timeScoreList: [],
    };
  },
  computed: {
    chartData() {
      return {
        labels: this.scoreLen,
        datasets: [
          {
            data: this.timeScoreList,
            label: "タイム",
            backgroundColor: "#f87979",
          },
        ],
      };
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
      };
    },
    scoreLen() {
      let scoreLabel = [];
      for (let i = 0; i < this.timeScoreList.length; i++) {
        scoreLabel.push(i + 1);
      }
      return scoreLabel;
    },
  },
  methods: {
    setArray() {
      this.scoreList.forEach((score) => {
        let s = this.$dayjs(score.time);
        let minitues = s.$H ? s.$H * 60 : 0;
        let seconds = s.$m ? s.$m : 0;
        let mileSeconds = s.$y ? s.$y / 1000 : s.$y;
        let time = minitues + seconds + mileSeconds;
        this.timeScoreList.push(time);
      });
    },
  },
  mounted() {
    this.scoreList.forEach((score) => {
      let s = this.$dayjs(score.time);
      let minitues = s.$H ? s.$H * 60 : 0;
      let seconds = s.$m ? s.$m : 0;
      let mileSeconds = s.$y ? s.$y / 1000 : s.$y;
      let time = minitues + seconds + mileSeconds;
      this.timeScoreList.push(time);
    });
    // this.renderChart(this.chartData.datasets, this.scoreList);
    console.log(this.timeScoreList);
  },
};
</script>
