// 商品详情页组件

//TODO 参考京东商品详情页,把选择规格区放到右边并且随页面滚动吸顶
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { 
  Button, 
  Typography, 
  Image, 
  Space, 
  Divider, 
  Carousel, 
  Grid, 
  Tag,
  InputNumber
} from '@arco-design/web-react';
import ProductCard from '../business/ProductCard';
import styles from './ProductDetail.module.css';
import useProductStore from '../../stores/productStore';
import SpecSelector from '../business/SpecSelector';

const ProductDetail: React.FC = () => {
  // 获取URL参数
  const { id } = useParams<{ id: string }>();
  // const product = useLocation().state?.product as Product;
  
  // 导航对象，用于返回
  const navigate = useNavigate();
  // 从productStore获取当前商品
  const currentProduct = useProductStore(state => state.currentProduct);
  // 商品详情状态
  const currentProductDetail = useProductStore(state => state.currentProductDetail);
  const fetchCurrentProductDetail = useProductStore(state => state.fetchCurrentProductDetail);
  // 推荐商品状态
  const recommendProducts = useProductStore(state => state.recommendProducts);
  const fetchRecommendProducts = useProductStore(state => state.fetchRecommendProducts);
  // 加载状态
  const loading = useProductStore(state => state.loading);
  // 当前选中的规格
  const selectedOptions = useProductStore(state => state.selectedOptions);
  const setSelectedOptions = useProductStore(state => state.setSelectedOptions);
  // 当前选中的图片索引
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  //首次：curretProduct->selectedOptios->fetch currentProductDetail 合并原currentProduct 合并selectedOptions
  //更新规格：selectedOptions->fetch currentProductDetail 合并原currentProduct 合并selectedOptions
  // 组件挂载时获取数据
  useEffect(() => {
      console.log("组件挂载：获取推荐商品")
      fetchRecommendProducts(4);
  }, []);

  // useEffect(() => {
  //   //把currentProduct的属性融入到currentProductDetail中
  //   if(currentProduct) {
  //     // BUG：不要用Object.assign修改store状态中的对象!!!应该用且只能用set修改
  //     //      setCurrentProductDetail直接简单粗暴使用set的值更新
  //     //      这么写没有改变store状态中currentProductDetail的引用
  //     //      zustand监听状态用的是浅比较，所以如果状态是对象，那么比较的就是对象的引用
  //     //      回到最开始我们用useProductStore(state => state.currentProductDetail)
  //     //      这里拿到的是状态的引用，所以下面一通操作直接修改了store的状态
  //     //      但是引用没变，所以zustand的浅比较没发现改变，就不会触发重渲染

  //     // BUG: 异步状态更新冲突
  //     //      理想的状况应该是先获取currentProductDetail，再获取currentProduct，
  //     //      然后把currentProduct的值融入到currentProductDetail中，再开始渲染。
  //     //      但是实际上是先获取了currentProduct，然后触发useEffect开始融入，
  //     //      这时候又获取了currentProductDetail更新了状态，
  //     //      导致currentProduct的属性丢失了
  //     //      所以实际渲染的时候有商品图片等内容，但是没有商品规格
  //     //
  //     //      解决方法：
  //     //      修改fetchCurrentProductDetail逻辑
  //     //      对获取到的数据和原来的currentProductDetail进行合并
  //     //      这样原来的
  //     const newDetail = {
  //       ...currentProductDetail,
  //       ...currentProduct,
  //     } as ProductDetailType;

  //     console.log("合并商品信息")
  //     setCurrentProductDetail(newDetail);

  //     //报错原因,newDetail这么复制，它的属性全是可选值（即可以为undefined）
  //     //而可能为undefine的属性是不能赋值给必须要求值的属性的，比如imgUrls
  //     //所以就报错了，不让你传newDetail进去
  //     //所以要把newDetail显式转成ProductDetailType类型
  //   }
  // }, [currentProductDetail])
  
  useEffect(() => {
    // 当currentProduct加载时，更新selectedSpecs
    console.log("设置默认的选择规格")
    setSelectedOptions(currentProduct?.selectedOptions || {});
  }, [currentProduct]);

  useEffect(() => {
    // 每当用户改变选择的规格，就重新请求商品详情
    if(id){
      fetchCurrentProductDetail(id, selectedOptions);
    }
  }, [selectedOptions]);

  // useEffect(() => {
  //   // 当selectedOptions更新时，更新currentProductDetail的selectedOptions
  //   setCurrentProductDetail({
  //     ...currentProductDetail,
  //     selectedOptions,
  //   } as ProductDetailType);
  // }, [selectedOptions]);



  // 返回商品列表页
  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>加载中...</div>;
  }

  if (!currentProductDetail) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>商品不存在</div>;
  }

  return (
    <div className={styles.container}>
      {/* 内容容器 */}
      <div className={styles.content}>
        {/* 返回按钮 */}
        <div className={styles.backButtonArea}>
          <Button type="primary" onClick={handleBack}>
            返回商品列表
          </Button>
        </div>

        {/* 商品标题和标签 */}
        <div className={styles.titleArea}>
          <Typography.Title heading={2} style={{ marginBottom: '10px' }}>
            {currentProductDetail.title}
          </Typography.Title>
          <Space>
            <Typography.Text style={{ fontSize: '24px', fontWeight: '600', color: '#f53f3f' }}>
              ¥{currentProductDetail.price?.toFixed(2) || '0.00'}
            </Typography.Text>
            {currentProductDetail.originalPrice && (
              <Typography.Text style={{ color: '#86909c', textDecoration: 'line-through' }}>
                ¥{currentProductDetail.originalPrice.toFixed(2)}
              </Typography.Text>
            )}
            <Typography.Text style={{ color: '#86909c' }}>
              销量 {currentProductDetail.sales || 0}
            </Typography.Text>
            <Space size="small">
              {currentProductDetail.tags?.map((tag, index) => (
                <Tag key={index} color="blue">
                  {tag}
                </Tag>
              )) || []}
            </Space>
          </Space>
        </div>

        {/* 核心内容区域：左侧轮播 + 右侧规格 */}
        <div className={styles.mainContent}>
          {/* 左侧：商品图片轮播区 + 缩略图区域 
              1.更改轮播图-Carousel组件触发onChange事件，更新activeImageIndex,缩略图的CSS样式用到了activeImageIndex触发重新渲染
              2.更改缩略图-缩略图容器触发onClick事件，更新activeImageIndex,Carousel组件的currentIndex也会更新,触发重新渲染
          */}
          <div className={styles.imageSection}>
            {/* 商品图片轮播 */}
            <Carousel 
              className={styles.carousel}
              currentIndex={activeImageIndex}
              onChange={(index) => setActiveImageIndex(index)}
            >
              {currentProductDetail.imageUrls?.map((url, index) => (
                <div key={index} style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image
                    width="100%"
                    height="100%"
                    src={url}
                    alt={`${currentProductDetail.title || '商品'} - 图片${index + 1}`}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              )) || (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image
                    width="100%"
                    height="100%"
                    src="//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb420cf7746a5183ba481512b09.png~tplv-uwbnlip3yd-webp.webp"
                    alt="商品图片"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              )}
            </Carousel>

            {/* 商品图片缩略图区域 */}
            <div className={styles.thumbnailContainer}>
              {currentProductDetail.imageUrls?.map((url, index) => (
                <div 
                  key={index}
                  className={`${styles.thumbnailItem} ${activeImageIndex === index ? '' : styles.inactive}`}
                  onClick={() => {
                    setActiveImageIndex(index)
                  }}
                >
                  <Image
                    width="100%"
                    height="100%"
                    src={url}
                    alt={`缩略图${index + 1}`}
                    className={styles.thumbnailImage}
                    preview={false}
                  />
                </div>
              )) || (
                <div className={styles.thumbnailItem}>
                  <Image
                    width="100%"
                    height="100%"
                    src="//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a8c8cdb420cf7746a5183ba481512b09.png~tplv-uwbnlip3yd-webp.webp"
                    alt="缩略图"
                    className={styles.thumbnailImage}
                    preview={false}
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* 右侧：规格选择区 */}
          <div className={styles.specSection}>
            <Typography.Title heading={4} className={styles.specTitle}>
              选择规格
            </Typography.Title>

            {/* 规格选择 */}
            <SpecSelector 
              options={currentProductDetail.options || []}
            />

            <Divider />

            {/* 购买数量 */}
            <div className={styles.quantitySection}>
              <Typography.Text className={styles.specTitle}>
                购买数量
              </Typography.Text>
                <InputNumber
                  defaultValue={1}
                  className={styles.quantitySelector}
                  mode="button"
                  size="large"
                />
            </div>

            <Divider />

            {/* 购买按钮 */}
            <Space className={styles.buyButtonArea}>
              <Button 
                type="primary" 
                size="large" 
                className={styles.buyButton}
              >
                加入购物车
              </Button>
              <Button 
                type="primary" 
                size="large" 
                className={styles.buyButton}
              >
                立即购买
              </Button>
            </Space>
          </div>
        </div>

        <Divider />

        {/* 规格参数 */}
        <div className={styles.specParams}>
          <Typography.Title heading={3} style={{ marginBottom: '20px' }}>
            规格参数
          </Typography.Title>
          <div className={styles.specParamsList}>
            {currentProductDetail.specs?.map((spec, index) => (
              <div key={index} className={styles.specParamItem}>
                <div className={styles.specParamName}>{spec.name}</div>
                <div>{spec.value}</div>
              </div>
            )) || (
              <Typography.Text style={{ color: '#86909c' }}>
                暂无规格参数
              </Typography.Text>
            )}
          </div>
        </div>

        <Divider />

        {/* 商品描述 */}
        <div className={styles.descriptionSection}>
          <Typography.Title heading={3} style={{ marginBottom: '20px' }}>
            商品描述
          </Typography.Title>
          <Typography.Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
            {currentProductDetail.description || '暂无商品描述'}
          </Typography.Paragraph>
        </div>

        <Divider />

        {/* 推荐商品栏 */}
        <div className={styles.recommendSection}>
          <Typography.Title heading={3} style={{ marginBottom: '20px' }}>
            猜你喜欢
          </Typography.Title>
          
          {/* 使用Grid布局，每行4个商品 */}
          <Grid.Row gutter={[20, 20]} >
            {recommendProducts.map((item) => (
              <Grid.Col key={item.id} span={6}>
                <ProductCard
                  product={item}
                />
              </Grid.Col>
            ))}
          </Grid.Row>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;