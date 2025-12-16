import { create } from 'zustand';
import type { Product } from './productStore';

// 购物车商品接口
interface CartItem extends Product {
  // 购买数量
  quantity: number;
}

// Cart Store状态接口
interface CartStore {
  // 购物车商品
  items: CartItem[];
  // 总商品数
  totalItems: number;
  // 总价格
  totalPrice: number;
  // 购物车抽屉显示状态
  showCart: boolean;
  
  // 方法
  // 添加商品到购物车
  addToCart: (product: Product, quantity: number) => void;
  // 从购物车移除商品
  removeFromCart: (productId: string) => void;
  // 更新商品数量
  updateQuantity: (productId: string, quantity: number) => void;
  // 清空购物车
  clearCart: () => void;
  // 显示购物车
  setShowCart: (show: boolean) => void;
}

// 从localStorage加载购物车数据
const loadCartFromStorage = (): Omit<CartStore, 'addToCart' | 'removeFromCart' | 'updateQuantity' | 'clearCart' | 'setShowCart'> => {
  try {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      return {
        ...parsedCart,
        showCart: false, // showCart状态不持久化
      };
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
  }
  // 返回默认状态
  return {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    showCart: false,
  };
};

// 创建Cart Store
const useCartStore = create<CartStore>((set, get) => ({
  // 初始状态：从localStorage加载
  ...loadCartFromStorage(),

  // 添加商品到购物车
  addToCart: (product: Product, quantity: number = 1) => {
    console.log('addToCart:', product, quantity);
    const { items } = get();
    const existingItemIndex = items.findIndex(item => item.id === product.id);

    let updatedItems: CartItem[];
    
    if (existingItemIndex >= 0) {
      // 商品已存在，更新数量
      updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += quantity;
    } else {
      // 商品不存在，添加到购物车
      updatedItems = [...items, { ...product, quantity}];
    }



    // 更新购物车状态
    set(() => {
      // 计算总商品数
      // 同样是遍历数组,map和reduce的区别是，map转换数组元素，返回新数组。而reduce是规约数组元素，返回单一值
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      // 计算总价格
      const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // 保存到localStorage
      const cartState = {
        items: updatedItems,
        totalItems: totalItems,
        totalPrice: totalPrice,
      };
      localStorage.setItem('cart', JSON.stringify(cartState));

      return cartState;
    });
  },

  // 从购物车移除商品
  // TODO 这里有BUG,因为同一个商品可以有不同的选项,所以移除商品时,要根据选项来判断是否移除
  removeFromCart: (productId: string) => {
    set((state) => {
      const updatedItems = state.items.filter(item => item.id !== productId);
      // 重新计算总商品数和总价格
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // 保存到localStorage
      const cartState = {
        items: updatedItems,
        totalItems,
        totalPrice,
      };
      localStorage.setItem('cart', JSON.stringify(cartState));

      return cartState;
    });
  },

  // 更新商品数量
  updateQuantity: (productId: string, quantity: number) => {
    // 确保数量不小于1
    const validQuantity = Math.max(1, quantity);
    
    set((state) => {
      const updatedItems = state.items.map(item => 
        item.id === productId ? { ...item, quantity: validQuantity } : item
      );
      
      // 重新计算总商品数和总价格
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // 保存到localStorage
      const cartState = {
        items: updatedItems,
        totalItems,
        totalPrice,
      };
      localStorage.setItem('cart', JSON.stringify(cartState));

      return cartState;
    });
  },

  // 清空购物车
  clearCart: () => {
    const cartState = {
      items: [],
      totalItems: 0,
      totalPrice: 0,
    };

    // 保存到localStorage
    localStorage.setItem('cart', JSON.stringify(cartState));
    
    set(prevState => ({
      ...prevState,
      ...cartState,
    }));
  },
  
  // 显示/隐藏购物车抽屉
  setShowCart: (show: boolean) => {
    set({ showCart: show });
  },
}));

export type { CartItem };
export default useCartStore;
