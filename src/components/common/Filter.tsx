// 筛选组件
import React, { useState, useEffect } from 'react';
import styles from './Filter.module.css';
import { Checkbox, Button, Collapse, Radio } from '@arco-design/web-react';
import useProductStore from '../../stores/productStore';


// 筛选选项接口
interface FilterOption {
  label: string;
  value: string;
}

const Filter: React.FC<{ folded?: boolean }> = ({ folded = false }) => {
  // 筛选条件状态

  // BUG：不能下面这样写！！！
  // useProductStore中的回调函数叫做Zustand的selector函数,执行后Zustand会对上一次selctor的结果进行引用相等性检查(===)
  // 很明显注释里这样写每次都是新的对象，是过不了===的，就会触发重渲染
  // 重渲染->修改store状态->
  //
  // const {filters, setFilters} = useProductStore((state) => ({
  //   filters: state.filters,
  //   setFilters: state.setFilters,
  // }));
  const filters = useProductStore((state) => state.filters);
  const setFilters = useProductStore((state) => state.setFilters);
  

  // 在手机端如果Filter触发了Affix的跟随，就收起Filter
  // 半受控状态：内部维护activeKeys，同时受外部folded影响
  const [activeKeys, setActiveKeys] = useState<string[]>(['filter']);

  // 当folded变化时，如果是true，自动收起
  useEffect(() => {
    if (folded) {
      setActiveKeys([]);
    }
    else {
      setActiveKeys(['filter']);
    }
  }, [folded]);

  // 处理用户手动展开/收起
  const handleCollapseChange = (_key: string, keys: string[]) => {
    setActiveKeys(keys);
  };

  // 筛选选项数据
  const categoryOptions: FilterOption[] = [
    { label: '手机', value: '手机' },
    { label: '电脑', value: '电脑' },
    { label: '平板', value: '平板' },
    { label: '耳机', value: '耳机' },
    { label: '智能手表', value: '智能手表' },
  ];

  const priceOptions: FilterOption[] = [
    { label: '0-500元', value: '0-500' },
    { label: '500-1000元', value: '500-1000' },
    { label: '1000-2000元', value: '1000-2000' },
    { label: '2000元以上', value: '2000+' },
  ];

  const salesOptions: FilterOption[] = [
    { label: '销量从高到低', value: 'high' },
    { label: '销量从低到高', value: 'low' },
  ];

  // 重置筛选
  const handleReset = () => {
    setFilters({
      category: undefined,
      price: undefined,
      sales: undefined,
    });
  };

  // 应用筛选
  const handleApply = () => {
    const newFilters={
      category: filters.category && filters.category.length > 0 ? filters.category : undefined,
      price: filters.price && filters.price.length > 0 ? filters.price : undefined,
      sales: filters.sales && filters.sales.length > 0 ? filters.sales : undefined,
    };

    setFilters(newFilters);

    console.log('应用筛选:', newFilters);
  };

  return (
    <Collapse
      className={`${styles.filter} ${folded ? styles.folded : ''}`}
      activeKey={activeKeys}
      onChange={handleCollapseChange}
      expandIcon={<></>}
      // bordered={false}
    >
      <Collapse.Item
        name="filter"
        header={<div className={styles.filterTitle}>筛选条件</div>}
        contentStyle={{ padding: 0}}
        >

        <Collapse
          defaultActiveKey={['category', 'price', 'sales']}
          expandIcon={<></>}
          style={{ padding: 0}}
          bordered={false}
        >

          <Collapse.Item name="category" 
          header={<div className={styles.filterSectionTitle}>商品分类</div>}
          contentStyle={{  }}
          >
            {/* 商品分类 */}
            <div className={styles.filterSection}>

              <div className={styles.filterOptions}>
                <Checkbox.Group
                  defaultValue={filters.category}
                  value={filters.category}
                  onChange={(checkedValues) => setFilters({  category: checkedValues as string[] })}
                  // options={categoryOptions}
                  // 配置复选框组，两种方式，一种就是注释里配置options，另一种是现在的children方式
                >
                  {categoryOptions.map((option) => (
                    <Checkbox key={option.value} value={option.value} className={styles.filterOption}>
                      {option.label}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </div>
            </div>
          </Collapse.Item>


          <Collapse.Item name="price" header={<div className={styles.filterSectionTitle}>价格区间</div>}>
            {/* 价格区间 */}
            <div className={styles.filterSection}>

              <div className={styles.filterOptions}>
                <Radio.Group
                  defaultValue={filters.price}
                  value={filters.price}
                  onChange={(checkedValue) => setFilters({ price: checkedValue as string })}
                >
                  {priceOptions.map((option) => (
                    <Radio key={option.value} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </div>
            </div>
          </Collapse.Item>


          <Collapse.Item name="sales" header={<div className={styles.filterSectionTitle}>销量排序</div>}>
            {/* 销量排序 */}
            <div className={styles.filterSection}>

              <div className={styles.filterOptions}>
                <Radio.Group
                  defaultValue={filters.sales}
                  value={filters.sales}
                  onChange={(checkedValue) => setFilters({ sales: checkedValue as string })}
                >
                  {salesOptions.map((option) => (
                    <Radio key={option.value} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </div>
            </div>
          </Collapse.Item>

          <div className={styles.filterActions}>
            <Button
              className={styles.filterButton}
              type="secondary"
              onClick={handleReset}
            >
              重置
            </Button>
            <Button
              className={styles.filterButton}
              type="primary"
              onClick={handleApply}
            >
              应用
            </Button>
          </div>
        </Collapse>
      </Collapse.Item>

    </Collapse>




  );
};

export default Filter;
