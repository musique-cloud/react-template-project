import {createHashRouter, Navigate, redirect} from "react-router-dom";
import RouterGuard from "@/components/RouterGuard.jsx";
import WnLayout from "@/components/WnLayout.jsx";
import React, {lazy} from "react";
import {Spin} from "antd";
import Login from "@/pages/Login.jsx";
import ErrorPage from "@/components/ErrorPage.jsx";
import {getToken} from "@/utils/token.js";
import {cloneDeep} from 'lodash-es'
import {HomeFilled, SettingFilled} from '@ant-design/icons';


const slow = (comp, delay) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(comp), delay);
    });
};

// 路由懒加载
const Home = lazy(() => import('@/pages/Home.jsx'))
const Person = lazy(() => import('@/pages/system/Person.jsx'))
const PersonPwd = lazy(() => import('@/pages/system/PersonPwd.jsx'))
const Role = lazy(() => import('@/pages/system/Role.jsx'))
const User = lazy(() => import('@/pages/system/User.jsx'))

// 封装加载异步组件
const withLoadingComponent = (comp) => (
    <React.Suspense fallback={
        <Spin
            // 防止闪屏
            delay={1000}
            size='large'
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%'
            }}
        />
    }>{comp}</React.Suspense>
)

const permissionList = ["Home", "HomePage", "System", "UserList", "RoleList"]

const configurableMenu = [

    {
        meta: {
            // 是否需要权限判断，false: 不需要权限判断
            checkPerStatus: false,
            // 唯一code,用于权限判断
            code: 'Home',
            // 是否是隐藏路由，隐藏路由时，不需要push到左侧菜单结构里
            hiddenRoute: false,
            // 是否忽略该节点下的children,不push到左侧菜单结构里
            ignoreChildren: true,

            title: '首页',
            key: '/home',
            icon: <HomeFilled/>
        },

        path: '/home',
        element: <RouterGuard><WnLayout/></RouterGuard>,
        children: [
            {
                meta: {
                    // 是否需要权限判断，false: 不需要权限判断
                    checkPerStatus: false,
                    // 唯一code,用于权限判断
                    code: 'HomePage',
                    // 是否是隐藏路由，隐藏路由时，不需要push到左侧菜单结构里
                    hiddenRoute: false,
                    // 是否忽略该节点下的children,不push到左侧菜单结构里
                    ignoreChildren: true,

                    title: '',

                    key: ''
                },
                path: "",
                element: withLoadingComponent(<Home/>),
                children: []
            }
        ]
    },
    {
        meta: {
            // 是否需要权限判断，false: 不需要权限判断
            checkPerStatus: true,
            // 唯一code,用于权限判断
            code: 'System',
            // 是否是隐藏路由，隐藏路由时，不需要push到左侧菜单结构里
            hiddenRoute: false,
            // 是否忽略该节点下的children,不push到左侧菜单结构里
            ignoreChildren: false,

            title: '系统管理',

            // 菜单项的key，唯一
            key: '/system',
            icon: <SettingFilled />
        },
        path: '/system',
        element: <RouterGuard><WnLayout/></RouterGuard>,
        children: [
            {
                meta: {
                    // 是否需要权限判断，false: 不需要权限判断
                    checkPerStatus: true,
                    // 唯一code,用于权限判断
                    code: 'UserList',
                    // 是否是隐藏路由，隐藏路由时，不需要push到左侧菜单结构里
                    hiddenRoute: false,
                    // 是否忽略该节点下的children,不push到左侧菜单结构里
                    ignoreChildren: false,

                    title: '用户管理',
                    // 菜单项的key，唯一
                    key: '/system/user-list'
                },
                path: 'user-list',
                element: withLoadingComponent(<User/>),
                children: []
            },
            {
                meta: {
                    // 是否需要权限判断，false: 不需要权限判断
                    checkPerStatus: true,
                    // 唯一code,用于权限判断
                    code: 'RoleList',
                    // 是否是隐藏路由，隐藏路由时，不需要push到左侧菜单结构里
                    hiddenRoute: false,
                    // 是否忽略该节点下的children,不push到左侧菜单结构里
                    ignoreChildren: false,

                    title: '角色管理',

                    // 菜单项的key，唯一
                    key: '/system/role-list'
                },
                path: 'role-list',
                element: withLoadingComponent(<Role/>),
                children: []
            }
        ]
    },
]

