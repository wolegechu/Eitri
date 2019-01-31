
Todo:

- 门窗位置表示方式改变（不需要考虑变化）
- 多次点击生成房间后，选中时卡顿
- 画矩形时可输入长度
- 画墙壁(shift时，grab wall应仍然保持90)
- 属性显示
- 拖动摆放家具
- 自适应布局
- 底座设计界面
- 比例尺
- 资源加载
- 清除背景图按钮    
- 移动顶点时刷新房间？（简单方法：一次刷新所有房间）

BUGs:

- 自环 同一个点连点两次出问题


optimization:

- exportedProperties 类换到对应元素目录
- point、vector 改用flatenjs
- flatten import problem  (`export default Flatten;`)
- 定义、申明分离

Future: 

- Redo、Undo