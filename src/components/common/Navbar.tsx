// 导航栏组件
import React from 'react';
import styles from './Navbar.module.css';
import { Typography, Badge } from '@arco-design/web-react';
// import { IconTheShoppingCart } from '@arco-iconbox/react-isekai';
import useCartStore from '../../stores/cartStore';
// import { IconHome } from '@arco-design/web-react/icon';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  // 从cartStore获取需要的状态和方法
  const { totalItems, setShowCart } = useCartStore();

  const menuItems = [
    { path: '/', label: '首页' },
    { path: '/123', label: '我的订单' },
    { path: '/456', label: '用户中心' },
  ];

  // 购物车点击事件处理
  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCart(true); // 显示购物车抽屉
  };

  return (
    <header className={styles.navbar}>
      <a href="/" className={styles.logo}>
        <Typography.Title bold={true} heading={4} style={{ margin: 0, color: '#206CCF' }}>
          商品商城
        </Typography.Title>
      </a>

      {/* 导航菜单 */}
      <nav className={styles.navMenu}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${styles.navItem} ${styles.navMenuItem} ${isActive ? styles.active : ''}`
            }
            end // 精确匹配，避免 / 匹配 /product
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.userActions}>
        <div className={`${styles.cart} ${styles.navItem}`} onClick={handleCartClick}>
          <Badge
            count={totalItems}
            style={{
              padding: '2px 3px 0 0',
            }}
          >
            <Typography.Text bold={false} className={styles.cartText}>
              购物车
            </Typography.Text>
          </Badge>
        </div>

      </div>
    </header>
  );
};

export default Navbar;