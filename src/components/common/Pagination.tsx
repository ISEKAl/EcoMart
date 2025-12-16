// 分页器组件
import React from 'react';
import { Pagination as ArcoPagination } from '@arco-design/web-react';
import styles from './Pagination.module.css';

// 分页器属性接口
interface PaginationProps {
  // 总条数
  total?: number;
  // 当前页码
  current?: number;
  // 每页条数
  pageSize?: number;
  // 页码改变回调
  onChange?: (current: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  total,
  current,
  pageSize,
  onChange,
}) => {
  const handlePageChange = (newCurrent: number) => {
    if (onChange) {
      onChange(newCurrent);
    }
  };

  return (
      <ArcoPagination
        className={styles.pagination}
        total={total}
        current={current}
        defaultPageSize={pageSize}
        onChange={handlePageChange}
        showTotal        
        showJumper
      />
  );
};

export default Pagination;