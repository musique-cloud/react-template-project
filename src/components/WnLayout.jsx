/** @jsxImportSource @emotion/react */

import {matchRoutes, Outlet, useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useMemo, useState} from 'react';
import {Breadcrumb, Button, Dropdown, Layout, Menu, Tabs, theme} from 'antd';
import {_menuItems as items, routes, topItems} from "@/router/index.jsx";
import {removeToken} from "@/utils/token.js";
import {CloseOutlined, DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import {useSessionStorageState} from "ahooks";
import {cloneDeep} from "lodash-es";
const {Sider} = Layout;


// header高度
const headerHeight = 48

function WnLogo(props) {
    return <div
        onClick={props.onClick}
        className='side-logo'>
        <img style={{
            width: headerHeight - 15,
            height: headerHeight - 15,
        }} src="/src/assets/img/react.svg" alt="头像"/>
        {/*{!props.collapsed &&*/}
        <span className={props.collapsed ? "logo-title-hide" : "logo-title-show"}>项目标题</span>

    </div>;
}


function WnMenu(props) {
    return <Menu
        mode="inline"
        theme="dark"
        items={items}
        onClick={props.onClick}
        openKeys={props.openKeys}
        selectedKeys={props.selectedKeys}
        onOpenChange={props.onOpenChange}
    />;
}

function WnHeader(props) {
    return <div
        style={{
            display: "flex",
            height: headerHeight,
            justifyContent: "space-between"
        }}
    >

        <div
            style={{
                display: "flex",
            }}
        >
            <Button
                type="text"
                icon={props.collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                onClick={props.onClick}
                style={{
                    fontSize: "16px",
                    width: headerHeight,
                    height: headerHeight,
                }}
            />

            <Breadcrumb
                style={{
                    display: "flex",
                    alignItems: "center",
                }}
                items={props.items}
            />
        </div>


        <div style={{display: "flex", marginRight: 10, paddingLeft: 10, paddingRight: 10}}>
            <Dropdown
                menu={{
                    items: topItems,
                    onClick: props.clickTopMenuItem
                }}
                placement="bottomLeft"
            >

                <a style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    height: headerHeight,
                }} onClick={(e) => e.preventDefault()}>
                    <img style={{
                        width: headerHeight - 10,
                        height: headerHeight - 10,
                        borderRadius: headerHeight - 10
                    }} src="/src/assets/img/rabbit.jpg" alt="头像"/>
                    <DownOutlined/>
                </a>
            </Dropdown>
        </div>
    </div>;
}

export default function WnLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [breadcrumbs, setBreadcrumbs] = useState([])
    const {token: {colorBgContainer}} = theme.useToken();
    const navigate = useNavigate();
    const location = useLocation()
    const pathname = location.pathname
    const [openKeys, setOpenKeys] = useState([])
    const [selectedKeys, setSelectedKeys] = useState([pathname])


    useEffect(() => {
        let matchRouteList = matchRoutes(routes, pathname) || []
        matchRouteList = matchRouteList.filter(x => {
            return x?.route.meta.title
        })

        setSelectedKeys([pathname])
        setOpenKeys(getOpenKeys(matchRouteList))

        const breadcrumbList = matchRouteList.map(item => {
            const {title} = item?.route.meta
            return {
                title:
                    (
                        <>
                            {/*{<SvgIcon name={"bug"} color={"green"} iconStyle={{ marginRight: 20}} />}*/}
                            <span>{title}</span>
                        </>
                    )
            }
        })
        setBreadcrumbs(breadcrumbList)

    }, [pathname, collapsed])

    function getOpenKeys(matchRouteList) {
        const openKeys = []
        matchRouteList.forEach(key => {
            openKeys.push(key.pathname)
        })
        return openKeys.slice(0, -1)
    }

    function onClickMenuItem(domEvent) {
        navigate(domEvent.key);
    }

    function goHome() {
        navigate('/home')
    }

    function handleOpenChange(keys) {
        if (keys.length === 0 || keys.length === 1) return setOpenKeys(keys)
        const latestKey = keys[keys.length - 1]
        if (latestKey.includes(keys[0])) return setOpenKeys(keys)
        setOpenKeys([latestKey])
    }

    function onClickTopMenuItem(domEvent) {
        if (domEvent.key === 'logout') {
            removeToken()
            navigate('/login', {replace: true})
        } else {
            navigate(domEvent.key);
        }
    }

    function onToggleSideWidth() {
        setCollapsed(!collapsed)
    }

    const leftSideClassName = !collapsed ? 'left-side' : 'left-side-v2'
    const rightContentClassName = !collapsed ? 'right-content' : 'right-content-v2'

    return (

        <div className='main-body'>
            <Layout className={leftSideClassName}>
                <Sider
                    collapsedWidth={60} trigger={null} collapsible collapsed={collapsed}>
                    <WnLogo onClick={goHome} collapsed={collapsed} color={colorBgContainer}/>
                    <WnMenu onClick={onClickMenuItem} openKeys={openKeys} selectedKeys={selectedKeys}
                            onOpenChange={handleOpenChange} collapsed={collapsed}/>

                </Sider>
            </Layout>

            <div className={rightContentClassName}>
                <div className='right-content-header'>
                    <WnHeader collapsed={collapsed} onClick={onToggleSideWidth}
                              items={breadcrumbs} clickTopMenuItem={onClickTopMenuItem}/>
                    <TopScrollMenu pathname={pathname}/>

                </div>

                <div className='right-content-layout'>
                    <div className='right-content-content'>
                        <div style={{padding: 0}}>
                            <Outlet/>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}


