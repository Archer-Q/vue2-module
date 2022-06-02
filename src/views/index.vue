<template>
  <div>
    <svg-icon icon-class="add"></svg-icon>
    <el-button>111</el-button>
    <div id="main" style="width: 600px;height:400px;"></div>
  </div>
</template>
<script>
export default {
  name: "Index",
  data() {
    return {
      vue: 'Vue'
    }
  },
  methods: {
    drawChart() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("main"));
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: "ECharts 入门示例"
        },
        tooltip: {},
        legend: {
          data: ["销量"]
        },
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
  },
  mounted() {
    console.log(this.$md5('密码'))
    console.log(this.$math.add(2,3))
    this.drawChart();
  }
}
</script>
<style lang="scss"></style>
