import React, {StrictMode} from 'react'
import ReactDOM from 'react-dom/client'

import {RouterProvider,} from 'react-router-dom';
import router from "@/router/index.jsx";
import '@/assets/css/design/index.less'

import 'dayjs/locale/zh-cn';
import {ConfigProvider} from "antd";
import zhCN from 'antd/locale/zh_CN';

// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import dayjs from 'dayjs';

dayjs.locale('zh-cn');
import 'virtual:svg-icons-register';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    // <StrictMode>
        <ConfigProvider locale={zhCN}
            theme={{
                token: {
                    // Seed Token，影响范围大
                    colorPrimary: '#b37feb',
                }
            }}
        >
            <RouterProvider router={router}/>
        </ConfigProvider>

    // </StrictMode>
);