const TopScrollMenu = ({pathname}) => {
    const navigate = useNavigate();
    const [tagsData, setTagsData] = useSessionStorageState('tagsData', {
        defaultValue: [{label: "首页", key: "/home", closable: false}],
    });
    const [selectedTag, setSelectedTag] = useSessionStorageState('selectedTag');
    const handleTabClick = (key) => {
        navigate(key)
    }

    const remove = (targetKey) => {
        let newActiveKey = selectedTag;
        let lastIndex = -1;
        tagsData.forEach((item, i) => {
            if (item.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        let _t = cloneDeep(tagsData)
        const newPanes = _t.filter((item) => item.key !== targetKey);
        if (newActiveKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex].key;
            } else {
                newActiveKey = newPanes[0].key;
            }
            navigate(newActiveKey)
        }

        setTagsData(newPanes);
        setSelectedTag(newActiveKey);
    };

    useEffect(() => {
        setSelectedTag(pathname)
        if (pathname === '/home') {
        } else {
            let tmp = tagsData.find(x => x.key === pathname)

            if (tmp) {
                // 已经存在，
            } else {
                setTagsData([...tagsData, {label: title, key: pathname, closable: true}])
            }
        }
    }, [pathname])
    const title = useMemo(() => {
        for (const item of routes) {
            if (item.meta.key === pathname) return item.meta.title
            if (item.children) {
                for (const c of item.children) {
                    if (c.meta.key === pathname) return c.meta.title
                }
            }
        }
        return null
    }, [pathname])

    const clickRightMenuItem = (domEvent, pathname, selectedTag) => {
        if (domEvent.key === 'left') {
            let tmp_tags_data = cloneDeep(tagsData)
            const index = tmp_tags_data.findIndex((obj) => obj.key === pathname);
            let _ = tmp_tags_data.splice(1, index - 1)
            setTagsData(tmp_tags_data)

            if (selectedTag !== pathname) {
                let x = tmp_tags_data.findIndex((obj) => obj.key === selectedTag);
                if (x < 0) {
                    // 剩余的菜单，不存在选中的，默认选中最新的最后一个
                    let p = tmp_tags_data.at(tmp_tags_data.length - 1).key
                    setSelectedTag(p)
                    navigate(p)

                } else {
                    // 剩余的菜单，存在选中的，不做操作
                }
            }
        }
        if (domEvent.key === 'right') {
            let tmp_tags_data = cloneDeep(tagsData)
            const index = tmp_tags_data.findIndex((obj) => obj.key === pathname);
            // 0,1,2,3,4
            let _ = tmp_tags_data.splice(index + 1, tmp_tags_data.length - index - 1)
            setTagsData(tmp_tags_data)

            if (selectedTag !== pathname) {
                let x = tmp_tags_data.findIndex((obj) => obj.key === selectedTag);
                if (x < 0) {
                    // 剩余的菜单，不存在选中的，默认选中最新的最后一个
                    let p = tmp_tags_data.at(tmp_tags_data.length - 1).key
                    setSelectedTag(p)
                    navigate(p)
                } else {
                    // 剩余的菜单，存在选中的，不做操作
                }
            }

        }
        if (domEvent.key === 'other') {
            let tmp_tags_data = cloneDeep(tagsData)
            const index = tmp_tags_data.findIndex((obj) => obj.key === pathname);
            // 0,1,2,3,4
            let tmp = tmp_tags_data.splice(index, 1)
            if (index !== 0) {
                tmp.unshift(tmp_tags_data[0])
            }
            setTagsData(tmp)
            if (selectedTag !== pathname) {
                if (selectedTag !== '/home') {
                    setSelectedTag(pathname)
                    navigate(pathname)
                }
            }
        }
        if (domEvent.key === 'all') {
            let tmp_tags_data = cloneDeep(tagsData)
            setTagsData([tmp_tags_data[0]])
            if (selectedTag !== '/home') {
                setSelectedTag('/home')
                navigate('/home')
            }
        }
    }

    const rightClickItems = [
        {key: 'left', label: '关闭左侧'},
        {key: 'right', label: '关闭右侧'},
        {key: 'other', label: '关闭其它'},
        {key: 'all', label: '关闭所有'},
    ]

    const tabItems = useMemo(() => {
        return tagsData.map(tab => {
            return {
                ...tab,
                label: renderTabTitle(tab),
            }
        })
    }, [tagsData, selectedTag]);

    function renderTabTitle(tab) {
        return (
            <Dropdown
                icon={<DownOutlined />}
                trigger={['contextMenu']}
                menu={{items: rightClickItems, onClick: (e) => clickRightMenuItem(e, tab.key, selectedTag)}}
            >
                <Button
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: 'center'
                    }}
                    size='small' type={selectedTag === tab.key ? 'primary' : ''}
                >

                    <span onClick={() => handleTabClick(tab.key)}>{tab.label}</span>
                    {tab.closable && <CloseOutlined onClick={() => remove(tab.key)} className="top-tag-hover-del"/>}
                </Button>
            </Dropdown>

        )
    }

    return (
        <div
            id='wn-layout-uni'
            style={{
            height: 32,
            paddingLeft: 16,
        }}>
            <Tabs tabBarStyle={{
                height: 32,
            }} activeKey={selectedTag}
                  size='small' items={tabItems}/>
        </div>


    );
}