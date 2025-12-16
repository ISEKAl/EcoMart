// 商品列表页组件
import React, { useEffect, useState } from 'react';
import styles from './ProductList.module.css';
import { Layout, Typography, Affix, Pagination as ArcoPagination } from '@arco-design/web-react';

// 导入组件
import Filter from '../common/Filter';
import ProductCard from '../business/ProductCard';

//导入store

import useProductStore from '../../stores/productStore';

//√ 实现卡片的预加载骨架
//TODO 实现筛选和排序功能
//      类比分页器的状态管理方式

const ProductList: React.FC = () => {
  // 商品列表状态
  const { products, fetchProducts, loading } = useProductStore();
  useEffect(() => {
    fetchProducts()
  }, [ProductList]);

  useEffect(() => {
    if(loading===false){
      setFilteredProducts(products);
      console.log('filteredProducts', products);
    }
  }, [products]);

  //分页是前后端交互的一个重要场景
  //当数据量大于500条，就应该后端分页。
  //    前端筋负责传递参数，展示数据和交互控制。前端每次只请求一页数据，当切换页数或者修改筛选条件时重新请求
  //    根据这个来设计分页参数：前端参数第几页，每页多少条 | 筛选条件
  //        后端若收到页参数，则返回当前页数据、总条数、总页数
  //        后端若收到的是筛选条件，则应根据筛选条件返回第一页数据,总条数，总页数
  //    第二种参数设计方式是游标分页，适用于无限滚动，数据实时更新的场景：
  //        核心是前端监听滚动事件，当用户滑到页面底部，加载更多数据
  //        前端参数为上一页最后一条数据的唯一标识id，往后取多少条limit
  
  //接下来讨论小规模数据前端分页的情况
  //    前端请求接口，后端直接返回全量数据。所以接口参数没什么好设计的
  //    对于精准跳页场景，前端自己维护当前页码、每页条数、总条数、总页数
  //    对于无限滚动加载场景，类比游标分页方式
  //        前端维护已加载的条数loadCount，当滚动到页面底部，loadCount增加pageSize条数据
  //        然后进行后面pageSize条数据的增量渲染
  //    当触发页码变化，更新currentPage
  //    当触发筛选条件变化，更新筛选条件,并重置currentPage为1
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const filters = useProductStore((state) => state.filters);
  
  const [filteredProducts, setFilteredProducts] = useState(products); //筛选后的商品结果集
  
  useEffect(() => {
    //按种类和价格筛选
    //价格的格式是“a-b”
    //先按销量排好序，再按这两个条件筛
    //因为setFilteredProducts是异步的，所以不能连续调用多个set，这样获取不到最新状态
    //只能先赋值给一个临时变量，最后再setFilteredProducts

    let tempProducts = [...products];
    
    if(filters.sales === 'high'){
      tempProducts = tempProducts.sort((a, b) => b.sales - a.sales);
    }else if(filters.sales === 'low'){
      tempProducts = tempProducts.sort((a, b) => a.sales - b.sales);
    }

    if(filters.price && filters.price !== ''){
      const [minPrice, maxPrice] = filters.price.split('-').map(Number);
      console.log('minPrice', minPrice);
      console.log('maxPrice', maxPrice);
      tempProducts = tempProducts.filter(product => product.price >= minPrice && product.price <= maxPrice);
      console.log('tempProducts', tempProducts);
    }
    if(filters.category && filters.category.length > 0){
      //fiter的函数：
      //filter.category是product.category的子集才能过筛
      //即，filter.category中的每个元素都在product.category中
      tempProducts=tempProducts.filter(product =>{
        if(!filters.category||filters.category.length === 0){
          return true;
        }
        if(!product.category||product.category.length === 0){
          return false;
        }
        const sum=filters.category.reduce((prev , cur) => prev+=product.category?.includes(cur)?1:0,0)
        if(sum===filters.category.length){
          return true;
        }
        return false;
      })
    }
    setFilteredProducts(tempProducts);
    setCurrentPage(1);
  }, [filters]);

  const [folded, setFolded] = useState(false);




  // 处理页码变化
  const handlePageChange = (current: number) => {
    console.log('currentPage', current);
    setCurrentPage(current);
  };



  return (
    <div className={styles.productList}
      onScroll={(scrollEvent) => {
        const isMobile = window.matchMedia('(max-width:768px)').matches
        if (isMobile) {
          // console.log('滚动位移:', scrollEvent.currentTarget.scrollTop);
          setFolded(scrollEvent.currentTarget.scrollTop > 100);
        }
      }}
    >
      {/* 主要内容区域 */}
      <Layout.Content className={styles.container}>
        <div className={styles.mainContent}>
          {/* 左侧筛选组件 */}
          <Affix offsetTop={-1}
            //原本真正在滚动的容器是APP的Layout,现在修改成页面组件，同时也修改Target
            target={() => document.querySelector<HTMLElement>(`.${styles.productList}`)}
            className={styles.affix}>
            <div className={styles.filterSection}>
              <Filter folded={folded} />
            </div>
          </Affix>


          {/* 右侧商品列表和分页 */}
          <div className={styles.productSection + ' '}>
            {/* 商品列表标题和筛选结果 */}
            <div className={styles.productHeader}>
              <Typography.Title heading={4} className={styles.productTitle}>
                商品列表
              </Typography.Title>
              <Typography.Text className={styles.resultInfo}>
                共找到 {filteredProducts.length} 件商品
              </Typography.Text>
            </div>

            {loading && (
              <div className={styles.loadingIndicator}>
                加载中
              </div>
            )}

            {/* 商品网格 */}
            <div className={styles.productGrid}>
              {filteredProducts.length === 0 && (
                <div className={styles.noProduct}>
                  暂无商品
                </div>
              )}
              {filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((product) => (
                //TODO 条件渲染，根据筛选条件渲染商品
                // 筛选条件：分类、价格、销量
                // 分类：判断商品是否包含筛选分类
                // 价格：判断商品价格是否在筛选价格范围内
                // 只有当商品满足所有筛选条件时，才渲染商品卡片
                // 销量：按销量的顺序或倒序排列
                <ProductCard 
                  key={product.id}
                  product={product}
                  loading={loading}
                />
              ))}
            </div>

            {/* 分页器 */}
            <div className={styles.paginationSection}>
              <ArcoPagination
                total={filteredProducts.length}
                current={currentPage}
                pageSize={pageSize}
                  // 处理页码变化
                  // 逻辑如下：当分页器页码变化，执行ArcoPagination组件的onChange函数，分页器会把新页码作为参数传递给onChange函数
                  // 外部通过onChange回调函数可以获取到新页码，从而更新外部的当前页码currentPage
                  // 由于商品网格渲染时用了currentPage来切片，所以会触发商品网格的重渲染，展示新的页码的商品
                onChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </Layout.Content>
    </div>
  );
};

export default ProductList;