import Mock from 'mockjs';
Mock.setup({
  timeout: '1000-2000',
});

//图库
// 商品图片URL列表，可直接在mock/index.ts中使用
// 确保可访问的商品图片URL列表
const productImageUrls = Array.from({ length: 100 }, (_, i) => `https://picsum.photos/seed/${i}/200/300`);

//解析URL请求参数的工具函数
// const parseQueryParams = (queryString: string) => {
//   const params = new URLSearchParams(queryString);
//   return Object.fromEntries(params.entries());
// };

//工具函数，从给定数组中取随机a到b个元素的函数
const randomPick = <T>(arr: T[], a: number, b: number) : T[] | T => {
  const n = Mock.Random.natural(a, b);
  if(a==b && a==1){
    return Mock.Random.shuffle(arr).slice(0, 1)[0];
  }
  return Mock.Random.shuffle(arr).slice(0, n);
}


// 模拟商品列表接口
// 拦截的请求路径不能直接传字符串，需要用正则表达式，因为路径中包含查询参数
// 避免匹配到/api/products/id，只匹配/api/products或/api/products?params
// 使用正则表达式字面量，^和$确保精确匹配路径
Mock.mock(/^\/api\/products(\?.*)?$/, 'get', () => {
  //BUG:这个请求的表现很异常
  //    请求能正常发出并被Mock拦截
  //    但是没有打印第二个日志console.log("fetch拿到的返回商品列表(取其一):", products[0])
  //    加载态出现了很短的一段时间

  //原因在于之前return了一个Promise回去
  //Mock.js有自己的延迟配置方式，用Promise会导致Mock.js无法正确处理响应，从而返回空数据

  // 生成商品列表数据
  const products = Mock.mock({
    'list|100': [{ // 生成100个商品数据，供分页使用
      'id|+1': 1,
      'imageUrl': () => randomPick(productImageUrls, 1, 1),
      'title': '@cword(20, 30)',
      //怎么理解? price的值是1,然后会“重复”200到1000.2次,所以最后的取值范围就是200~1000.2
      //这里肯定Mock做了重载,对于数值的重复就是诚意重复次数,对于别的类型重复是组成列表
      'price|200-1000.2': 1,
      'sales|0-10000': 1,
      //BUG 跟我的预期不符，我想的是从这个列表里选取一到两个，实际上Mock的结果是把这个列表重复一到两次
      //BUG 不能直接调用randomPick函数，因为直接调用返回的是字符串，Mock会拿这个确定的字符串生成100次
      //    应该用lambda包装一下，让Mock.js在运行时调用这个函数
      'tags': () => randomPick(['新品', '热销'], 1, 2),
      'category': () => randomPick(['手机', '耳机', '鼠标', '键盘'], 1,4),
      'options': [
        {
          'type': '颜色',
          'options': [
            { 'label': '黑色', 'value': 'black' },
            { 'label': '白色', 'value': 'white' },
            { 'label': '蓝色', 'value': 'blue' },
            { 'label': '红色', 'value': 'red' },
          ]
        },
        {
          'type': '版本',
          'options': [
            { 'label': '标准版', 'value': 'standard' },
            { 'label': '专业版', 'value': 'professional' },
          ]
        },
      ],
      'selectedOptions': {
        '颜色': () => randomPick(['黑色', '白色', '蓝色', '红色'], 1,1),
        '版本': () => randomPick(['标准版', '专业版'], 1,1),
      },
    }]
  }).list;


  // 直接返回数据，Mock.js有自己的延迟配置
  // 如果要设置延迟，
  return {
    code: 200,
    message: 'success',
    data: {
      list: products,
    }
  };
});

// 模拟商品详情接口
// 使用正则表达式字面量，确保精确匹配路径
Mock.mock(/^\/api\/products\/\d+$/, 'get', (options: any) => {
  const id = options.url.match(/\/api\/products\/(\d+)/)?.[1] || '1';

  // 生成商品详情数据
  const productDetail = Mock.mock({
    'id': id,
    'imageUrl': () => randomPick(productImageUrls, 1, 1),
    'imageUrls': () => randomPick(productImageUrls, 3, 5),
    'title': '@cword(10, 20)',
    'price|200-1000.2': 1,
    'originalPrice|300-1200.2': 1,
    'sales|0-10000': 1,
    'tags': () => randomPick(['新品', '热销'], 1, 2),
    'category|1': ['手机', '耳机', '鼠标', '键盘', '其他'],
    'description': '@cparagraph(3, 5)',
    'specs|5-10': [{
      'name': '@cword(2, 4)',
      'value': '@cword(2, 8)',
    }],
    'options': [
      {
        'type': '颜色',
        'options': [
          { 'label': '黑色', 'value': 'black' },
          { 'label': '白色', 'value': 'white' },
          { 'label': '蓝色', 'value': 'blue' },
          { 'label': '红色', 'value': 'red' },
        ]
      },
      {
        'type': '版本',
        'options': [
          { 'label': '标准版', 'value': 'standard' },
          { 'label': '专业版', 'value': 'professional' },
        ]
      },
    ],
    'selectedOptions': {
      '颜色': '蓝色',
      '版本': '标准版',
    },
  });

  // 直接返回数据，Mock.js有自己的延迟配置
  return {
    code: 200,
    message: 'success',
    data: productDetail
  };
});

// 模拟推荐商品接口
// 避免匹配到/api/products/recommend/something，只匹配/api/products/recommend或/api/products/recommend?params
// 使用正则表达式字面量，^和$确保精确匹配路径
Mock.mock(/^\/api\/products\/recommend(\?.*)?$/, 'get', (options: any) => {
  const { num = 4 } = options.params || {};

  // 生成推荐商品数据
  const recommendProducts = Mock.mock({
    [`list|${num}`]: [{ // 生成指定数量的推荐商品
      'id|+1': 1000,
      'imageUrl': () => randomPick(productImageUrls, 1, 1),
      'title': '@cword(10, 20)',
      'price|200-1000.2': 1,
      'sales|0-10000': 1,
      'tags': () => randomPick(['新品', '热销'], 1, 2),
      'category': () => randomPick(['手机', '耳机', '鼠标', '键盘'], 1,4),
      'options': [
        {
          'type': '颜色',
          'options': [
            { 'label': '黑色', 'value': 'black' },
            { 'label': '白色', 'value': 'white' },
            { 'label': '蓝色', 'value': 'blue' },
            { 'label': '红色', 'value': 'red' },
          ]
        },
        {
          'type': '版本',
          'options': [
            { 'label': '标准版', 'value': 'standard' },
            { 'label': '专业版', 'value': 'professional' },
          ]
        },
      ],
      'selectedOptions': {
        '颜色': () => randomPick(['黑色', '白色', '蓝色', '红色'], 1,1),
        '版本': () => randomPick(['标准版', '专业版'], 1,1),
      },
    }]
  }).list;

  // 直接返回数据，Mock.js有自己的延迟配置
  return {
    code: 200,
    message: 'success',
    data: {
      list: recommendProducts
    }
  };
});

// 导出Mock实例
export default Mock;
