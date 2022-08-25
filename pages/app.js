import React, {PureComponent} from 'react'
import Navbar from '../components/navbar'
import firebase from '../static/firebaseConnect'
import { Tabs, Row, Col, Button } from 'antd';
import 'antd/dist/antd.css';
import { UserOutlined, ApiOutlined, BarChartOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
const { TabPane } = Tabs;
// components
const UI_controller = dynamic(() => import('../components/ui_controller'), { ssr: false })
export default class App extends PureComponent {
    render() {
        return (
            <div>
                <Navbar />
                <UI_controller/>
                <style>
                    {
                        `
                        @import url('https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
                        .mainTabs .ant-tabs-nav-list
                        {
                            margin: auto;
                        }
                        .mainTabs .ant-tabs-nav {
                            margin-top: 0;
                            height: 60px;
                            background-color: #fff;
                        }
                        .main_tabs_font {
                            font-family: 'Kanit', sans-serif;
                            font-weight: normal;
                            color: #262626;
                        }
                        `
                    }
                </style>
            </div>
        )
    }
}