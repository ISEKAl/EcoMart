// 商品卡片组件

//该组件的CSS使用的是内联样式，最佳实践应该是CSS module?
import { Card, Typography, Tag, Popover, Skeleton, type SkeletonImageProps } from '@arco-design/web-react';
import { IconPlusCircleFill } from '@arco-design/web-react/icon';
import '@arco-design/web-react/dist/css/arco.css';
import useCartStore from '../../stores/cartStore';
import useProductStore from '../../stores/productStore';
import { useNavigate } from 'react-router-dom';

import type { Product } from '../../stores/productStore';
import styles from './ProductCard.module.css';

// 骨架屏的正确用法究竟是什么
// function ProductCard(product: Product, loading: boolean= false) {
const ProductCard: React.FC<{product: Product, loading?: boolean}> = ({product, loading=false}) => {
  // 在组件内部解构并设置默认值
  // 什么是解构：JS ES6引入的快捷赋值语法
  // 去掉一个属性值没有影响，只是少一个变量定义
  // 添加不存在的属性值会倍赋值为 undefined
  // 解构之后还能用原来的product对象
  // 修改解构出来的变量，比如title，不会影响product的title属性
  const {
    imageUrl,
    title,
    price,
    sales,
    tags = [],
  } = product;

  const addToCart = useCartStore(state => state.addToCart);
  const setCurrentProduct = useProductStore(state => state.setCurrentProduct);
  const navigate = useNavigate();

  return (
    /*布局：
      商品缩略图(嵌入商品标签)
      商品标题（两行）
      商品价格  商品销量
    */
    <Card
      className={`${styles.card}`}
      hoverable={true} //TODO 为什么没有悬浮效果 ？
      onClick={
        () => {
          setCurrentProduct(product);
          navigate(`/product/${product.id}`)
        }}


      //封面=商品缩略图
      cover={
        <Skeleton
          text={false}
          loading={loading}
          animation={true}
          image={{
            style: {
              width: '500px',
              height: '150px'
            }
          } as SkeletonImageProps}
        >
          <img
            className={styles.cardImage}
            src={imageUrl ? imageUrl : undefined}
            alt={title}
          />
        </Skeleton>
      }
      actions={[

      ]}
    >
      <Skeleton
        text={{ rows: 3 }}
        loading={loading}
        animation={true}
      >
        {/* 商品标签 
          条件渲染 {tags.length > 0 && (标签容器)}：用&&的短路特性判断是否渲染标签容器
          绝对定位在卡片的顶部左侧  
        */}
        {(tags && tags.length > 0) && (
          <div className={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <Tag key={index} color="blue">
                {tag}
              </Tag>
            ))}
          </div>
        )}
        {/* 商品标题（两行） */}
        <Typography.Text className={styles.productTitle}>
          {title}
        </Typography.Text>

        <div className={styles.priceContainer}>
          {/* 商品价格 */}
          <Typography.Text className={styles.productPrice}>
            ¥{price.toFixed(2)}
          </Typography.Text>

          {/* 加入购物车图标（最右边） */}
          <Popover
            content="加入购物车"
            popupHoverStay={false}
          // position='bottom'
          >
            <IconPlusCircleFill
              className={styles.cartIcon}
              onClick={(e) => {
                e.stopPropagation(); // 阻止事件冒泡，避免触发卡片的点击跳转
                addToCart(product, 1); // 添加商品到购物车
              }}
            />
          </Popover>
        </div>

        {/* 商品销量 */}
        <Typography.Text className={styles.productSales}>
          销量 {sales}
        </Typography.Text>
      </Skeleton>
    </Card>

  );
};

export default ProductCard;