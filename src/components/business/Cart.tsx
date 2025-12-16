// 购物车弹窗组件
import React from 'react';
import type { CartItem } from '../../stores/cartStore';
import useCartStore from '../../stores/cartStore';
import { Space, Typography, Drawer, Button, Divider } from '@arco-design/web-react';
import { IconPlus, IconMinus } from '@arco-design/web-react/icon';
import styles from './Cart.module.css';

//TODO 实现对购物车里的商品进行部分选择结算
//TODO 美化CartItem的商品加减组件，实现加减功能

const Cart: React.FC = () => {
  const { items, showCart, totalItems, totalPrice, setShowCart, clearCart } = useCartStore();

  // 继续购物 - 关闭抽屉
  const handleContinueShopping = () => {
    setShowCart(false);
  };

  // 去结算 - 这里可以添加跳转逻辑
  const handleCheckout = () => {
    console.log('去结算');
    setShowCart(false);
  };
  const isMobile = window.innerWidth <= 768;
  const drawerWidth = () => {
    //实现响应式购物车抽屉宽度
    return isMobile ? '100%' : '38.2%';
  }

  return (
    <Drawer
      title="购物车"
      placement="right"
      cancelText="关闭"
      okText="去结算"
      closable={true}
      width={drawerWidth()}
      visible={showCart}
      onCancel={() => setShowCart(false)}
      mask={true}
      maskClosable={true}
      className={styles.cartDrawer}

      footer={
        <Space direction='vertical' size='medium' className={styles.footerSpace}>
          <Typography.Text className={styles.totalText}>
            共 {totalItems} 件商品，合计
            <Typography.Text className={styles.totalPrice}>
              ¥{totalPrice.toFixed(2)}
            </Typography.Text>
          </Typography.Text>

          <div className={styles.footerButtons}>
            <Button type='default' onClick={clearCart}>清空购物车</Button>
            <Space>
              <Button type='default' onClick={handleContinueShopping}>继续购物</Button>
              <Button type='primary' onClick={handleCheckout}>去结算</Button>
            </Space>
          </div>
        </Space>
      }

    >
      {items.map((item, index) => {
        return (
          <div key={item.id}>
            {index > 0 && <Divider className={styles.divider}></Divider>}
            <ItemCard item={item} />
          </div>
        )
      })
      }
    </Drawer>

  );
};

// 购物车商品卡片组件
const ItemCard: React.FC<{ item: CartItem }> = ({ item }) => {
  const isMobile = window.innerWidth <= 768;
  const { title, imageUrl, price, quantity, selectedOptions } = item;
  return (
    <div className={styles.itemCard}>
      <img src={imageUrl} alt={title} className={styles.itemImage} />
      <Typography.Text className={styles.itemTitle}>
        {title}
      </Typography.Text>

      <Typography.Text className={styles.itemOptions}>
        {/* BUG: 这里实际渲染结果为'not selected'
              因为localStorage以前存了没有selectedOptions的数据，清空一下购物车就行

              BUG: 这里把选项转成字符串时，不能直接对selectedOptions用map
                  map只能对数组用，而selectedOptions是个对象，它的所有属性的值都是string类型
                  所以要先把它转成数组，再用map
           */}

        {selectedOptions ? Object.entries(selectedOptions).map(([key, value]) => `${key}:${value}`).join(' ') : 'not selected'}
      </Typography.Text>

      <Space direction={isMobile ? 'vertical' : 'vertical'}  
              size={0}
              align={isMobile ? 'end' : 'center'}
              className={styles.itemPriceQuantity}>
        <Typography.Text className={styles.itemPrice}>
          ¥{price.toFixed(2)}
        </Typography.Text>

        <Space size={0} className={styles.quantityControl}>
          <IconMinus />
          <Typography.Text>
            {quantity}
          </Typography.Text>
          <IconPlus />
        </Space>
      </Space>
    </div>
  );
};

export default Cart;