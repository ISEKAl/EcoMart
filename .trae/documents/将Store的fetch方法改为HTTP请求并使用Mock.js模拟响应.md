# 将Store的fetch方法改为HTTP请求并使用Mock.js模拟响应

## 1. 安装依赖

* 安装axios库用于发送HTTP请求

* 安装mockjs库用于模拟API响应

## 2. 创建Mock配置文件

* 创建`src/mock/index.ts`文件，配置API模拟规则

* 模拟商品列表、商品详情、推荐商品等接口

* 为每个接口设置合理的响应延迟和数据结构

## 3. 修改ProductStore

* 创建独立的API层（当前项目只需要ProductAPI）

- 将`fetchProducts`方法改为使用axios发送GET请求

- 将`fetchCurrentProductDetail`方法改为使用axios发送GET请求

- 将`fetchRecommendProducts`方法改为使用axios发送GET请求

- 保留原有的状态管理逻辑

- 处理请求错误和加载状态

## 4. 配置API基础路径

* 在API层中配置axios的基础路径

* 确保请求URL与Mock配置匹配

## 5. 测试修改

* 运行项目，确保商品列表正常加载

* 测试商品详情页面的数据加载

* 测试推荐商品的加载

## 6. 代码优化

* 确保错误处理逻辑完整

* 保持代码的可读性和可维护性

## 关键修改文件

* `package.json`：添加axios和mockjs依赖

* `src/mock/index.ts`：创建Mock配置

* `src/stores/productStore.ts`：修改fetch方法

## 注意事项

* 保持原有store的类型定义不变

* 确保Mock数据结构与原有数据结构一致

* 保留原有的状态管理逻辑

* 处理好请求错误和加载状态

