<template>
  <LineGenerate
    :chart-data="chartData"
    :chart-options="chartOptions"
    :styles="myStyles"
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
  },
  components: { LineGenerate },
  data() {
    return {
      wpmScoreList: [],
    };
  },
  computed: {
    myStyles() {
      return {
        height: `${600}px`,
        position: `relative`,
      };
    },
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
        scales: {
          x: {
            title: {
              color: "black",
              display: true,
              text: "回数",
            },
          },
          y: {
            title: {
              color: "black",
              display: true,
              text: "WPM",
              ticks: {
                maxRotation: 90, // 自動的に回転する角度を固定
                minRotation: 90,
              },
            },
          },
        },
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
    // console.log("time", this.scoreList);
    this.scoreList.forEach((score) => {
      this.wpmScoreList.push(score.wpm);
    });
    // this.renderChart(this.chartData.datasets, this.scoreList);
  },
};
</script>
