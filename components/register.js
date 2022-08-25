import liff from '@line/liff';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import {
    Form, Input, Button
} from 'antd-mobile';
import { Upload, message } from 'antd';
import 'antd/dist/antd.css';
import { CheckCircleOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import firebase from '../static/firebaseConnect';
const db = firebase.database();
const storage = firebase.storage();
const RegisterForm = (props) => {
    const router = useRouter()
    const [form] = Form.useForm();
    // line user
    let UID = props.id;
    let username = props.username;
    let profileImage = props.profileImage;
    const [cardID, setCardId] = useState([]);
    const [book, setBook] = useState([]);
    const [houseId, setHouse] = useState([]);
    const [storeImage, setStoreImage] = useState([]);
    const [verified_image, setVerified_image] = useState([]);
    const [button_disabled, setButton] = useState(false);
    const [userID, setUID] = useState(null);
    useEffect(() => {
        if (props.id != null) {
            db.ref('users').orderByChild('UID').equalTo(props.id).on('child_added', (snapshot) => {
                if (props.id == snapshot.val().UID) {
                    setButton(true);
                    setTimeout(() => {
                        location.href = `/users-inactive?id=${props.id}`
                    }, 6000);
                }
                else {
                    setUID(snapshot.val().UID);
                    setButton(false);
                }
            })
        }
    }, [props])

    //function for uploading CARD ID
    const uploadCard = {
        name: 'card_ID',
        multiple: false,
        showUploadList: {
            showDownloadIcon: false
        },
        onRemove: (file) => {
            const index = cardID.indexOf(file);
            const newFileList = cardID.slice();
            newFileList.splice(index, 1);
            setCardId(newFileList);
        },
        beforeUpload: (file) => {
            setCardId([...cardID, file]);
            return false
        },
        cardID
    };
    //function for uploading Book Bank
    const bookBank = {
        name: 'book',
        multiple: false,
        showUploadList: {
            showDownloadIcon: false,
        },
        onRemove: (file) => {
            const index = book.indexOf(file);
            const newFileList = book.slice();
            newFileList.splice(index, 1);
            setBook(newFileList);
        },
        beforeUpload: (file) => {
            setBook([...book, file]);
            return false
        },
        book
    };
    const house = {
        name: 'house',
        multiple: false,
        showUploadList: {
            showDownloadIcon: false,
        },
        onRemove: (file) => {
            const index = houseId.indexOf(file);
            const newFileList = houseId.slice();
            newFileList.splice(index, 1);
            setHouse(newFileList);
        },
        beforeUpload: (file) => {
            setHouse([...houseId, file]);
            return false
        },
        houseId
    };
    const storeFrontImage = {
        name: 'storeImages',
        multiple: false,
        showUploadList: {
            showDownloadIcon: false,
        },
        onRemove: (file) => {
            const index = storeImage.indexOf(file);
            const newFileList = storeImage.slice();
            newFileList.splice(index, 1);
            setStoreImage(newFileList);
        },
        beforeUpload: (file) => {
            setStoreImage([...storeImage, file]);
            return false
        },
        storeImage
    };
    const verified_upload_image = {
        name: 'verified_images',
        multiple: false,
        showUploadList: {
            showDownloadIcon: false,
        },
        onRemove: (file) => {
            const index = verified_image.indexOf(file);
            const newFileList = verified_image.slice();
            newFileList.splice(index, 1);
            setVerified_image(newFileList);
        },
        beforeUpload: (file) => {
            setVerified_image([...verified_image, file]);
            return false
        },
        verified_image
    };
    const saved = async () => {
        try {
            let fullName = document.getElementById('fullName').value;
            let card_id = document.getElementById('cardId').value;
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let timeStamp = new Date();
            let storage_path = "register_application_form";
            let card = cardID[0];
            let bookBank = book[0];
            let house_registration = houseId[0];
            let storeFrontImage = storeImage[0];
            let verified_image_register = verified_image[0];

            // card id
            let uploadCard = await storage.ref(`${storage_path}/${card.name}`).put(card);
            let card_progress = (uploadCard.bytesTransferred / uploadCard.totalBytes) * 100;
            let card_src = await uploadCard.ref.getDownloadURL();
            // bookbank
            let upload_bookBank = await storage.ref(`${storage_path}/${bookBank.name}`).put(bookBank);
            let bookBank_progress = (upload_bookBank.bytesTransferred / upload_bookBank.totalBytes) * 100;
            let bookBank_src = await upload_bookBank.ref.getDownloadURL();
            // house_registration
            let upload_house_register = await storage.ref(`${storage_path}/${house_registration.name}`).put(house_registration);
            let house_progress = (upload_house_register.bytesTransferred / upload_house_register.totalBytes) * 100;
            let house_registration_src = await upload_house_register.ref.getDownloadURL();
            // upload store & retail image
            let upload_store = await storage.ref(`${storage_path}/${storeFrontImage.name}`).put(storeFrontImage);
            let store_progress = (upload_store.bytesTransferred / upload_store.totalBytes) * 100;
            let storeImage_src = await upload_store.ref.getDownloadURL();
            // verified_image
            let upload_verified_image = await storage.ref(`${storage_path}/${verified_image_register.name}`).put(verified_image_register);
            let upload_verified_image_progress = (upload_verified_image.bytesTransferred / upload_verified_image.totalBytes) * 100;
            let verified_image_src = await upload_verified_image.ref.getDownloadURL();
            if (profileImage != undefined || profileImage != null) {
                db.ref('users').push({
                    UID: props.id,
                    registerID: String(props.id).substring(2, 11),
                    fullName: fullName,
                    card_id: card_id,
                    username: username,
                    displayImage: profileImage,
                    account_type: 'guest',
                    registerStatus: 'กำลังดำเนินการ',
                    verify_status: 'inactive',
                    created: `${timeStamp.getDate()}-${timeStamp.getMonth() + 1}-${timeStamp.getFullYear()}`
                });
            }
            else {
                db.ref('users').push({
                    UID: props.id,
                    registerID: String(props.id).substring(2, 11),
                    fullName: fullName,
                    card_id: card_id,
                    username: username,
                    account_type: 'guest',
                    registerStatus: 'กำลังดำเนินการ',
                    verify_status: 'inactive',
                    created: `${timeStamp.getDate()}-${timeStamp.getMonth() + 1}-${timeStamp.getFullYear()}`
                });
            }
            db.ref('guest_register_docs').push({
                UID: props.id,
                card_id: card_src,
                book_bank: bookBank_src,
                address_statement: house_registration_src,
                shop_image: storeImage_src,
                verified_image_src: verified_image_src,
                created: `${months[timeStamp.getMonth()]}-${timeStamp.getDate()}-${timeStamp.getFullYear()}`
            });
        } catch (error) {
            if (error) {
                message.error(`สมัครสมาชิกล้มเหลว`);
            }
        }
        form.resetFields();
        sendRichMenu(props.id)
    }
    let sendRichMenu = async (id) => {
        // url for production
        let url = `https://asia-southeast1-pazzypay.cloudfunctions.net/pazzyAPI/richMenu`;
        let body = {
            id: id
        }
        await axios.post(url, body).then((response) => {
            if (response.status == 200) {
                message.success("สมัครสมาชิกสำเร็จ");
            }
        });
    }
    const checkUpload_status = (checked) => {
        if (checked != undefined) {
            return (
                <CheckCircleOutlined style={{ fontSize: 24, color: '#4caf50', marginLeft: 10 }} />
            )
        }
    }
    return (
        <div className="registerForm" style={{ padding: 20, paddingTop: 0 }}>
            <div>
                <br />
                <UserOutlined style={{ fontSize: 45, display: 'block', textAlign: 'center' }} />
                <p style={{ textAlign: 'center', fontSize: 18, fontWeight: 'lighter', paddingTop: 20 }}>
                    บุคคลธรรมดา
                </p>
                <h2 style={{ fontSize: 20, textAlign: 'center', paddingLeft: 0, fontWeight: 'bold', fontFamily: 'Prompt' }}>
                    เอกสารที่ต้องอัพโหลด
                </h2>
                <ul style={{ padding: 20, paddingTop: 30 }}>
                    <li className='hint'>สําเนาบัตรประจําตัวประชาชนของเจ้าของกิจการ (หน้า-หลัง)</li>
                    <Upload
                        {...uploadCard}
                        fileList={null}
                    >
                        <Button style={{ marginTop: 10 }} className='uploadButton'>
                            อัพโหลดสําเนาบัตรประจําตัว {checkUpload_status(cardID[0])}
                        </Button>
                    </Upload>
                    <li className='hint'>สําเนาสมุดบัญชีธนาคารของเจ้าของกิจการ</li>
                    <Upload
                        {...bookBank}
                        fileList={null}
                    >
                        <Button style={{ marginTop: 10 }} className='uploadButton'>อัพโหลดสําเนาสมุดบัญชีธนาคาร {checkUpload_status(book[0])}</Button>
                    </Upload>
                    <li className='hint'>สําเนาทะเบียนบ้าน หรือหนังสือเช่าบ้าน (อย่างใดอย่างหนึ่ง)</li>
                    <Upload
                        {...house}
                        fileList={null}
                    >
                        <Button style={{ marginTop: 10 }} className='uploadButton'>อัพโหลดสําเนาทะเบียนบ้าน{checkUpload_status(houseId[0])}</Button>
                    </Upload>


                    <li className='hint'>ภาพถ่าย บริษัทหรือร้านค้า</li>
                    <Upload
                        {...storeFrontImage}
                        fileList={null}
                    >
                        <Button style={{ marginTop: 10 }} className='uploadButton'>ภาพถ่ายบริษัทหรือร้านค้า{checkUpload_status(storeImage[0])}</Button>
                    </Upload>

                    <li className='hint'>ภาพถ่ายหน้าตรงพร้อมกับถือบัตรประชาชนของเจ้าของบัญชี</li>
                    <Upload
                        {...verified_upload_image}
                        fileList={null}
                    >
                        <Button style={{ marginTop: 10 }} className='uploadButton'>ภาพถ่ายคู่กับบัตรประชาชน{checkUpload_status(verified_image[0])}</Button>
                    </Upload>

                    <li className='hint' style={{ marginBottom: 10 }}>คลิก <a style={{ fontWeight: 'bold' }} target={'_blank'} href="https://firebasestorage.googleapis.com/v0/b/pazzypay.appspot.com/o/ksher_application_form%2F%E0%B9%83%E0%B8%9A%E0%B8%AA%E0%B8%A1%E0%B8%B1%E0%B8%84%E0%B8%A3%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%8A%E0%B8%B3%E0%B8%A3%E0%B8%B0%E0%B9%80%E0%B8%87%E0%B8%B4%E0%B8%99%E0%B8%AD%E0%B8%B4%E0%B9%80%E0%B8%A5%E0%B9%87%E0%B8%81%E0%B8%97%E0%B8%A3%E0%B8%AD%E0%B8%99%E0%B8%B4%E0%B8%81%E0%B8%AA%E0%B9%8C.pdf?alt=media&token=ec67ba3b-5264-43dc-87b7-6cb1b4e6b444">ดาวโหลดใบสมัคร</a></li>
                    <li className='hint' style={{ listStyle: 'none', marginLeft: '-20px' }}>
                        <strong style={{ color: 'red', fontSize: 14, float: 'left' }}>*หมายเหตุ</strong>
                        <strong style={{ fontWeight: 'normal', textDecoration: 'underline', float: 'left', marginBottom: 20 }}>เอกสารทุกฉบับต้องเซ็นกํากับเอกสารว่า "เอกสารนี้เพื่อใช้ในการทําสัญญาบริการ Payment กับ Ksher เท่านั้น"</strong>
                    </li>
                </ul>
                <div style={{ clear: 'both' }}>
                    <h2 style={{ fontSize: 20, textAlign: 'left', paddingLeft: 0, fontWeight: 'bold', fontFamily: 'Prompt' }}>
                        กรอกข้อมูลลงทะเบียน
                    </h2>
                </div>
                <Form.Item label="ชื่อ-นามสกุล">
                    <Input placeholder='กรอกชื่อ-นามสกุล' id="fullName" />
                </Form.Item>
                <Form.Item label="รหัสบัตรประชาชน">
                    <Input placeholder='กรอกรหัสบัตร' id="cardId" />
                </Form.Item>
                <Button disabled={button_disabled} onClick={saved} style={{ width: '100%', color: 'white', backgroundColor: '#f26522' }} size='large'>
                    สมัครสมาชิก
                </Button>
            </div>
            <style>
                {
                    `
                        @import url('https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,100;0,200;0,900;1,100;1,500;1,600;1,900&display=swap');
                        .registerForm .adm-list-body {
                            border-top: 0;
                            border-bottom: 0;
                        }
                        .adm-list-item-content {
                            border-top: 0;
                        }
                        .hint {
                            line-height: 36px;
                            list-style: decimal;
                            font-family: 'Prompt';
                            font-size:18px;
                        }
                        .uploadButton {
                            border: 2px solid #333434;
                            margin-bottom: 10px;
                        }
                    `
                }
            </style>
        </div>
    )
}
export default RegisterForm;