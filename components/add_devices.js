import liff from '@line/liff';
import React, { useState } from 'react';
import Head from 'next/head'
import {
    Button, Modal, Steps, message, Form, Input, List
} from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import { ScanCodeOutline } from 'antd-mobile-icons';
import firebase from '../static/firebaseConnect';
import Add_Location from './add_location';
import axios from 'axios';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng
} from "react-places-autocomplete";
const API_KEY = "AIzaSyDkKqpKpgf07981VyQa6UoQCMEb1mS5Wio";
const db = firebase.database();
const storage = firebase.storage();
const { Step } = Steps;
let token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwYXp6eXBheUBnbWFpbC5jb20iLCJzY29wZXMiOlsiVEVOQU5UX0FETUlOIl0sInVzZXJJZCI6IjkzM2E5MzEwLWIwMDQtMTFlYy1iMTQ0LWM5NjY4ZWNlM2Q4NiIsImVuYWJsZWQiOnRydWUsImlzUHVibGljIjpmYWxzZSwidGVuYW50SWQiOiI4OTg1MTIwMC1iMDA0LTExZWMtYjE0NC1jOTY2OGVjZTNkODYiLCJjdXN0b21lcklkIjoiMTM4MTQwMDAtMWRkMi0xMWIyLTgwODAtODA4MDgwODA4MDgwIiwiaXNzIjoidGhpbmdzYm9hcmQuaW8iLCJpYXQiOjE2NTA0Mjk0OTUsImV4cCI6MTY1MDQzODQ5NX0.Qva-oJY4MXYSAtcb1ZEhKrZ5ssX3ututeQKwHhKBJJShecLkm1_LZEc9jnjh4ziu9Oms_KwMm4_ViVlS5msc3w";
export default function Add_devices(props) {
    const [place, setPlace] = useState(null);
    const [current, setCurrent] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    //device info
    const [device_name, setName] = useState(null);
    const [QR_result, setQR] = useState(null);
    const [deviceImage, setUrl] = useState(null);
    const [deviceImage_path, setPath] = useState(null);
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);

    // process status
    const [processStatus, setProcess] = useState(true);
    const openForm = () => {
        setIsModalVisible(true);
    };
    const closedForm = () => {
        setIsModalVisible(false);
    };
    const confirm = () => {
        setIsModalVisible(false);
    };
    const openScan = () => {
        liff.scanCodeV2().then((scan) => {
            message.success('QR Code Scan is Successful');
            setTimeout(() => {
                setQR(scan.value);
                setProcess(false);
            }, 500);
        }).catch((error) => {
            message.error(`QR Code Scan is failed because ${error}`);
        })
    }
    let uploadFile = (e) => {
        let url = URL.createObjectURL(e.target.files[0]);
        setUrl(url);
        let upload = storage.ref(`device_asset/${e.target.files[0].name}`).put(e.target.files[0]);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED, () => {
            upload.snapshot.ref.getDownloadURL().then((imageUrl) => {
                setPath(imageUrl)
            })
        });
    };
    let handleChange = async (address) => {
        setPlace(address)
        await geocodeByAddress(String(address).toLowerCase())
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                setLat(latLng.lat)
                setLong(latLng.lng)
                let url = `https://iot1.wsa.cloud/api/v1/${QR_result}/rpc`;
                let data = {
                    method: "UPDATE_GPS_LOCATION",
                    params: {
                        lat: latLng.lat,
                        lng: latLng.lng
                    }
                };
                let config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                axios.post(url, data, config).then((res) => {
                });
            })
    }
    const deviceName = (e) => {
        setName(e.target.value);
    }
    let checkLocation = (a, b, c) => {
        if (a != null && b != null) {
            return (
                <div className='custom_location'>
                    <Add_Location lat={a} lng={b} deviceName={c} />
                </div>
            )
        }
        else {
            return (
                <div></div>
            )
        }
    }
    const steps = [
        {
            title: (<div><span style={{ fontSize: 14, position: 'relative', top: -2, fontFamily: 'Kanit' }}>เพิ่มอุปกรณ์</span></div>),
            content: (
                <div>
                    <ScanCodeOutline style={{ fontSize: 70, textAlign: 'center', marginTop: -40, marginBottom: 20 }} />
                    <div style={{ clear: 'both' }}>
                        <Button onClick={openScan}>Scan QR Code</Button>
                    </div>
                </div>
            )
        },
        {
            title: (<div><span style={{ fontSize: 14, position: 'relative', top: -2, fontFamily: 'Kanit' }}>ข้อมูลอุปกรณ์</span></div>),
            content: (
                <div className='deviceInfo'>
                    <Form layout='vertical'>
                        <form enctype="multipart/form-data" method="POST" class="uploadImageForm">
                            <input accept="image/*" type='file' name="device_image" onChange={uploadFile} />
                            <img src={deviceImage} />
                        </form>
                        <Form.Item label={<span style={{ fontSize: 16, fontFamily: 'Kanit' }}>ชื่ออุปกรณ์</span>}>
                            <Input placeholder='กรอกชื่ออุปกรณ์' onChange={deviceName} />
                        </Form.Item>
                        <PlacesAutocomplete
                            value={place}
                            onChange={handleChange}
                        >
                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                <div>
                                    <Form.Item label={<span style={{ fontSize: 16, fontFamily: 'Kanit' }}>ระบุสถานที่</span>}>
                                        <Input style={{ width: "100%",marginBottom:20 }} {...getInputProps({
                                            placeholder: "ค้นหาสถานที่",
                                            className: 'location-search-input',
                                        })} />
                                    </Form.Item>
                                    <div className="autocomplete-dropdown-container">
                                        {loading && <div>Loading...</div>}
                                        {suggestions.map(suggestion => {
                                            const className = suggestion.active
                                                ? 'suggestion-item--active'
                                                : 'suggestion-item';
                                            // inline style for demonstration purpose
                                            const style = suggestion.active
                                                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                            return (
                                                <div
                                                    {...getSuggestionItemProps(suggestion, {
                                                        className,
                                                        style,
                                                    })}
                                                >
                                                    <List
                                                        itemLayout="horizontal"
                                                        dataSource={suggestions}
                                                        renderItem={item => (
                                                            <List.Item>
                                                                <List.Item.Meta
                                                                    title={<div>{item.description}</div>}
                                                                />
                                                            </List.Item>
                                                        )} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </PlacesAutocomplete>
                    </Form>
                    {checkLocation(lat, long, device_name)}
                </div>
            ),
        }
    ];
    //next steps
    const next = () => {
        setCurrent(current + 1);
    };
    //back to previous steps
    const prev = () => {
        setCurrent(current - 1);
    };
    //
    const create_device = () => {
        db.ref("users").orderByChild('UID').equalTo(props.data).once('value', (snapshot) => {
            if (snapshot.val() != null) {
                let url = `https://iot1.wsa.cloud/api/v1/${QR_result}/rpc`;
                let data = {
                    method: "GET_DEVICE_DATA",
                    params: {}
                };
                let config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                axios.post(url, data, config).then((res) => {
                    if (deviceImage_path != null) {
                        let newData = Object.assign({ UID: props.data, deviceId: QR_result, alias_name: device_name, image: deviceImage_path }, res.data.params);
                        db.ref('devices').push(newData);
                    }
                    message.success('เพิ่มอุปกรณ์ สำเร็จ');
                    setTimeout(() => {
                        window.location.reload();
                    }, 600);
                });
            }
        });
    }
    return (
        <div>
            <Head>
                <script type='text/javascript' src={`https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`}></script>
            </Head>
            <Button onClick={openForm} type="primary" shape='circle' className='floatButton'>
                <PlusOutlined style={{ fontSize: 26 }} />
            </Button>

            <Modal title="Add Device" visible={isModalVisible} footer={null} onCancel={closedForm}>
                <Steps current={current}>
                    {steps.map((item) => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>

                <div className="steps-content">{steps[current].content}</div>
                <div className="steps-action">
                    {current < steps.length - 1 && (
                        <Button disabled={processStatus} style={{ marginTop: 20 }} type="primary" onClick={() => next()}>
                            ขั้นตอนถัดไป
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button style={{ width: '100%', marginBottom: 0, position: 'relative', top: -20 }} type="primary" onClick={create_device}>
                            เพิ่มอุปกรณ์
                        </Button>
                    )}
                    {current > 0 && (
                        <Button
                            style={{
                                width: '100%',
                            }}
                            onClick={() => prev()}
                        >
                            ย้อนกลับไปก่อนหน้า
                        </Button>
                    )}
                </div>
            </Modal>
            <style>
                {
                    `
                    @import url('https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
                    .steps-content {
                        min-height: 200px;
                        margin-top: 16px;
                        padding-top: 80px;
                        text-align: center;
                        background-color: transparent;
                        border: 0;
                        border-radius: 2px;
                    }
                      
                    .steps-action {
                        margin-top: 0;
                        display: block;
                    }
                    .deviceInfo {
                        position: relative;
                        top: -30px;
                        padding: 20px;
                        padding-top: 0;
                    }
                    .uploadImageForm {
                        width: 120px;
                        height: 120px;
                        overflow:hidden;
                        border: 1px solid;
                        margin: auto;
                        margin-bottom:20px;
                        display: block;
                        cursor: pointer;
                        position: relative;
                    }
                    .uploadImageForm input {
                        width: 100%;
                        height: 100%;
                        overflow: hidden;
                        opacity: 0;
                        position: absolute;
                        cursor: pointer;
                        z-index: 30000000;
                    }
                    .uploadImageForm::before {
                        content: "เพิ่มรูปภาพอุปกรณ์";
                        display: block;
                        font-size: 16px;
                        text-align: center;
                        position: absolute;
                        top: 35px;
                        font-family: 'Kanit';
                        left: 0;
                        right: 0;
                        bottom: 0;
                    }
                    .uploadImageForm img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        position: relative;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                    }
                    .custom_location {
                        width: 100%;
                        height: 100%;
                        overflow: hidden;
                        position: relative;
                        top: 0;
                        margin-bottom: 20px;
                    }
                    .custom_location div {
                        position: relative;
                    }
                    .steps-action {
                        margin-top: 0;
                        display: block;
                        position: relative;
                        top: -20px;
                    }
                    `
                }
            </style>
        </div>
    )
}