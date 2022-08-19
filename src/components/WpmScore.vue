<template>
  <LineGenerate :chart-data="chartData" :chart-options="chartOptions" />
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
  },
  components: { LineGenerate },
  data() {
    return {
      wpmScoreList: [],
    };
  },
  computed: {
    chartData() {
      return {
        labels: this.scoreLen,
        datasets: [
          {
            data: this.wpmScoreList,
            label: "WPM(1分あたりの入力文字数)",
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
      for (let i = 0; i < this.wpmScoreList.length; i++) {
        scoreLabel.push(i + 1);
      }
      return scoreLabel;
    },
  },
  //   methods: {
  //     setArray() {
  //       this.scoreList.forEach((score) => {
  //         this.wpmScoreList.push(score.wpm);
  //       });
  //       console.log("time", this.wpmScoreList);
  //     },
  //   },
  mounted() {
    console.log("time", this.scoreList);
    this.scoreList.forEach((score) => {
      this.wpmScoreList.push(score.wpm);
    });
    // this.renderChart(this.chartData.datasets, this.scoreList);
  },
};
</script>
