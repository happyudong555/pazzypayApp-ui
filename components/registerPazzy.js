import liff from '@line/liff';
import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Row, Col, Layout } from 'antd';
import { Tabs } from 'antd-mobile'
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import axios from 'axios';
import RegisterForm from './register';
import BusinessRegisterForm from './business_register'
const { Header } = Layout;
const logo = "https://firebasestorage.googleapis.com/v0/b/pazzypay.appspot.com/o/asset%2Fpazzy-logo.png?alt=media&token=4143476e-8c31-4acf-a502-4064342d9aca";
// class components
export default function RegisterPazzy() {
  const [UID, setUID] = useState(null);
  const [username, setUsername] = useState(null);
  const [candidateProfile, setProfile] = useState(null);
  useEffect(() => {
    // production only
    let liffID = "1657336941-7LBZjmgy";
    // develop only
    //let liffID = "1657283318-gaoAznLp";
    liff.init({ liffId: liffID }).then(() => {
      if (liff.isLoggedIn()) {
        try {
          liff.getProfile().then(profile => {
            setUID(profile.userId);
            setUsername(profile.displayName);
            setProfile(profile.pictureUrl);
          })
        } catch (error) {
        }
      } else {
        liff.login();
      }
    }).catch((err) => {
      // Error happens during initialization
      console.log(err.code, err.message);
    });
  }, []);
  return (
    <div className="container">
      <div>
        <Row>
          <Col span={24}>
            <Layout>
              <Header className='customerHeader'>
                <img className='logo' src={logo} />
              </Header>
            </Layout>
            <Tabs style={{ paddingTop: 10 }}>
              <Tabs.Tab title='บุคคลธรรมดา' key={1}>
                <RegisterForm id={UID} username={username} profileImage={candidateProfile} />
              </Tabs.Tab>
              <Tabs.Tab title='นิติบุคคล' key={2}>
                <BusinessRegisterForm id={UID} username={username} profileImage={candidateProfile} />
              </Tabs.Tab>
            </Tabs>
          </Col>
        </Row>
      </div>
      <style>
        {
          `
            @import url('https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,100;0,200;0,900;1,100;1,500;1,600;1,900&display=swap');
            .customerHeader {
              background: #231F20;
              height: 120px;
              overflow: hidden;
            }
            .customerHeader img {
              width: 100%;
              height: 100px;
              padding: 10px;
              margin-top: 15px;
              object-fit: cover;
            }
            .text-header {
              padding-top: 30px;
              text-align: center;
              font-family: Prompt;
            }
          `
        }
      </style>
    </div>
  );
}
