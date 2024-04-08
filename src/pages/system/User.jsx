import React, {useState} from 'react';
import {Table, Pagination, Row, Col, Space} from 'antd';

import {Button, Form, Input} from 'antd';

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        align: 'center',
        key: 'id',
        fixed: 'left',
        width: 60,
    },
    {
        title: '用户名',
        dataIndex: 'loginId',
        align: 'center',
        key: 'loginId',
        fixed: 'left',
        width: 60,
    },
    {
        title: '姓名',
        dataIndex: 'name',
        align: 'center',
        key: 'name',
        fixed: 'left',
        width: 60,
    },
    {
        title: '部门',
        dataIndex: 'dept',
        align: 'center',
        key: 'dept',
        width: 60,
    },
    {
        title: '性别',
        dataIndex: 'sex',
        align: 'center',
        key: 'sex',
        width: 60,
    },
    {
        title: '手机',
        dataIndex: 'phone',
        align: 'center',
        key: 'phone',
        width: 60,
    },
    {
        title: '微信号',
        dataIndex: 'wechat',
        align: 'center',
        key: 'wechat',
        width: 60,
    },
    {
        title: '出生日期',
        dataIndex: 'birthday',
        align: 'center',
        key: 'birthday',
        width: 60,
    },
    {
        title: '入职日期',
        dataIndex: 'entryDate',
        align: 'center',
        key: 'entryDate',
        width: 60,
    },
    {
        title: '状态',
        dataIndex: 'status',
        align: 'center',
        key: 'status',
        width: 60,
    },
    {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        align: 'center',
        width: 100,
        render: () => <a>action</a>,
    },
];

const data = [
    // 数据对象数组，每个对象代表一行
    {
        id: "1",
        key: '1',
        name: "张三",
        loginId: "zs",
        sex: "男"
    },
    {
        id: "2",
        key: '2',
        name: "李四",
        loginId: "ls",
        sex: "男"
    }
];

const User = () => {
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: data.length,
    });
    const [form] = Form.useForm();
    const handleTableChange = (pagination, filters, sorter) => {
        setPagination(pagination);
    };

    const pager = {
        ...pagination,
        onChange: (page, pageSize) => {
            setPagination({
                ...pagination,
                current: page,
                pageSize: pageSize,
            });
        }
    };

    const onFinish = (values) => {
        console.log("查询条件提交")
        console.log('Received values of form: ', values);
    };

    return (
        <div>
            <Form
                form={form}
                name="user-list-form"
                style={{
                    maxWidth: 'none',
                    padding: 24,
                }}
                onFinish={onFinish}
            >
                <Row gutter={24}>
                    <Col key='name' span={6}>
                        <Form.Item name='name' label="姓名">
                            <Input placeholder="请输入姓名"/>
                        </Form.Item>
                    </Col>
                    <Col key='loginId' span={6}>
                        <Form.Item name='loginId' label="登录名">
                            <Input placeholder="请输入登录名"/>
                        </Form.Item>
                    </Col>
                </Row>

                <div
                    style={{
                        textAlign: 'right',
                    }}
                >
                    <Space size="small">
                        <Button type="primary" htmlType="submit">
                            搜索
                        </Button>
                        <Button
                            onClick={() => {
                                form.resetFields();
                            }}
                        >
                            重置
                        </Button>
                    </Space>
                </div>
            </Form>

            <Table
                scroll={{
                    x: 1500,
                }}

                columns={columns}
                dataSource={data}
                onChange={handleTableChange}
                pagination={false}
                size='middle'
            />
            <Pagination style={{marginTop: 10}} {...pager} />
        </div>
    );
};

export default User;