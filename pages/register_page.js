import React, { PureComponent } from 'react';
import dynamic from 'next/dynamic';
const RegisterPazzy = dynamic(() => import('../components/registerPazzy'),{ssr:false})
export default class registerPage extends PureComponent {
  render() {
    return (
      <div>
        <RegisterPazzy/>
      </div>
    )
  }
};