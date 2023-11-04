<template>
  <div class="text-h4">Trading View chart:</div>
  <h2>
    Current chart: {{ dispChart }}
    <pre>Interval: {{ dispInterval }}</pre>
  </h2>
  <div id="trading-view-plot"></div>
  <section>
    <label for="chart-select"><b>Select chart: </b></label>
    <select name="chart-select" v-on:input="currentChart" id="chart-select">
      <option value="BTC-USDT">BTC-USDT</option>
      <option value="ETH-USDT">ETH-USDT</option>
      <option value="BNB-USDT">BNB-USDT</option>
      <option value="rXRP-USDT">XRP-USDT</option>
    </select>
    <button v-on:click="changeChart">Change</button>
  </section>
  <section>
    <label for="interval-select"><b>Select time interval: </b></label>
    <select
      name="interval-select"
      v-on:input="currentInterval($event)"
      id="interval-select"
    >
      <option value="1m">1m</option>
      <option value="1h">1h</option>
      <option value="4h">4h</option>
      <option value="1d">1d</option>
    </select>
    <button v-on:click="changeInterval">Change</button>
  </section>
  <input
    type="checkbox"
    v-model="liveChart"
    id="live-chart"
    name="live-chart"
  />
  <label for="live-chart"><b> Live chart</b></label>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

//Chart settings
let selectedChart = "BTC-USDT";
let selectedInterval = "1m";

let dispChart = ref("BTC-USDT");
let dispInterval = ref("1m");
let liveChart = ref(false);

//Get values from drop-ddown list
const currentChart = function (event) {
  selectedChart = event.target.value;
};
const currentInterval = function (event) {
  selectedInterval = event.target.value;
};

//Actions due to button click
const changeChart = function () {
  dispChart.value = selectedChart;
  tvChartPlot(dispChart.value, dispInterval.value);
};

const changeInterval = function () {
  dispInterval.value = selectedInterval;
  tvChartPlot(dispChart.value, dispInterval.value);
};

let candleStick;
let tvChart;

const tvChartPlot = function (currency, interval) {
  if (!tvChart) {
    tvChart = LightweightCharts.createChart("trading-view-plot", {
      width: 1000,
      height: 500,
    });

    candleStick = tvChart.addCandlestickSeries();
  }
  fetch(
    `https://api.binance.com/api/v3/klines?symbol=${
      currency.slice(0, 3) + "USDT"
    }&interval=${interval}&limit=1000`
  )
    .then((res) => res.json())
    .then((data) => {
      const cdata = data.map((d) => {
        return {
          time: d[0] / 1000,
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
        };
      });
      candleStick.setData(cdata);
    })
    .catch((err) => log(err));
};

//Live chart
let intervalNumber;

watch(liveChart, () => {
  if (liveChart.value) {
    intervalNumber = setInterval(
      () => tvChartPlot(dispChart.value, dispInterval.value),
      1000
    );
    return intervalNumber;
  } else clearInterval(intervalNumber);
});

//Mounting chart
onMounted(() => tvChartPlot(dispChart.value, dispInterval.value));
</script>

<style>
#trading-view-plot,
#interval-select {
  padding: 5px;
}
#chart-select {
  padding: 10px;
}
button {
  display: inline-block;
  outline: 0;
  appearance: none;
  padding: 0px 12px;
  border: 0px solid transparent;
  margin: 5px;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;
  background-color: rgb(9, 128, 76);
  box-shadow: rgb(19 170 82 / 40%) 0px 2px 3px;
  color: rgb(255, 255, 255);
  font-size: 14px;
  font-weight: 400;
  height: 36px;
  transition: all 150ms ease-in-out 0s;
}
tab1 {
  padding-left: 1em;
}
</style>
