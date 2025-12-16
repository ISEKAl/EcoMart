
import React, { type ReactNode } from 'react';
import styles from './Layout.module.css';
import { Layout as ArcoLayout } from '@arco-design/web-react';
import Navbar from './Navbar'
import Cart from '../business/Cart'

// Layout 属性接口
interface LayoutProps {
  children: ReactNode; // 页面内容
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ArcoLayout className={styles.layout}>
      {/* 导航栏 - 使用ArcoLayout.Header包裹 */}
      <ArcoLayout.Header>
        <Navbar />
      </ArcoLayout.Header>
      {/* 内容区域 - 动态渲染页面组件 */}
      <ArcoLayout.Content className={styles.content}>
        {children}
      </ArcoLayout.Content>

      {/* 购物车组件 - 内部管理Drawer */}
      <Cart />
    </ArcoLayout>
  );
};

export default Layout;