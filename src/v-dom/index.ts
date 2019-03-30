import Vue from 'vue';
import './leftPlane';
import './headPlane';
import './contentPlane';
import './styles/style.scss';
new Vue({
  el: '#app',
  template: `
  <div class='app col'>
    <head-plane></head-plane>
    <div class='container row'>
      <left-plane></left-plane>
      <content-plane></content-plane>
    </div>
  </div>
  `
})
