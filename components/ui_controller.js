import liff from '@line/liff';
import React, { useEffect, useState } from 'react'
import firebase from '../static/firebaseConnect'
import dynamic from 'next/dynamic'
import axios from 'axios';
import {
    Row, Col, Button,
    Card, Timeline, Tag,
    Form, Select, Modal, message, Image
} from 'antd';
import 'antd/dist/antd.css';
import {
    DatePicker, Space, Tabs, List
}
    from 'antd-mobile'
import {
    UserOutlined, ApiOutlined,
    BarChartOutlined,
    CalendarOutlined,
    ExclamationCircleOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
const db = firebase.database();
const { TabPane } = Tabs;
const { Meta } = Card;
const { Option } = Select;
let token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwYXp6eXBheUBnbWFpbC5jb20iLCJzY29wZXMiOlsiVEVOQU5UX0FETUlOIl0sInVzZXJJZCI6IjkzM2E5MzEwLWIwMDQtMTFlYy1iMTQ0LWM5NjY4ZWNlM2Q4NiIsImVuYWJsZWQiOnRydWUsImlzUHVibGljIjpmYWxzZSwidGVuYW50SWQiOiI4OTg1MTIwMC1iMDA0LTExZWMtYjE0NC1jOTY2OGVjZTNkODYiLCJjdXN0b21lcklkIjoiMTM4MTQwMDAtMWRkMi0xMWIyLTgwODAtODA4MDgwODA4MDgwIiwiaXNzIjoidGhpbmdzYm9hcmQuaW8iLCJpYXQiOjE2NTA0Mjk0OTUsImV4cCI6MTY1MDQzODQ5NX0.Qva-oJY4MXYSAtcb1ZEhKrZ5ssX3ututeQKwHhKBJJShecLkm1_LZEc9jnjh4ziu9Oms_KwMm4_ViVlS5msc3w";
const Edit_active_device = dynamic(() => import('../components/edit_active_devices'), { ssr: false });
const Add_devices = dynamic(() => import('../components/add_devices'), { ssr: false });
const Dashboard = dynamic(() => import('../components/dashboard'), { ssr: false });
const Location = dynamic(() => import('../components/location'), { ssr: false });
export default function UI_controller() {
    const [form] = Form.useForm();
    const [loadding, setLoad] = useState(false);
    //modal form status
    const [updateActiveForm, setUpdateActiveForm] = useState(false);
    const [updateInActiveForm, setUpdateInActiveForm] = useState(false);
    const [openActiveModal, setActiveModal] = useState(false);
    const [openInActiveModal, setInActiveModal] = useState(false);
    const [openDeviceInfo, setDeviceInfo] = useState(false);
    const [updateId, setUpdateId] = useState(null);

    const [deviceInfoActive, setInfoActive] = useState(null);
    const [deviceInfoInActive, setInfoInActive] = useState(null);
    const [visible1, setVisible1] = useState(false)
    const [visible2, setVisible2] = useState(false)
    const [button_disabled, setDisabled] = useState(true);
    const [myDevices, setDevices] = useState([]);
    // query line profile
    const [UID, setUID] = useState(null);
    const [card_id, setCard] = useState(null);
    const [username, setUsername] = useState(null);
    const [fullName, setFullName] = useState(null);
    const [userAvatar, setAvatar] = useState(null);
    const [verified, setVerified] = useState(null);
    const [deviceId, setDeviceId] = useState(null);

    //payment redcord
    const [payment, setRecord] = useState([]);
    const router = useRouter();
    // revenue balance
    const [total_Balance, setBalance] = useState([]);
    useEffect(() => {
        //production only
        let liffID = "1657336941-ENvz62xn";
        // develop only
        //let liffID = "1657283318-opPbBNOy";
        liff.init({ liffId: liffID }).then(() => {
            if (liff.isLoggedIn()) {
                try {
                    let accessToken = liff.getAccessToken();
                    axios.get('https://api.line.me/v2/profile', {
                        headers: { Authorization: `Bearer ${accessToken}` }
                    }).then((profile) => {
                        db.ref("users").orderByChild('UID').equalTo(profile.data.userId).on('value', (snapshot) => {
                            if (snapshot.exists()) {
                                db.ref(`users/${Object.keys(snapshot.val())}`).update({
                                    displayImage: profile.data.pictureUrl
                                });
                                db.ref(`users/${Object.keys(snapshot.val())}`).on('value', (snapshot) => {
                                    if (snapshot.val() != null && snapshot.val().verify_status == 'active') {
                                        let data = snapshot.val();
                                        setUID(data.UID);
                                        setCard(data.card_id);
                                        setFullName(data.fullName);
                                        setUsername(data.username);
                                        setAvatar(profile.data.pictureUrl);
                                        setVerified(data.verify_status);
                                        db.ref("devices").orderByChild('UID').equalTo(data.UID).once('value', (snapshot) => {
                                            if (snapshot.val() != null) {
                                                let box = [];
                                                snapshot.forEach(item => {
                                                    let data = item.val();
                                                    box.push({
                                                        data: data
                                                    })
                                                    setDevices(box)
                                                    setDeviceId(data.deviceId);
                                                    let url = `https://iot1.wsa.cloud/api/v1/${data.deviceId}/rpc`;
                                                    let payment_record = {
                                                        method: "GET_PAYMENT_RECORD",
                                                        params: {
                                                            start_time: 0,
                                                            end_time: new Date().getTime()
                                                        }
                                                    };
                                                    let config = {
                                                        headers: { Authorization: `Bearer ${token}` }
                                                    };
                                                    axios.post(url, payment_record, config).then((res) => {
                                                        setBalance(res.data.params.paymentrecord);
                                                    });
                                                });
                                            }
                                        });
                                    }
                                    else {
                                        setTimeout(() => {
                                            location.href = `/users-inactive?id=${profile.data.userId}`
                                        }, 600);
                                    }
                                })
                            }
                            else {
                                if (snapshot.val() == null) {
                                    let url = `https://asia-southeast1-pazzypay.cloudfunctions.net/pazzyAPI/newUser`;
                                    let body = {
                                        id: profile.data.userId
                                    }
                                    axios.post(url, body).then((response) => {
                                        if (response.status == 200) {
                                            location.href = `/register_page`
                                        }
                                    })
                                }
                            }
                        })
                    });
                } catch (error) {

                }
            } else {
                liff.login();
            }
        })
    }, []);
    let logOut = () => {
        liff.logout()
        setTimeout(() => {
            liff.closeWindow();
        }, 500)
    }
    const openActiveInfo = (id) => {
        setActiveModal(true);
        setInfoActive(id);
    };
    const openIn_activeInfo = (id) => {
        setInActiveModal(true);
        setInfoInActive(id);
    };
    const closedInfoActive = () => {
        setActiveModal(false);
    }
    const closedInfoInActive = () => {
        setInActiveModal(false);
    }
    // update form
    const openUpdateActive = (id) => {
        setUpdateActiveForm(true);
        setUpdateId(id);
    };
    const closedUpdateActive = () => {
        setUpdateActiveForm(false);
    };
    const openUpdateInActive = () => {
        setUpdateInActiveForm(true);
    };
    const closedUpdateInActive = () => {
        setUpdateInActiveForm(false);
    };
    let newDevices = myDevices.map((i) => i.data).filter((i) => i.UID == UID);

    const { confirm } = Modal;
    const showDeleteConfirm = (id) => {
        confirm({
            title: 'คุณต้องการลบอุปกรณ์ออกจากระบบ?',
            icon: <ExclamationCircleOutlined style={{ fontSize: 16 }} />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                db.ref('devices').orderByChild('deviceId').equalTo(id).on('value', (snap) => {
                    if (snap.exists()) {
                        db.ref(`devices/${Object.keys(snap.val())}`).remove()
                        setTimeout(() => {
                            location.reload()
                        }, 600)
                    }
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };
    let checkActive_device = (i) => {
        let checkActive = (i) => {
            if (i.device_active == true) {
                return (
                    <span>
                        <Tag color={'#2ecf34'}>
                            Active
                        </Tag>
                    </span>
                )
            }
            else {
                return (
                    <Tag color={'#989594'}>In-Active</Tag>
                )
            }
        }
        return (
            <div>
                <List>
                    <List.Item
                        key={i.deviceId}
                        prefix={
                            <Image
                                src={i.image}
                                style={{ borderRadius: 3, border: '1px solid', objectFit: 'cover' }}
                                fit='cover'
                                width={80}
                                height={80}
                                alt={'รูปภาพอุปกรณ์'}
                                preview={false}
                            />
                        }
                        description={
                            <span>
                                <span style={{ marginRight: 10, fontSize: 12 }}>{i.device_name}</span>{checkActive(i)}
                                <div style={{ clear: 'both' }}>
                                    <span style={{ marginLeft: 0 }}>
                                        <EditOutlined onClick={openUpdateActive.bind(this, i.deviceId)} style={{ fontSize: 16, marginTop: 10, marginRight: 10, cursor: 'pointer' }} />
                                        <DeleteOutlined onClick={showDeleteConfirm.bind(this, i.deviceId)} style={{ fontSize: 16, marginTop: 10, cursor: 'pointer' }} />
                                    </span>
                                </div>
                            </span>
                        }
                    >
                        <span style={{ fontWeight: 'bold', cursor: 'pointer' }}>
                            <span onClick={openActiveInfo.bind(this, i.deviceId)}>{i.alias_name}</span>
                        </span>
                    </List.Item>
                </List>
                <Modal className='custom_modal' title={null} visible={openActiveModal} footer={null} onCancel={closedInfoActive}>
                    {
                        newDevices.filter((i) => i.deviceId == deviceInfoActive).map((i) => (
                            <div style={{ marginTop: 0, marginBottom: 40 }}>
                                <div style={{ width: 260, height: 260, overflow: 'hidden', margin: 'auto', display: 'block', marginBottom: 20 }}>
                                    <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={i.image} />
                                </div>
                                <p>{checkActive(i)} <span style={{ fontSize: 18, fontWeight: 'bold' }}>{i.device_name}</span></p>
                                <div style={{ clear: 'both' }}>
                                    <Dashboard data={i.deviceId} deviceName={i.device_name} />
                                </div>
                                <h3><strong>Device Info</strong></h3>
                                <p><strong>Device Mac</strong>: {i.device_mac}</p>
                                <p><strong>SSID</strong>: {i.ssid}</p>
                                <p><strong>Last connected</strong>: {i.lastConnectTime}</p>
                                <p><strong>Last disconnected</strong>: {i.lastDisconnectTime}</p>
                                <div style={{ marginTop: 10 }}>
                                    <h3><strong>Device Location</strong></h3>
                                    <p style={{ float: 'left', marginRight: 20 }}><strong>Lat</strong>: {i.lat}</p>
                                    <p style={{ float: 'left' }}><strong>Lng</strong>: {i.lng}</p>

                                    <div className='mymap' style={{ position: 'relative' }}>
                                        <Location lat={i.lat} lng={i.lng} deviceName={i.device_name} />
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </Modal>
                <Modal title="แก้ไขข้อมูลอุปกรณ์" visible={updateActiveForm} footer={null} onCancel={closedUpdateActive}>
                    <Edit_active_device id={updateId} />
                </Modal>
            </div>
        )
    }
    const [selected_devices, setDevices_selected] = useState(null);
    const selectDevice = (selected) => {
        setDevices_selected(selected);
    }
    const [startDate, setStartDate] = useState(0);
    const [endDate, setEndDate] = useState(0);
    const [start_dateText, setStartDateText] = useState(0);
    const [endDateText, setEndDateText] = useState(0);
    const start_date = (val) => {
        let date = new Date(val).getTime();
        setStartDateText(String(val));
        setStartDate(date / 1000);
    }
    const end_date = (val) => {
        let date = new Date(val).getTime();
        setEndDate(date);
        setEndDateText(String(val));
        setDisabled(false);
    }
    const filterTransaction = () => {
        let url = `https://iot1.wsa.cloud/api/v1/${selected_devices}/rpc`;
        let token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwYXp6eXBheUBnbWFpbC5jb20iLCJzY29wZXMiOlsiVEVOQU5UX0FETUlOIl0sInVzZXJJZCI6IjkzM2E5MzEwLWIwMDQtMTFlYy1iMTQ0LWM5NjY4ZWNlM2Q4NiIsImVuYWJsZWQiOnRydWUsImlzUHVibGljIjpmYWxzZSwidGVuYW50SWQiOiI4OTg1MTIwMC1iMDA0LTExZWMtYjE0NC1jOTY2OGVjZTNkODYiLCJjdXN0b21lcklkIjoiMTM4MTQwMDAtMWRkMi0xMWIyLTgwODAtODA4MDgwODA4MDgwIiwiaXNzIjoidGhpbmdzYm9hcmQuaW8iLCJpYXQiOjE2NTA0Mjk0OTUsImV4cCI6MTY1MDQzODQ5NX0.Qva-oJY4MXYSAtcb1ZEhKrZ5ssX3ututeQKwHhKBJJShecLkm1_LZEc9jnjh4ziu9Oms_KwMm4_ViVlS5msc3w";
        let payment_record = {
            method: "GET_PAYMENT_RECORD",
            params: {
                start_time: startDate,
                end_time: endDate
            }
        };
        let config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        axios.post(url, payment_record, config).then((res) => {
            setRecord(res.data.params.paymentrecord)
            setLoad(true);
        });
    }
    let paymentHistory = (paymentid, paymentstatus, paymentvalue, datetime) => {
        if (String(paymentstatus).toLowerCase() == 'success') {
            return (
                <Col span={24}>
                    <Card style={{ borderLeft: '6px solid #87d068' }} bordered={true}>
                        <div style={{ width: '100%', overflow: 'hidden' }}>
                            <div>
                                <h4 style={{ fontWeight: 'bold' }}>{paymentid}</h4>
                                <p><strong>Revenue</strong>: <span style={{ fontSize: 16 }}>{paymentvalue}</span></p>
                                <p>
                                    <strong>Payment Status</strong>: <Tag color="#87d068">{paymentstatus}</Tag>
                                </p>
                                <p>
                                    <strong style={{ textTransform: 'capitalize' }}>
                                        <CalendarOutlined style={{ fontSize: 18 }} /> date
                                    </strong>: {new Date(datetime).toGMTString()}
                                </p>
                            </div>
                        </div>
                    </Card>
                </Col>
            )
        }
        else {
            return (
                <Card style={{ borderLeft: '6px solid #e02e20' }} bordered={true}>
                    <div style={{ width: '100%', overflow: 'hidden' }}>
                        <h4 style={{ fontWeight: 'bold' }}>{paymentid}</h4>
                        <p><strong>Revenue</strong>: {paymentvalue}</p>
                        <p>
                            <strong>Payment Status</strong>: <Tag color="#e02e20">{paymentstatus}</Tag>
                        </p>
                        <p>
                            <strong style={{ textTransform: 'capitalize' }}>
                                <CalendarOutlined style={{ fontSize: 18 }} /> date
                            </strong>: {new Date(datetime).toGMTString()}
                        </p>
                    </div>
                </Card>
            )
        }
    }
    let payment_status = total_Balance.filter((j) => j.paymentstatus == 'SUCCESS');
    let total_balance = payment_status.map((i) => i.paymentvalue).reduce((a, b) => parseInt(a) + parseInt(b), 0);
    let checkBalance = (payment_status) => {
        if (payment_status != 0) {
            return (
                <div>
                    <div style={{ marginTop: 20, marginBottom: 20 }} className='totalBalance'>
                        <Card bordered={false}>
                            <div>
                                <h4>สรุปยอดรวมทั้งหมด</h4>
                                <p>{total_balance}</p>
                            </div>
                        </Card>
                    </div>
                </div>
            )
        }
    }
    let checkHistory = (payment) => {
        if (Object.values(payment).length != 0) {
            return (
                <div>
                    <h3 style={{ fontFamily: 'kanit' }}>ประวัติทั้งหมด</h3>
                    {
                        payment.sort((a, b) => b.timestamp - a.timestamp).map(({ paymentid, paymentstatus, paymentvalue, datetime }) => {
                            return (
                                <div style={{ marginBottom: 30 }} className='transaction' key={paymentid}>
                                    {paymentHistory(paymentid, paymentstatus, paymentvalue, datetime)}
                                </div>
                            )
                        })
                    }
                </div>
            )
        }
        else {
            return (
                <div></div>
            )
        }
    }
    let checkVertify = (text) => {
        if (text == 'active') {
            return (
                <strong style={{ color: '#4caf50', fontFamily: 'kanit' }}>ยืนยันตัวตนเรียบร้อย</strong>
            )
        }
    }
    return (
        <React.Fragment>
            <Row>
                <Col span={24}>
                    <div className='mainTabs card-container'>
                        <Tabs type='card'>
                            <Tabs.Tab title={<span className='main_tabs_font'><ApiOutlined style={{ marginRight: 10, fontSize: 24, color: '#262626' }} />อุปกรณ์</span>} key="1">
                                <div className="site-card-border-less-wrapper">
                                    <Row>
                                        <Col className='custom_device_feed' span={24} style={{ padding: 20 }}>
                                            {
                                                newDevices.map((i) => (
                                                    checkActive_device(i)
                                                ))
                                            }
                                            <Add_devices data={UID} />
                                        </Col>
                                    </Row>
                                </div>
                            </Tabs.Tab>
                            <Tabs.Tab title={<span className='main_tabs_font'><BarChartOutlined style={{ marginRight: 10, fontSize: 24, color: '#262626' }} />ยอดขาย</span>} key="2">
                                <Col className='site-calendar-demo-card' span={24}>
                                    <Card bordered={false}>
                                        {checkBalance(payment_status)}
                                        <h3 style={{ fontFamily: 'kanit', marginTop: 10 }}>
                                            เลือกช่วงเวลาค้นหาประวัติ
                                        </h3>
                                        <Form
                                            layout='inline'
                                            form={form}
                                            onFinish={filterTransaction}
                                        >
                                            <div style={{ margin: 0, display: 'block' }}>
                                                <Form.Item>
                                                    <div>
                                                        <Space wrap>
                                                            <>
                                                                <Col span={24} style={{ display: 'block' }}>
                                                                    <Select
                                                                        defaultValue={"เลือกอุปกรณ์"}
                                                                        style={{
                                                                            marginBottom: 20
                                                                        }}
                                                                        onChange={selectDevice}
                                                                    >
                                                                        {
                                                                            newDevices.map((i) => (
                                                                                <Option key={i.deviceId} value={i.deviceId}>{i.alias_name}</Option>
                                                                            ))
                                                                        }
                                                                    </Select>
                                                                    <div style={{ clear: 'both', marginBottom: 20 }}>
                                                                        <Button
                                                                            style={{ marginRight: 20 }}
                                                                            onClick={() => {
                                                                                setVisible1(true)
                                                                            }}
                                                                        >
                                                                            <CalendarOutlined style={{ fontSize: 18 }} />ตั้งแต่วันที่
                                                                        </Button>
                                                                        <DatePicker
                                                                            visible={visible1}
                                                                            cancelText='Cancel'
                                                                            onClose={() => {
                                                                                setVisible1(false)
                                                                            }}
                                                                            precision='day'
                                                                            confirmText='Done'
                                                                            onConfirm={val => {
                                                                                start_date(val)
                                                                            }}
                                                                        />
                                                                        <Button
                                                                            onClick={() => {
                                                                                setVisible2(true)
                                                                            }}
                                                                        >
                                                                            <CalendarOutlined style={{ fontSize: 18 }} />ถึงวันที่สิ้นสุด
                                                                        </Button>
                                                                        <DatePicker
                                                                            visible={visible2}
                                                                            cancelText='Cancel'
                                                                            onClose={() => {
                                                                                setVisible2(false)
                                                                            }}
                                                                            precision='day'
                                                                            confirmText='Done'
                                                                            onConfirm={val => {
                                                                                end_date(val)
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <p>ตั้งแต่วันที่: {String(start_dateText).substring(0, 15)}</p>
                                                                        <p>ถึงวันที่สิ้นสุด: {String(endDateText).substring(0, 15)}</p>
                                                                    </div>
                                                                </Col>
                                                                <Button style={{ marginTop: 20 }}
                                                                    type='primary' htmlType='submit' disabled={button_disabled}>ค้นหา</Button>
                                                            </>
                                                        </Space>
                                                    </div>
                                                </Form.Item>
                                            </div>
                                        </Form>
                                        <br />
                                        {checkHistory(payment)}
                                    </Card>
                                </Col>
                            </Tabs.Tab>
                            <Tabs.Tab title={<span className='main_tabs_font'><UserOutlined style={{ marginRight: 10, fontSize: 24, color: '#262626' }} />ผู้ใช้</span>} key="3">
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
                            </Tabs.Tab>
                        </Tabs>
                    </div>
                </Col>
            </Row>
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
                        padding: 0;
                        font-size: 14px;
                    }
                    .site-card-border-less-wrapper {
                        padding: 0;
                    }
                    .List_device {
                        margin-bottom: 30px;
                        border-radius: 4px;
                        border-right: 2px solid #f6f6f8;
                        border-top: 2px solid #f6f6f8;
                        border-bottom: 2px solid #f6f6f8;
                    }
                    .floatButton {
                        width: 60px;
                        height: 60px;
                        margin-bottom: 30px;
                        background-color: rgb(242, 101, 34) !important;
                        border: 0px;
                        position: fixed;
                        bottom: 0;
                        right: 50px;
                    }
                    .floatButton:hover {
                        background-color: rgb(242, 101, 34);
                    }
                    .avatar {
                        width: 140px;
                        height: 140px;
                        object-fit: contain;
                        overflow: hidden;
                        margin: 40px auto;
                        margin-bottom: 20px;
                        display: block;
                        border-radius: 6px !important;
                        border: 4px solid;
                    }
                    .card-container > .ant-tabs-card .ant-tabs-content {
                        height: auto;
                        margin-top: -16px;
                    }
                    .card-container > .ant-tabs-card .ant-tabs-content > .ant-tabs-tabpane {
                        padding: 0;
                        background: #fff;
                    }
                    .card-container > .ant-tabs-card > .ant-tabs-nav::before {
                        display: none;
                    }
                    .card-container > .ant-tabs-card .ant-tabs-tab,
                      [data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-tab {
                        background: transparent;
                        border-color: transparent;
                    }
                    .card-container > .ant-tabs-card .ant-tabs-tab-active,
                      [data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-tab-active {
                        background: #fff;
                        border-color: #fff;
                    }
                    .site-calendar-demo-card {
                        border:0;
                        border-radius: 2px;
                    }
                    .site-calendar-demo-card .ant-card-body {
                        padding-top: 0;
                    }
                    .transaction .ant-card-body {
                        padding-top: 18px !important;
                        padding: 18px;
                    }
                    .totalBalance .ant-card-body {
                        padding: 0;
                    }
                    .totalBalance div {
                        width: 100%;
                        height: 130px;
                        background: linear-gradient(90deg, #009688 0%, rgb(68 68 170) 35%, rgb(224 47 31) 100%);
                        border-radius: 6px;
                        text-align: center;
                    }
                    .totalBalance h4 {
                        padding-top: 20px;
                        font-size: 18px;
                        font-family: 'Kanit';
                        color: white;
                    }
                    .totalBalance p {
                        font-size: 25px;
                        font-family: 'Kanit';
                        color: white;
                    }
                    .adm-list {
                        --active-background-color: none !important;
                        --border-bottom: 0 !important;
                        --border-inner: 0 !important;
                        --border-top: 0 !important;
                        --prefix-padding-right: 0 !important;
                    }
                    .adm-list-item {
                        padding: 0;
                    }
                    .adm-list-item-content {
                        padding-right: 0 !important;
                    }
                    .mymap {
                        position: relative;
                        margin-top: 50px;
                        margin-bottom: 0;
                        width: 100%;
                        height: 100%;
                        overflow: hidden;
                    }
                    .custom_modal {
                        width: 100% !important;
                    }
                    .custom_device_feed .ant-image {
                        margin-right: 20px;
                    }
                    `
                }
            </style>
        </React.Fragment >
    )
}