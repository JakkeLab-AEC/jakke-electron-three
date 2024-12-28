import React, { useEffect, useState } from "react"
import {ThreeViewPort} from './view/component/threeViewport/threeViewport'
import {Header} from './view/component/header/header';
import {appInfo} from '../appConfig'
import {Sidebar} from './view/sidebar/sidebar';
import {ModalOverlay} from './homescreenitems/modalOverlay';

export const HomeScreen = () => {
    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div style={{position: 'absolute', width:'100%'}}>
                <Header appName={appInfo.ApplicationName} />
            </div>
            <div id="main-sidebar" style={{position:'absolute', justifyContent: 'center', top: 64, bottom: 16}}>
                <Sidebar />
            </div>
            <div>
                <ThreeViewPort />
            </div>
            <ModalOverlay />
        </div>
    )
}
