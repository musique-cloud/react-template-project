import {useNavigate} from "react-router-dom";

import {Button, ConfigProvider, Result} from 'antd';
import {useCountDown} from "@/hooks/index.js";
import {useEffect} from "react";

/**
 * DONE
 * @returns {JSX.Element}
 * @constructor
 */
export default function ErrorPage() {
    const navigate = useNavigate();


    function backHome() {
        navigate('/', {replace: true})
    }

    const [count, endStatus] = useCountDown()

    useEffect(() => {
        if (endStatus) {
            backHome()
        }
    })

    return (
        <ConfigProvider
            theme={{
                components: {
                    Result: {
                        /* 这里是你的组件 token */
                        subtitleFontSize: 20,
                        titleFontSize: 40,
                        extraMargin: 50
                    },
                },
            }}
        >
            <Result
                status="404"
                title="404"
                style={{height: '100vh'}}
                subTitle={<span>对不起，您访问的页面不存在，{endStatus}即将返回首页 <span style={{color: "red"}}>{count} 秒</span></span>}
                extra={<Button style={{height: 50, fontSize: 25}} onClick={backHome} type="primary">点击回首页</Button>}
            />
        </ConfigProvider>

    );
}