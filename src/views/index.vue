<template>
  <div>
    <svg-icon icon-class="add"></svg-icon>
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
  mounted() {
    let url = process.env.NODE_ENV === 'production' ?  window.productionUrl : window.developmentUrl
    console.log(process.env.NODE_ENV)
    console.log(window.productionUrl)
    console.log(window.developmentUrl)
  }
}
</script>
<style lang="scss"></style>
