You can find the details here: [Document](https://github.com/fss-ai/Eitri/wiki)


Todo:

- 指南针
- 空白情况下注意不到缩放、拖动
- 墙壁宽度可视化
- zoom && drag 背景图大小怎么办？
- 算任意房间的面积
- 门的摆放怎么输入数值？
- 门窗位置表示方式改变（不需要考虑变化，使用左上角作为原点）
- 多次点击生成房间后，选中时卡顿
- 画矩形时可输入长度
- 拖动摆放家具
- 底座设计界面
- 清除背景图按钮    
- 移动顶点时刷新房间？（简单方法：一次刷新所有房间）

BUGs:

- 自环 同一个点连点两次出问题
- 导入后不能选中物体
- canvas.on 只有注册，没有删除，是否有问题？

optimization:

- exportedProperties 类换到对应元素目录
- 定义、申明分离

Future: 

- Redo、Undo
