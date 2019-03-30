import  Vue from 'vue'
import * as FSS from '../index'

const list = [
  {key: 'draw-line', class: 'icon-huaxian1', select: false, name: '画线', handle: () => {
    FSS.DrawWall()
  }},
  {key: 'draw-room', class: 'icon-juxing', name: '画房间', handle: () => {
    FSS.DrawRectangle()
  }},
  {key: 'draw-window', class: 'icon-chuanghu2', name: '画窗口', handle: () => {
    FSS.DrawWindow()
  }},
  {key: 'generate-line', class: 'icon-fangjian1', name: '生成房间', handle: () => {
    FSS.GenerateRoom()
  }}
]

Vue.component('left-plane', {
  template: `
    <ul class='left-plane'>
      <li class='item' v-for='item of list' :key='item.key' @click='item.handle'>
        <div :class="'icon ' + item.class"></div>
        <div class='name'>{{item.name}}</div>
      </li>
    </ul>
  `,

  data() {
    return {
      list
    }
  }
})