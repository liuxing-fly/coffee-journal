# ☕ Coffee Journal

咖啡爱好者的自用小程序，记录每一杯好咖啡。

## 功能特性

### 🫘 咖啡豆库
- 记录咖啡豆完整信息：豆名、产地、品种、处理法、烘焙度、海拔、烘焙商
- 烘焙度可视化展示（SCA 标准 6 级，含 Agtron 色值和温度范围）
- 风味标签选择（基于 SCA 风味轮，12 大类 50+ 细分风味）
- 购买信息记录：价格、重量、渠道
- 豆子状态管理：未开袋 / 饮用中 / 已喝完
- 搜索功能：按豆名、产地、品种搜索

### 📝 冲煮记录
- 支持 9 种冲煮方式：手冲、意式、法压壶、摩卡壶、爱乐压、冷萃、虹吸壶、Chemex、其他
- 完整参数记录：粉量、水量、水温、时间、研磨度、注水方式、压力
- 自动计算粉水比
- 选择冲煮方式后自动填充推荐参数
- 口感评分：总分 + 香气/酸质/醇厚/甜感四维度
- 风味笔记

### 📊 数据分析
- 总览：冲煮次数、咖啡豆种类、平均评分
- 冲煮方式分布图
- 最爱咖啡豆 TOP5 排行
- 评分趋势图（近 20 次）
- 风味词频统计
- 月度冲煮量统计

### ⚙️ 个人设置
- 默认冲煮参数配置
- 数据导出（规划中）
- 本地缓存管理

## 数据模型

### 咖啡豆 (beans)
| 字段 | 类型 | 说明 |
|------|------|------|
| name | String | 豆名 |
| origin | String | 产地 |
| variety | String | 品种 |
| process | String | 处理法 |
| roastLevel | String | 烘焙度 (light/medium/dark 等 6 级) |
| altitude | String | 海拔 (m) |
| roaster | String | 烘焙商 |
| roastDate | String | 烘焙日期 |
| weight | String | 重量 (g) |
| price | String | 价格 |
| shop | String | 购买渠道 |
| harvestYear | String | 采摘年份 |
| status | String | 状态 (open/drinking/finished) |
| rating | Number | 个人评分 (1-5) |
| notes | String | 备注 |
| flavorTags | Array | 风味标签 |

### 冲煮记录 (brews)
| 字段 | 类型 | 说明 |
|------|------|------|
| beanId | String | 关联咖啡豆 ID |
| beanName | String | 咖啡豆名称（冗余，方便展示） |
| method | String | 冲煮方式 |
| grinder | String | 磨豆机 |
| grindSize | String | 研磨度 |
| dose | Number | 粉量 (g) |
| water | Number | 水量 (ml) |
| temperature | Number | 水温 (°C) |
| brewTime | String | 冲煮时间 |
| pressure | String | 压力 (bar，意式用) |
| pourPattern | String | 注水方式 (手冲用) |
| tasteScore | Number | 总分 (1-10) |
| aroma | Number | 香气 (1-10) |
| acidity | Number | 酸质 (1-10) |
| body | Number | 醇厚 (1-10) |
| sweetness | Number | 甜感 (1-10) |
| flavorNotes | String | 风味笔记 |
| notes | String | 备注 |

## 技术栈

- **前端**: 微信小程序原生 (WXML/WXSS/JS)
- **后端**: 微信云开发 (CloudBase)
- **数据库**: 云开发数据库 (MongoDB-like)
- **存储**: 云存储（图片）

## 项目结构

```
coffee-journal/
├── miniprogram/
│   ├── pages/
│   │   ├── home/          # 首页
│   │   ├── beans/         # 豆库列表
│   │   ├── bean-detail/   # 豆详情
│   │   ├── bean-add/      # 添加/编辑豆
│   │   ├── brews/         # 冲煮记录列表
│   │   ├── brew-add/      # 添加冲煮记录
│   │   ├── analytics/     # 数据分析
│   │   └── profile/       # 个人设置
│   ├── components/
│   │   ├── tag-selector/  # 风味标签选择器
│   │   └── score-bar/     # 评分条
│   ├── utils/
│   │   ├── db.js          # 数据库操作封装
│   │   └── util.js        # 工具函数 + 咖啡数据
│   ├── images/            # Tab 图标（需自行添加）
│   ├── app.js
│   ├── app.json
│   └── app.wxss
├── cloudfunctions/        # 云函数（可选）
├── project.config.json
└── README.md
```

## 快速开始

### 1. 注册小程序
前往 [微信公众平台](https://mp.weixin.qq.com/) 注册小程序账号，获取 AppID。

### 2. 开通云开发
登录微信开发者工具，开通云开发，获取环境 ID。

### 3. 配置项目
1. 打开 `project.config.json`，替换 `appid` 为你的 AppID
2. 打开 `miniprogram/app.js`，替换 `env: 'your-env-id'` 为你的云开发环境 ID

### 4. 创建数据库集合
在云开发控制台创建两个集合：
- `beans`
- `brews`

### 5. 添加 Tab 图标
在 `miniprogram/images/` 目录下添加 10 个 PNG 图标（81x81px），详见 `images/README.md`。

### 6. 运行
用微信开发者工具打开项目目录即可预览。

## 烘焙度参考 (SCA 标准)

| 级别 | 中文 | Agtron | 豆温 | 风味特征 |
|------|------|--------|------|----------|
| 1 | 浅烘 | 65-80 | 180-205°C | 高酸质、花果香、茶感 |
| 2 | 中浅 | 55-65 | 210-220°C | 酸甜平衡、焦糖初现 |
| 3 | 中烘 | 45-55 | 210-220°C | 均衡、巧克力、焦糖 |
| 4 | 中深 | 35-45 | 225-230°C | 苦甜交织、深巧克力、香料 |
| 5 | 深烘 | 25-35 | 240-250°C | 烟熏、焦糖、重醇厚 |
| 6 | 极深 | <25 | 250°C+ | 强苦、炭烧、重度出油 |

## 冲煮方式推荐参数

| 方式 | 粉量 | 粉水比 | 水温 | 研磨度 | 时间 |
|------|------|--------|------|--------|------|
| 手冲 | 15-18g | 1:15~17 | 88-96°C | 中细 | 2:00-3:00 |
| 意式 | 18-20g | 1:2~2.5 | 90-96°C | 极细 | 25-35s |
| 法压壶 | 15-18g | 1:15~17 | 93-96°C | 粗 | 4:00 |
| 摩卡壶 | 15-20g | 1:5~8 | 70-80°C | 中细 | 3-5min |
| 爱乐压 | 14-17g | 1:12~15 | 80-96°C | 中 | 1:00-2:00 |
| 冷萃 | 30-50g | 1:8~12 | 室温 | 粗 | 12-24h |
| 虹吸壶 | 20-30g | 1:12~15 | 91-96°C | 中 | 1:00-1:30 |
| Chemex | 25-30g | 1:15~17 | 93-96°C | 中粗 | 3:30-4:30 |

## License

MIT
