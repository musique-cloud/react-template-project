/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'

import React, {useState} from 'react';
import {Button, Form, Input, message} from 'antd';

import {useNavigate} from "react-router-dom";
import {setToken} from "@/utils/token.js";
import {login} from "@/api/user.js";


export default function Login() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)


    async function onFinish(values) {
        try {
            setLoading(true)

            // let {data} = await login(values.loginId, values.password)
            let data = "react-template-project-token"
            setToken(data)
            message.success('登陆成功！')
            navigate('/home', {replace: true})
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            style={{
                backgroundImage: 'url("/src/assets/img/bg.jpg")',
            }}
            css={css`
                background-size: cover;
                background-position: center;
                height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
            `}
            className="login-container">
            <div css={css`
                background-color: rgba(255, 255, 255, 0.4); /* 背景色带有透明度 */
                padding: 40px;
                border-radius: 10px;
                width: 400px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
            `
            }>

                <h2 style={{marginBottom: 20}}>项目标题</h2>
                <Form
                    name="loginForm"
                    initialValues={{remember: true}}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="loginId"
                        rules={[{required: true, message: '请输入账号'}]}
                    >
                        <Input placeholder="账号"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{required: true, message: '请输入密码'}]}
                    >
                        <Input.Password placeholder="密码"/>
                    </Form.Item>
                    <Form.Item style={{marginTop: "20px"}}>
                        <Button type="primary" htmlType="submit"
                                loading={loading}
                                style={{width: '100%', height: "40px"}}>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

