import liff from '@line/liff';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import {
    Form, Input, Button, Timeline
} from 'antd-mobile';
import { Upload, message } from 'antd';
import 'antd/dist/antd.css';
import { CheckCircleOutlined, ShopOutlined } from '@ant-design/icons'
import firebase from '../static/firebaseConnect';
import axios from 'axios';
const db = firebase.database();
const storage = firebase.storage();
const BusinessRegisterForm = (props) => {
    const router = useRouter()
    const [form] = Form.useForm();
    // line user
    let UID = props.id;
    let username = props.username;
    let profileImage = props.profileImage;
    const [cardID, setCardId] = useState([]);
    const [work_permit, setWork_permit] = useState([]);
    const [book, setBook] = useState([]);
    const [DBD_verified, setDBD_verified] = useState([]);
    const [tax_register, setTax] = useState([]);
    const [storeImage, setStoreImage] = useState([]);
    const [businessLicense, setBusinessLicense] = useState([]);

    const [button_disabled, setButton] = useState(false);
    useEffect(() => {
        if (props.id != null) {
            db.ref('users').orderByChild('UID').equalTo(props.id).on('value', (snapshot) => {
                if (props.id == snapshot.val().UID) {
                    setButton(true);
                    setTimeout(() => {
                        location.href = `/users-inactive?id=${props.id}`
                    }, 5000);
                }
                else {
                    setButton(false);
                }
            })
        }
    }, [props])

    //function for uploading CARD ID
    const uploadBusinessOwnerCard = {
        name: 'card_ID',
        multiple: false,
        showUploadList: {
            showDownloadIcon: false,
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
    const uploadWork_permit = {
        //setWork_permit
        name: 'work_permit',
        multiple: false,
        showUploadList: {
            showDownloadIcon: false,
        },
        onRemove: (file) => {
            const index = work_permit.indexOf(file);
            const newFileList = work_permit.slice();
            newFileList.splice(index, 1);
            setWork_permit(newFileList);
        },
        beforeUpload: (file) => {
            setWork_permit([...work_permit, file]);
            return false
        },
        work_permit
    }
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
    const upload_DBD_verified = {
        name: 'dbd',
        multiple: false,
        showUploadList: {
            showDownloadIcon: false,
        },
        onRemove: (file) => {
            const index = DBD_verified.indexOf(file);
            const newFileList = DBD_verified.slice();
            newFileList.splice(index, 1);
            setDBD_verified(newFileList);
        },
        beforeUpload: (file) => {
            setDBD_verified([...DBD_verified, file]);
            return false
        },
        DBD_verified
    }
    const upload_tax_register = {
        name: 'tax',
        multiple: false,
        showUploadList: {
            showDownloadIcon: false,
        },
        onRemove: (file) => {
            const index = tax_register.indexOf(file);
            const newFileList = tax_register.slice();
            newFileList.splice(index, 1);
            setTax(newFileList);
        },
        beforeUpload: (file) => {
            setTax([...tax_register, file]);
            return false
        },
        tax_register
    }

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
    const uploadBusinessLicense = {
        name: 'businessLicense',
        multiple: false,
        showUploadList: {
            showDownloadIcon: false,
        },
        onRemove: (file) => {
            const index = businessLicense.indexOf(file);
            const newFileList = businessLicense.slice();
            newFileList.splice(index, 1);
            setBusinessLicense(newFileList);
        },
        beforeUpload: (file) => {
            setBusinessLicense([...businessLicense, file]);
            return false
        },
        businessLicense
    };
    const saved = async () => {
        try {
            let companyName = document.getElementById('companyName').value;
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let timeStamp = new Date();
            let storage_path = "register_application_form";
            let card = cardID[0];
            let copy_work_permit = work_permit[0];
            let bookBank = book[0];
            let DBD_verified_docs = DBD_verified[0];
            let tax = tax_register[0];
            let storeFrontImage = storeImage[0];
            let business_license = businessLicense[0];

            // card id
            let uploadCard = await storage.ref(`${storage_path}/${card.name}`).put(card);
            let card_src = await uploadCard.ref.getDownloadURL();
            // work_permit
            let upload_Work_permit = await storage.ref(`${storage_path}/${copy_work_permit.name}`).put(copy_work_permit);
            let work_permit_src = await upload_Work_permit.ref.getDownloadURL();
            // bookbank
            let upload_bookBank = await storage.ref(`${storage_path}/${bookBank.name}`).put(bookBank);
            let bookBank_src = await upload_bookBank.ref.getDownloadURL();
            // DBD docs
            let upload_DBD = await storage.ref(`${storage_path}/${DBD_verified_docs.name}`).put(DBD_verified_docs);
            let DBD_verified_src = await upload_DBD.ref.getDownloadURL();
            // tax registeration
            let upload_tax_docs = await storage.ref(`${storage_path}/${tax.name}`).put(tax);
            let tax_registeration_src = await upload_tax_docs.ref.getDownloadURL();
            // upload store & retail image
            let upload_store = await storage.ref(`${storage_path}/${storeFrontImage.name}`).put(storeFrontImage);
            let storeImage_src = await upload_store.ref.getDownloadURL();
            // verified_image
            let upload_business_license = await storage.ref(`${storage_path}/${business_license.name}`).put(business_license);
            let business_license_src = await upload_business_license.ref.getDownloadURL();

            db.ref('business_register_docs').push({
                UID: props.id,
                card_id: card_src,
                work_permit: work_permit_src,
                book_bank: bookBank_src,
                dbd_verified: DBD_verified_src,
                tax_registeration: tax_registeration_src,
                shop_image: storeImage_src,
                business_license: business_license_src,
                created: `${months[timeStamp.getMonth()]}-${timeStamp.getDate()}-${timeStamp.getFullYear()}`
            });
            if (profileImage != undefined || profileImage != null) {
                db.ref('users').push({
                    UID: props.id,
                    registerID: String(props.id).substring(2, 11),
                    companyName: companyName,
                    username: username,
                    displayImage: profileImage,
                    account_type: 'business',
                    registerStatus: 'กำลังดำเนินการ',
                    verify_status: 'inactive',
                    created: `${timeStamp.getDate()}-${timeStamp.getMonth() + 1}-${timeStamp.getFullYear()}`
                })
            }
            else {
                db.ref('users').push({
                    UID: props.id,
                    registerID: String(props.id).substring(2, 11),
                    companyName: companyName,
                    username: username,
                    account_type: 'business',
                    registerStatus: 'กำลังดำเนินการ',
                    verify_status: 'inactive',
                    created: `${timeStamp.getDate()}-${timeStamp.getMonth() + 1}-${timeStamp.getFullYear()}`
                })
            }
            form.resetFields();
            sendRichMenu(props.id);
        } catch (error) {
            if (error) {
                message.error('สมัครสมาชิกล้มเหลว');
            }
        }
    }
    let sendRichMenu = async (id) => {
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
                <ShopOutlined style={{ fontSize: 45, display: 'block', textAlign: 'center' }} />
                <p style={{ textAlign: 'center', fontSize: 18, fontWeight: 'lighter', paddingTop: 20 }}>
                    นิติบุคคล
                </p>
                <h2 style={{ fontSize: 20, textAlign: 'center', paddingLeft: 0, fontWeight: 'bold', fontFamily: 'Prompt' }}>
                    เอกสารที่ต้องอัพโหลด
                </h2>
                <ul style={{ padding: 20, paddingTop: 30 }}>
                    <li className='hint'>สําเนาบัตรประจําตัวประชาชนของเจ้าของกิจการ (หน้า-หลัง)</li>
                    <Upload
                        {...uploadBusinessOwnerCard}
                        fileList={null}
                    >
                        <Button style={{ marginTop: 10 }} className='uploadButton'>อัพโหลดสําเนาบัตรประจําตัว {checkUpload_status(cardID[0])}</Button>
                    </Upload>
                    <li className='hint'>Work Permit ที่ไม่หมดอายุ (ใช้กรณีมีเจ้าของกิจการหรือผู้มีอำนาจเป็นชาวต่างชาติ)</li>
                    <Upload
                        {...uploadWork_permit}
                        fileList={null}
                    >
                        <Button style={{ marginTop: 10 }} className='uploadButton'>Work Permit {checkUpload_status(work_permit[0])}</Button>
                    </Upload>
                    <li className='hint'>สําเนาสมุดบัญชีธนาคาร (ในนามนิติบุคคล หรือ ห้างหุ้นส่วนเท่านั้น)</li>
                    <Upload
                        {...bookBank}
                        fileList={null}
                    >
                        <Button style={{ marginTop: 10 }} className='uploadButton'>อัพโหลดสําเนาสมุดบัญชีธนาคาร {checkUpload_status(book[0])}</Button>
                    </Upload>
                    <li className='hint'>สำเนาใบ DBD <strong>(หนังสือรับรองนิติบุคคล)</strong> จดทะเบียนบริษัทไม่ต่ำกว่า 6 เดือนและคัดสำเนาไม่เกิน 6 เดือน</li>
                    <Upload
                        {...upload_DBD_verified}
                        fileList={null}
                    >
                        <Button style={{ marginTop: 10 }} className='uploadButton'>อัพโหลดสำเนาใบ DBD {checkUpload_status(DBD_verified[0])}</Button>
                    </Upload>
                    <li className='hint'>สำเนาทะเบียนภาษีมูลค่าเพิ่ม (ภ.พ.20 หรือ ภ.พ.9 หรือ ภ.พ.10) กรณีสำหรับบริษัทที่มีการจดทะเบียนภาษีมูลค่าเพิ่มแล้ว</li>
                    <Upload
                        {...upload_tax_register}
                        fileList={null}
                    >
                        <Button style={{ marginTop: 10 }} className='uploadButton'>อัพโหลดสำเนา ภ.พ.20 หรือ ภ.พ.9 หรือ ภ.พ.10 {checkUpload_status(tax_register[0])}</Button>
                    </Upload>
                    <li className='hint'>ภาพถ่ายร้านค้า หรือ ถ่ายหน้าเพจเว็บไซต์ หรือ Facebook หรือ Instagram ของทางร้าน (ต้องมีโลโก้หรือชื่อร้านค้า พร้อมทั้งให้เห็นนโยบายการคืนเงินและนโยบายจัดส่งสินค้าให้ชัดเจน)</li>
                    <Upload
                        {...storeFrontImage}
                        fileList={null}
                    >
                        <Button style={{ marginTop: 10 }} className='uploadButton'>ภาพถ่ายบริษัทหรือร้านค้า{checkUpload_status(storeImage[0])}</Button>
                    </Upload>


                    <li className='hint' style={{ marginBottom: 10 }}>สำเนาใบอนุญาติประกอบกิจการ (ตัวอย่าง เช่น ใบอนุญาติประกอบกิจการโรงแรม, ใบอนุญาติจำหน่ายแอลกอฮอล์)</li>
                    <Upload
                        {...uploadBusinessLicense}
                        fileList={null}
                    >
                        <Button style={{ marginTop: 10 }} className='uploadButton'>อัพโหลดใบอนุญาติ{checkUpload_status(businessLicense[0])}</Button>
                    </Upload>
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
                <Form.Item label="กรอกชื่อร้านค้า/บริษัท/หน่วยงาน">
                    <Input placeholder='ตัวอย่าง เช่น ABC company' id="companyName" />
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
                            font-size:16px;
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
export default BusinessRegisterForm;