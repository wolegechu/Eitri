import  Vue from 'vue'
import * as FSS from '../index'


Vue.component('content-plane', {
  template: `
    <div class='content'>
      <canvas id='canvas' class='canvas' width="1500" height="1500"></canvas>
    </div>
  `,
  data() {
    return {
      
    }
  },
  mounted() {
    FSS.Init({ canvasID: 'canvas' }) 
  },
})