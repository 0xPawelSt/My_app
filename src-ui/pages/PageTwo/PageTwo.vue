<template>
  <div class="text-h4">Trading View chart</div>
  <div id="trading-view-plot"></div>
</template>

<script setup>
import { onMounted } from "vue";
onMounted(() => tvChartPlot());

const tvChartPlot = function () {
  const tvChart = LightweightCharts.createChart("trading-view-plot", {
    width: 1000,
    height: 500,
  });

  const candleStick = tvChart.addCandlestickSeries();

  fetch(
    "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=1000"
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
</script>
<style></style>
