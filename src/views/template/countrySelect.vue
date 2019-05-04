<template>
  <div id="app">
    <p>{{title}}</p>
    <div class="city">
      <input type="text" placeholder="出发城市" @focus="showCityDialog" @blur="hideCityDialog">
      <div class="city-components" v-if="showCity">
        城市控件
      </div>
    </div>
  </div>
</template>


<script>
  export default {
    name: 'app',
    data () {
      return {
        title: '国家选择',
        showCity: false
      }
    },
    methods: {
      hideCityDialog() {
        this.showCity = false
      },
      showCityDialog() {
        this.showCity = true
      }
    }
  }
</script>

<style scoped>
  .city{
    position:relative;
    .city-components{
    position: absolute;
    width: 400px;
    height: 200px;
    box-shadow: 0 0 4px 0 rgba(117,117,117,0.5);
    border-radius: 2px;
    padding: 20px 21px;
    }
  }

</style>
