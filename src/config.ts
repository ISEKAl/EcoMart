
// 集中管理应用配置，同时被 Vite 和 React 应用读取
// 而且也要支持开发环境和生产环境的区分
// 基本的思路是定义环境类型用于区分，把不同环境的配置集合到一个对象里
// 再用一个对象取当前环境的配置导出
// 为了不让外界感知到环境，应该在该文件中设置当前环境并根据当前环境设置导出的具体对象

type Environment = 'development' | 'production'
//在这里配置当前环境
const currentEnv: Environment = 'production';

const environments ={
    development: {
        basePath: '/',
        apiBaseUrl: '/api',
        appTitle: '电商平台',
    },
    production: {
        basePath: '/EcoMart/',
        apiBaseUrl: '/api',
        appTitle: '电商平台',
    },
}



// 导出配置
export const config=environments[currentEnv];