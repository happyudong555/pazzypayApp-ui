import React, { useState } from 'react'
import { Image, Layout } from 'antd'
import 'antd/dist/antd.css';
const {Header} = Layout;
const logo = "https://firebasestorage.googleapis.com/v0/b/pazzypay.appspot.com/o/asset%2Fpazzy-logo.png?alt=media&token=4143476e-8c31-4acf-a502-4064342d9aca"
const Navbar = () => {
    return (
        <div>
            <Header style={{backgroundColor:'#231F20', width:'100%', height: '100%', overflow:'hidden', lineHeight: 'normal'}}>
                <div style={{margin: '20px auto', display: 'block' }}>
                    <Image className='customLogo' src={logo} preview={false}/>
                </div>
            </Header>
            <style>
                {
                    `
                        .customLogo {
                            display: block;
                            width: 300px;
                            height: 60px;
                            margin: auto;
                            object-fit: contain;
                        }
                    `
                }
            </style>
        </div>
    )
}
export default Navbar;