
Todo:

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
- 重边 三个点时就会出问题


optimization:

- exportedProperties 类换到对应元素目录
- point、vector 改用flatenjs
- flatten import problem  (`export default Flatten;`)
- 定义、申明分离

Future: 

- Redo、Undo