const routes = [
    {
        path: "/",
        meta: {

            title: '/',
            // 菜单项的key，唯一
            key: '/',
            icon: null,
        },
        element: <Navigate to='/home'/>
    },
    {
        path: '/login',
        meta: {

            title: '登录',
            // 菜单项的key，唯一
            key: '/login',
            icon: null,
        },
        element: <Login/>,
        loader: () => {
            if (getToken()) {
                return redirect('/')
            }
            return null
        },
    },
    {
        meta: {

            title: '个人中心',
            // 菜单项的key，唯一
            key: '/person',
            icon: null,
        },
        path: '/person',
        element: <RouterGuard><WnLayout/></RouterGuard>,
        children: [
            {
                meta: {

                    title: '个人信息',
                    // 菜单项的key，唯一
                    key: '/person/person-center',
                    icon: null,
                },
                path: 'person-center',
                element: withLoadingComponent(<Person/>),
            },
            {
                meta: {

                    title: '修改密码',
                    // 菜单项的key，唯一
                    key: '/person/person-pwd',
                    icon: null,
                },
                path: 'person-pwd',
                element: withLoadingComponent(<PersonPwd/>),
            },
        ]
    },
    {
        meta: {

            title: '404',
            // 菜单项的key，唯一
            key: '/*',
            icon: null,
        },
        path: '/*',
        element: <ErrorPage/>,
    }
];

export function transformRouteToMenu() {

    const routeList = []
    configurableMenu.forEach(item => {
        if (!item.meta.checkPerStatus) {
            // 不需要判断权限【只判断一级的】
            routeList.push(item)
        } else {
            // 需要判断权限，并且返回的权限中存在
            if (permissionList.includes(item.meta.code)) {
                const t = cloneDeep(item)
                const c = []
                item.children.forEach(x => {
                    if (!x.meta.checkPerStatus) {
                        c.push(x)
                    } else {
                        if (permissionList.includes(x.meta.code)) {
                            c.push(x)
                        }
                    }
                })
                t.children = c
                routeList.push(t)
            }
        }
    })
    const _routeList = cloneDeep(routeList)

    const menuItems = []
    configurableMenu.forEach(item => {
        if (!item.meta.checkPerStatus || (permissionList.includes(item.meta.code))) {
            // 不需要判断权限【只判断一级的】,或者需要权限并且在返回的权限里

            if (item.meta.hiddenRoute) {
                // 是隐藏路由,do nothing
            } else {
                let i = getItem(item.meta.title, item.meta.key, undefined, item.meta.icon)
                if (item.meta.ignoreChildren) {
                    // 忽略子节点
                    i.children = undefined
                } else {
                    const c = []
                    item.children.forEach(x => {
                        if (!x.meta.checkPerStatus || permissionList.includes(x.meta.code)) {
                            if (x.meta.hiddenRoute) {
                                // 是隐藏路由,do nothing
                            } else {
                                c.push(getItem(x.meta.title, x.meta.key, undefined, x.meta.icon))
                            }
                        }
                    })
                    i.children = c.length === 0 ? undefined : c
                }
                menuItems.push(i)
            }
        }
    })

    const _menuItems = cloneDeep(menuItems)

    return {_routeList, _menuItems}
}


export const topItems = [
    {
        key: '/person/person-center',
        label: '个人信息',
    },
    {
        key: '/person/person-pwd',
        label: '修改密码',
    },
    {
        key: 'logout',
        label: '退出系统',
    },
];

export const {_routeList, _menuItems} = transformRouteToMenu()

function getItem(label, key, children, icon) {
    return {
        label, key, children, icon
    };
}
routes.splice(2, 0, ..._routeList)
export {routes};
const router = createHashRouter(routes);
export default router;