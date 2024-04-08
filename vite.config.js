import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

import path, {join} from 'path'

import {createSvgIconsPlugin} from 'vite-plugin-svg-icons'


// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': join(__dirname, './src/')
        }
    },
    plugins: [
        react(),
        createSvgIconsPlugin({
            // 指定需要缓存的svg图标文件夹，即需要识别的svg都应该放在这个文件夹下
            iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
            // 指定symbolId格式（这里的配置与6.2步骤中的引入svg组件的name配置项写法有关）
            symbolId: 'icon-[dir]-[name]',
        }),
    ],
    server: {
        port: 8000,
    }
})
