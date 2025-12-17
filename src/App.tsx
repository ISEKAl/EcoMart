import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/common/Layout'
import ProductList from './components/pages/ProductList'
import ProductDetail from './components/pages/ProductDetail'
import { config } from './config'

//√ 实现购物车弹窗
//√ 实现列表页的筛选排序功能
//√ 实现列表页到详情页的跳转,跳转到详情页后，规格筛选器应自动选中当前商品的规格
//√ 实现响应式UI
//√ 把fetch改成http请求并用Mock.js模拟响应数据

/**
 * 响应式UI
 * 1. 什么是响应式UI? 指的网页或APP根据设备的屏幕尺寸、分辨率、方向自动调整布局、内容和交互方式。
 *      核心目标是让同一套代码在各种设备上都能良好运行
 * 2. 开发响应式UI的最佳实践
 *      移动优先:从最小屏幕尺寸开始设计，逐步扩大尺寸。优先保证核心功能在小屏幕上可用
 *      使用灵活的布局：Flexbox(一维),Grid(二维),相对单位(%、rem、vw/vh)。少用固定的像素px
 * 3. 响应式图片：
 *      使用max-width:100%保证图片自适应容器
 *      使用srcset属性提供不同分辨率的图片，根据设备像素比自动加载合适的图片。
 *      视频或其他媒体元素同理
 * 4. 组件化：
 *      将UI拆分为可复用组件
 *      每个组件都有自己的状态管理，处理自身的响应式逻辑。
 *      组件内部处理自身的响应式逻辑。
 * 5. 触摸友好：
 *      确保按钮和交互元素足够大（至少44 x 44px）
 *      交互元素间距适当
 * 
 * 相关概念：CSS视口分辨率（视口宽度，视口高度，DPR）
 */


function App() {
  return (
    <div className="app">
      <BrowserRouter basename={config.basePath}>
        <Layout>
          <Routes>
            {/* 商品列表页路由 */}
            <Route path="/" element={<ProductList />} />
            {/* 商品详情页路由 */}
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  )
}

export default App
