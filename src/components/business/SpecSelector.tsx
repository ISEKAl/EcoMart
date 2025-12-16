// 规格选择器组件
import React from 'react';
import { Radio, Typography } from '@arco-design/web-react';
import type { ProductDetail as ProductDetailType } from '../../stores/productStore';
import styles from './SpecSelector.module.css';
import useProductStore from '../../stores/productStore';

const SpecSelector: React.FC<{ options?: ProductDetailType['options'] }> = ({ options }) => {
  const selectedOptions = useProductStore((state) => state.selectedOptions);
  const setSelectedOptions = useProductStore((state) => state.setSelectedOptions);

  function handleOptionChange(type: string, value: string): void {
    //{}既可以用于对象的结构，也可以用于对象的构造。
    //这里就是构造对象，效果是在selectedOptions的基础上，添加或更新键值对[type]:value
    setSelectedOptions({ ...selectedOptions, [type]: value });
  }

  return (
      <div className={styles.specOptions}>
              {options?.map((option, index) => (
                <div key={index} className={styles.specItem}>
                  <Typography.Text className={styles.specTypeTitle}>
                    {option.type}
                  </Typography.Text>
                  
                  <Radio.Group
                    defaultValue={selectedOptions[option.type]}
                    // defaultValue={'white'}
                    onChange={(value: string) => handleOptionChange(option.type, value)}
                    type="button"
                  >
                    {option.options.map((specOption) => (
                      <Radio
                        key={specOption.label}
                        value={specOption.label}
                        style={{ marginRight: '10px', marginBottom: '10px' }}
                      >
                        {specOption.label}
                      </Radio>
                    ))}
                  </Radio.Group>
                </div>
              ))}
            </div>
  )
};

export default SpecSelector;