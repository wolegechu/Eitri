import  Vue from 'vue'
import * as FSS from '../index'
interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

const action = [
  {key: 'baocun', name: '保存', handle: function() {
    FSS.DownloadJson()
  }},
  {key: 'xuanzewenjianshangchuan', name: '打开', handle: function() {
    this.$refs.upload.click()
  }}
]

Vue.component('head-plane', {
  template: `
    <div class='head row'>
      <input type='file' ref='upload' style='display: none;' @change='upload' accept="application/json"/>
      <div class="logo">粉刷刷</div>
      <div class="action row">
        <div class="item" v-for='item of action' :key='item.key' @click='item.handle'><span :class="'icon icon-' + item.key"></span>{{item.name}}</div>
      </div>
    </div>
  `,
  data() {
    action.forEach(item=>item.handle = item.handle.bind(this))
    return {
      action
    }
  },
  methods: {
    upload({target}: HTMLInputEvent) {
      FSS.ImportJson(target.files[0]);
    }
  },
})