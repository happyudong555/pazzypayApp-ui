import liff from '@line/liff';
import React, { useEffect, useState } from 'react';
import firebase from '../static/firebaseConnect';
import Navbar from '../components/navbar';
import {
    Col, Button,
    Card, Timeline
} from 'antd';
import 'antd/dist/antd.css';
const db = firebase.database();
const { Meta } = Card;
export default function Inactive_profile() {
    const [card_id, setCard_id] = useState(null);
    const [fullName, setName] = useState(null);
    const [username, setUsername] = useState(null);
    const [userAvatar, setAvatar] = useState(null);
    const [verified, setVerified] = useState(null);
    const getData = () => {
        //production only 
        let liffID = "1657336941-MPpkJYVw";
        // develop only
        //let liffID = "1657283318-nQbzq3Ry";
        liff.init({liffId: liffID});
        const params = new URLSearchParams(window.location.search)
        let id = params.get('id')
        db.ref("users").orderByChild('UID').equalTo(id).on('value', (snapshot) => {
            if (snapshot.exists()) {
                db.ref(`users/${Object.keys(snapshot.val())}`).on('value', (snapshot) => {
                    if (snapshot.exists() && snapshot.val().verify_status == 'inactive') {
                        setCard_id(snapshot.val().card_id);
                        setName(snapshot.val().fullName);
                        setUsername(snapshot.val().username);
                        setAvatar(snapshot.val().displayImage);
                        setVerified(snapshot.val().verify_status);
                    }
                    else {
                        location.href = '/'
                    }
                })
            }
        });
    }
    useEffect(() => {
        try {
            getData();
        } catch (error) {
            
        }
    }, []);
    let logOut = () => {
        liff.logout();
        setTimeout(() => {
            liff.closeWindow();
        }, 600);
    }
    let checkVertify =(text)=> {
        if (text == 'inactive') {
            return (
                <strong style={{color:'red', fontFamily: 'kanit'}}>ยังไม่ยืนยันตัวตน</strong>
            )
        }
    }
    return (
        <div>
            <Navbar />
            <div style={{ clear: 'both' }}>
                <div style={{ padding: 0, paddingBottom: 0, paddingTop: 0 }}>
                    <Col span={24}>
                        <Card bordered={false} cover={<img class="avatar" src={userAvatar} />}>
                            <Meta description={
                                <div>
                                    <h3 style={{ fontWeight: 'bold', marginBottom: 20, fontFamily: 'Kanit' }}>ข้อมูลผู้ใช้</h3>
                                    <Timeline>
                                        <Timeline.Item>เลขที่บัตรประชาชน: {String(card_id).slice(0, 6) + "xxx-xxx"}</Timeline.Item>
                                        <Timeline.Item>ชื่อ-นามสกุล: {fullName}</Timeline.Item>
                                        <Timeline.Item>ชื่อบัญชีผู้ใช้: {username}</Timeline.Item>
                                        <Timeline.Item>สถาณะ: {checkVertify(verified)}</Timeline.Item>
                                    </Timeline>
                                    <Button onClick={logOut} style={{ width: '100%', position: 'relative', top: -24, backgroundColor: '#f26522', color: 'white', border: 0 }}>ออกจากระบบ</Button>
                                </div>
                            } />
                        </Card>
                    </Col>
                </div>
            </div>
            <style>
                {
                    `
                    @import url('https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
                    .avatar {
                        width: 140px;
                        height: 140px;
                        object-fit: contain;
                        overflow: hidden;
                        margin: 46px auto;
                        margin-bottom: 20px;
                        display: block;
                        border-radius: 6px !important;
                        border: 4px solid;
                    }
                    `
                }
            </style>
        </div>
    )
}