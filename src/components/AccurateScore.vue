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
      accurateScoreList: [],
    };
  },
  computed: {
    chartData() {
      return {
        labels: this.scoreLen,
        datasets: [
          {
            data: this.accurateScoreList,
            label: "精度(%)",
            backgroundColor: "#f87979",
          },
        ],
      };
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        // scales: {
        //   ticks: { min: 0, max: 100, stepSize: 10 },
        // },
      };
    },
    scoreLen() {
      let scoreLabel = [];
      for (let i = 0; i < this.accurateScoreList.length; i++) {
        scoreLabel.push(i + 1);
      }
      return scoreLabel;
    },
  },
  methods: {
    setArray() {
      this.scoreList.forEach((score) => {
        this.accurateScoreList.push(score.accuracy);
      });
    },
  },
  mounted() {
    this.scoreList.forEach((score) => {
      this.accurateScoreList.push(score.accuracy);
    });
    console.log(this.scoreList);
    console.log(this.accurateScoreList);
  },
};
</script>
