<template>
  <div id="app">
    <div v-for="item in loadingDivs" :key="item" class="cover" ></div>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapGetters(['loadingDivs'])
  },
  data() {
    return {
      loading: true
    }
  }
}
</script>
<style>
  .app-container{
    padding:8px!important
  }
  .cover{
    position: absolute;
    z-index:9999;
    background:none;
    width:100%;
    height:100%;
  }
</style>

