import React, { useState, useEffect } from 'react'
import { Input, Form, Button, List } from 'antd'
import 'antd/dist/antd.css';
import firebase from '../static/firebaseConnect';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng
} from "react-places-autocomplete";
import axios from 'axios';
import Add_location from './add_location';
const db = firebase.database();
const storage = firebase.storage();
let token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJwYXp6eXBheUBnbWFpbC5jb20iLCJzY29wZXMiOlsiVEVOQU5UX0FETUlOIl0sInVzZXJJZCI6IjkzM2E5MzEwLWIwMDQtMTFlYy1iMTQ0LWM5NjY4ZWNlM2Q4NiIsImVuYWJsZWQiOnRydWUsImlzUHVibGljIjpmYWxzZSwidGVuYW50SWQiOiI4OTg1MTIwMC1iMDA0LTExZWMtYjE0NC1jOTY2OGVjZTNkODYiLCJjdXN0b21lcklkIjoiMTM4MTQwMDAtMWRkMi0xMWIyLTgwODAtODA4MDgwODA4MDgwIiwiaXNzIjoidGhpbmdzYm9hcmQuaW8iLCJpYXQiOjE2NTA0Mjk0OTUsImV4cCI6MTY1MDQzODQ5NX0.Qva-oJY4MXYSAtcb1ZEhKrZ5ssX3ututeQKwHhKBJJShecLkm1_LZEc9jnjh4ziu9Oms_KwMm4_ViVlS5msc3w";
export default function Edit_active_device(props) {
    const [previewImage, setPreviewPath] = useState(null);
    const [edit_deviceImage, setDevice_image] = useState(null);
    const [edit_alias_name, setAlias_name] = useState(null);
    const [address, setAddress] = useState(null);
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const changeImage = (e) => {
        let url = URL.createObjectURL(e.target.files[0]);
        setPreviewPath(url);
        setDevice_image(e.target.files[0]);
        let upload = storage.ref(`device_asset/${e.target.files[0].name}`).put(e.target.files[0]).then((snapUpload) => {
            snapUpload.ref.getDownloadURL().then((imageUrl) => {
                setDevice_image(imageUrl)
            })
        })
    }
    const edit_deviceName = (e) => {
        setAlias_name(e.target.value);
    }
    const handleSelect = (address) => {
        setAddress(address)
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                setLat(latLng.lat)
                setLng(latLng.lng)
                let url = `https://iot1.wsa.cloud/api/v1/${props.id}/rpc`;
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
    };
    const saved = () => {
        if (edit_deviceImage != null && edit_alias_name != null) {
            db.ref('devices').orderByChild('deviceId').equalTo(props.id).on('value', (snap) => {
                if (snap.exists()) {
                    db.ref(`devices/${Object.keys(snap.val())}`).update({
                        alias_name: edit_alias_name,
                        image: edit_deviceImage
                    })
                    setTimeout(() => {
                        location.reload()
                    }, 600)
                }
            })
        }
        else {
            db.ref('devices').orderByChild('deviceId').equalTo(props.id).on('value', (snap) => {
                if (snap.exists()) {
                    db.ref(`devices/${Object.keys(snap.val())}`).update({
                        alias_name: edit_alias_name
                    })
                    setTimeout(() => {
                        location.reload()
                    }, 600)
                }
            })
        }
    }
    const checkLocation = (lat, lng) => {
        if (lat != null, lng != null) {
            return (
                <Add_location lat={lat} lng={lng} />
            )
        }
    }
    return (
        <React.Fragment style={{ padding: 20 }}>
            <Form layout='vertical'>
                <form enctype="multipart/form-data" method="POST" class="uploadImageForm">
                    <input accept="image/*" type='file' name="device_image" onChange={changeImage} />
                    <img src={previewImage} />
                </form>
                <Form.Item label={<span style={{ fontSize: 16, fontFamily: 'Kanit' }}>ชื่ออุปกรณ์</span>}>
                    <Input placeholder='กรอกชื่ออุปกรณ์' onChange={edit_deviceName} />
                </Form.Item>
                <PlacesAutocomplete
                    value={address}
                    onChange={handleSelect}
                >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <div>
                            <Form.Item label={<span style={{ fontSize: 16, fontFamily: 'Kanit' }}>ระบุสถานที่</span>}>
                                <Input style={{ width: "100%", marginBottom: 20 }} {...getInputProps({
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
                {checkLocation(lat, lng)}
                <Form.Item>
                    <Button style={{ width: '100%', marginBottom: 0, position: 'relative', top: 0 }} type="primary" onClick={saved}>
                        แก้ไขข้อมูลอุปกรณ์
                    </Button>
                </Form.Item>
            </Form>
            <style>
                {
                    `
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
                    `
                }
            </style>
        </React.Fragment>
    )
}