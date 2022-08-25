import React, { PureComponent } from 'react';
import dynamic from 'next/dynamic';
const Navbar = dynamic(() => import('../components/navbar'), { ssr: false })
import { Steps, Button, Upload } from 'antd-mobile'
const { Step } = Steps;
export default class Guide extends PureComponent {
    goTo_register = () => {
        location.href = '/register_page';
    };
    render() {
        return (
            <div>
                <Navbar />
                <h1 style={{ fontWeight: 'normal' }} className='text-header'>
                    วิธีสมัครสมาชิก
                    <br /><strong style={{ color: '#f26522' }}>ประเภทบุคคลธรรมดา</strong>
                </h1>
                <h2 className='text-label'>เอกสารที่ต้องเตรียม</h2>
                <div style={{ padding: 30 }}>
                    <Steps direction='vertical'>
                        <Step
                            title={<span style={{ fontSize: 17 }}>1.อัพโหลดไฟล์ภาพ โลโก้ ร้านค้า/บริษัท</span>}
                            status='finish'
                            description={<span style={{ fontSize: 16, fontFamily: 'Prompt', color: 'black' }}>โลโก้ หรือ ชื่อร้านให้ชัดเจน ไม่สามารถใช้ชื่อบุคคล</span>}
                        />
                        <Step
                            title={<span style={{ fontSize: 17 }}>2.ยืนยันตัวตน เจ้าของกิจการ/กรรมการ</span>}
                            status='finish'
                            description={<span style={{ fontSize: 16, fontFamily: 'Prompt', color: 'black' }}>ภาพถ่ายหน้าเจ้าของบัตรคู่กับบัตรประจำตัวประชาชน (Selfie)</span>}
                        />
                        <Step
                            title={<span style={{ fontSize: 17 }}>3.เอกสารประเภทสำเนา</span>}
                            status='finish'
                            description={
                                <span style={{ fontSize: 16, fontFamily: 'Prompt', color: 'black' }}>
                                    3.1 สำเนาบัตรประชาชน หรือ สำเนาหนังสือเดินทางของเจ้าของหรือผู้มีอำนาจ (หน้า & หลัง บัตร)
                                    <br />3.2 สำเนาใบอนุญาตประกอบกิจการ หรือ เอกสารแสดงที่มาของสินค้า
                                    <br />(เช่นใบอนุญาตประกอบธุรกิจนำเที่ยว, เอกสารการเป็นตัวแทนจำหน่าย, เอกสารการเป็นตัวแทนจำหน่ายรายย่อย,
                                    ใบจดทะเบียนเครื่องหมายการค้า ฯลฯ (สำหรับบางประเภทธุรกิจต้องมี)
                                </span>}
                        />
                        <Step
                            title={<span style={{ fontSize: 17 }}>4.เอกสารทางการเงิน</span>}
                            status='finish'
                            description={<span style={{ fontSize: 16, fontFamily: 'Prompt', color: 'black' }}>ภาพถ่ายสมุดเงินฝาก/สำเนาบัญชีธนาคาร</span>}
                        />
                        <Step
                            title={<span style={{ fontSize: 17 }}>5.ข้อมูลสินค้า</span>}
                            status='finish'
                            description={<span style={{ fontSize: 16, fontFamily: 'Prompt', color: 'black' }}>ตัวอย่างภาพถ่ายสินค้าหรือบริการ พร้อมทั้งระบุจำนวนตู้ให้ชัดเจน</span>}
                        />
                        <Step
                            title={<span style={{ fontSize: 17 }}>6.ข้อมูลที่อยู่</span>}
                            status='finish'
                            description={<span style={{ fontSize: 16, fontFamily: 'Prompt', color: 'black' }}>สำเนาทะเบียนบ้าน หรือ ใบทะเบียนพาณิชย์ หรือ สัญญาเช่าพื้นที่ของที่ตั้งร้านค้า</span>}
                        />
                        <br />
                        <Button style={{ width: '100%', color: 'white', backgroundColor: '#f26522' }} onClick={this.goTo_register}>สนใจสมัครสมาชิก</Button>
                    </Steps>
                </div>
                <style>
                    {
                        `
                        @import url('https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,100;0,200;0,900;1,100;1,500;1,600;1,900&display=swap');
                        .text-header {
                            padding-top: 30px;
                            text-align: center;
                            font-family: Prompt;
                        }
                        .text-label {
                            text-align: left;
                            margin-left: 30px;
                            margin-top: 20px;
                            font-family: 'Prompt';
                            font-weight: bold;
                        }
                        `
                    }
                </style>
            </div>
        )
    }

}