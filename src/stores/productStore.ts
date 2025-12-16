import { create } from 'zustand';
/* 
  zustand怎么设计一个store ?
  1. 类型定义：明确store中数据和方法的类型
  2. 初始状态：定义store的初始状态（默认值），包括数据和方法
  3. 状态更新方法：用于修改Store状态的函数
*/

// 商品分类类型

// 商品数据接口
interface Product {
  id: string;
  imageUrl: string;
  title: string;
  price: number;
  sales: number;
  tags?: string[];
  category?: string[];
  // 商品有哪些规格，和已经选了什么规格
  options?: {
    type: string; //颜色
    options: {
      label: string; //黑色
      value: string; //black
    }[];
  }[];
  selectedOptions?: { [key: string]: string }; // {'颜色': '黑色', '版本': '标准版'}
  
}

// 商品详情接口
interface ProductDetail extends Product {
  imageUrls: string[];
  originalPrice: number;
  description: string;
  specs: {
    name: string;
    value: string;
  }[];
  
}

// 导入axios和mock配置
import axios from 'axios';
// 引入Mock配置，初始化mock
import '../mock';

// 配置axios基础路径
axios.defaults.baseURL = '/api';

// 筛选条件接口
interface Filters {
  category: string[];
  price: string;
  sales: string;
}

// 分页信息接口
interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}



// Product Store状态接口
interface ProductStore {
  // 商品列表
  products: Product[];
  // 当前选中商品（用于页面间传递）
  currentProduct: Product | null;
  // 当前商品详情（用于详情页）
  currentProductDetail: ProductDetail | null;
  // 推荐商品列表
  recommendProducts: Product[];
  // 选中的商品规格
  selectedOptions: { [key: string]: string };
  // 筛选条件
  filters: Filters;
  // 分页信息
  pagination: Pagination;
  // 加载状态
  loading: boolean;
  error: string | null;
  
  // 方法
  // 获取商品列表
  fetchProducts: () => Promise<void>;
  // 设置筛选条件
  setFilters: (filters: Partial<Filters>) => void;
  // 重置筛选条件
  resetFilters: () => void;
  // 设置分页信息
  setPagination: (pagination: Partial<Pagination>) => void;
  // 设置当前选中商品
  setCurrentProduct: (product: Product | null) => void;
  // 设置当前商品详情
  setCurrentProductDetail: (detail: ProductDetail | null) => void;
  // 获取当前商品详情
  fetchCurrentProductDetail: (id: string, selectedOptions: { [key: string]: string }) => Promise<void>;
  // 设置推荐商品
  setRecommendProducts: (products: Product[]) => void;
  // 请求推荐商品
  fetchRecommendProducts:(num:number) => Promise<void>,
  
  // 设置选中的商品规格
  setSelectedOptions: (options: { [key: string]: string }) => void;
}

// 创建Product Store
// useProductStore本质上是一个react hook，就像useState3 useEffect一样
const useProductStore = create<ProductStore>((set) => ({
  // 初始状态
  products: Array.from({length:12},(_,i) => ({
    id:i.toString(),
    imageUrl:'',
    title:`商品${i+1}`,
    price:100,
    sales:1000,
  })),
  currentProduct: null,
  currentProductDetail: null,
  recommendProducts: [],
  selectedOptions: {},
  filters: {
    category: [],
    price: '',
    sales: '',
  },
  pagination: {
    current: 1,
    pageSize: 12,
    total: 100,
  },
  loading: false,
  error: null,

  // 请求商品列表
  fetchProducts: async () => {

    set({ loading: true, error: null });
    try {
      const { current, pageSize } = useProductStore.getState().pagination;
      // 使用axios发送GET请求，获取商品列表
      console.log("发起请求商品列表,参数为:", {
        page: current,
        pageSize: pageSize
      });
      const response = await axios.get('/products', {
        params: {
          page: current,
          pageSize: pageSize
        }
      });
      
      const { list: products } = response.data.data;
      
      set({ products: products as Product[], loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '获取商品列表失败', 
        loading: false 
      });
    }
    finally{
      set({ loading: false });
    }
  },

  // 请求当前商品详情
  fetchCurrentProductDetail: async (id: string, selectedOptions: { [key: string]: string }={}) => {
    set({ loading: true, error: null });
    try {
      // 使用axios发送GET请求，获取商品详情
      // 应该带上selectedOptions，因为不同的选项被视作不同的商品
      const response = await axios.get(`/products/${id}`, {
        params: {
          selectedOptions: selectedOptions,
        }
      });
      
      // 从响应中提取商品详情数据
      const mockProductDetail = response.data.data;
      
      const finalData = {
        //当请求到新的mockdata后，覆盖的顺序应该是
        //原productDetail(原状态)-原product(所有选项)-mock(新请求的数据，比如价格)-selectedOptions(新选项)
        ...useProductStore.getState().currentProductDetail,
        ...useProductStore.getState().currentProduct,
        ...mockProductDetail,
        ...selectedOptions,
      } as ProductDetail;
      
      set({ currentProductDetail: finalData, loading: false });

    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '获取商品详情失败', 
        loading: false 
      });
    }
    finally{
      set({ loading: false });
    }
  },

  // 设置筛选条件
  setFilters: (filters: Partial<Filters>) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters,
      },
    }));
    //如果销量排序改变，那么应该让product按照销量排序
    
  },

  // 重置筛选条件
  resetFilters: () => {
    set({ 
      filters: { 
        category: [], 
        price: '', 
        sales: '' 
      },
    });
  },

  // 设置分页信息
  setPagination: (pagination: Partial<Pagination>) => {
    set((state) => ({
      pagination: {
        ...state.pagination,
        ...pagination,
      },
    }));
  },
  
  // 设置当前选中商品
  setCurrentProduct: (product: Product | null) => {
    set({ currentProduct: product });
  },
  
  // 设置当前商品详情
  setCurrentProductDetail: (detail: ProductDetail | null) => {
    set({ currentProductDetail: detail });
  },
  
  // 设置推荐商品
  setRecommendProducts: (products: Product[]) => {
    set({ recommendProducts: products });
  },

  // 请求推荐商品
  fetchRecommendProducts: async (num: number)=>{
    set({ loading: true, error: null });
    try {
      // 使用axios发送GET请求，获取推荐商品
      const response = await axios.get('/products/recommend', {
        params: {
          num: num
        }
      });
      
      // 从响应中提取推荐商品数据
      const { list: recommendProducts } = response.data.data;
      
      set({ recommendProducts: recommendProducts as Product[], loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : '获取商品列表失败', 
        loading: false 
      });
    }
  },
  
  // 设置选中的商品规格
  setSelectedOptions: (options: { [key: string]: string }) => {
    set({ selectedOptions: options });
  },
}));

export type { Product, ProductDetail, Filters, Pagination };
export default useProductStore;
