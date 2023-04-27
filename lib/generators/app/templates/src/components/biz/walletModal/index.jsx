import React, { useEffect, useState } from 'react';
import {
    useConnect,
    useNetwork,
} from 'wagmi'
import { Modal, Spin } from 'antd';
import { SUPPORTED_WALLETS } from '@utils/createClient'
import styles from './index.scss';
import { useTranslation } from "react-i18next";
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
import { LeftOutlined, LoadingOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Button } from 'antd'

export default function ({ open, onCancel, onOk, onOpen, ...restProps }) {

    const { connect, connectors, error, isLoading, pendingConnector, data } = useConnect({
        onSuccess (data) {
            setConnectingModalOpen(false)
        }
    })
    const { t, i18n } = useTranslation();
    const [connectModalOpen, setConnectModalOpen] = useState();
    const [connectingModalOpen, setConnectingModalOpen] = useState()

    //点击某个connecter
    const connectHandle = (connector) => {
        connect({ connector })
        onConnectListModalCancel(false)
        setConnectingModalOpen(true);
    }

    //点击返回
    const connectingBack = () => {
        onConnectListModalOpen(true)
        setConnectingModalOpen(false);
    }

    const onConnectListModalCancel = (...arg) => {
        if (onCancel) {
            onCancel(...arg)
        } else {
            setConnectModalOpen(false)
        }
    }

    const onConnectListModalOk = (...arg) => {
        if (onOk) {
            onOk(...arg)
        } else {
            setConnectModalOpen(false)
        }
    }

    const onConnectListModalOpen = (...arg) => {
        if (onOpen) {
            onOpen(...arg)
        } else {
            setConnectModalOpen(true)
        }
    }

    useEffect(() => {
        //外面控制必须要要有取消和打开的方法
        if (onCancel && onOpen) {
            setConnectModalOpen(open)
        }
    }, [open])

    const connectItem = (connector, walletObj) => {
        return <div
            className={styles["connect-item"]}
            key={connector.id}
        >
            <div className={styles.cont}>
                <div className={styles.tit}>{connector.name}</div>
                <div className={styles.desc}>
                    {walletObj.id == 'metaMask' ? "Easy-to-use Brower Extension" : "Scan with WalletConnect to connect"}
                </div>
            </div>
            <div className={styles.logo}><img src={walletObj.logo} alt={connector.name} /></div>
        </div>
    }

    return (
        <>
            {/* 连接方式列表弹层 */}
            <Modal
                title={"connect wallet"}
                footer={null}
                {...restProps}
                centered
                open={connectModalOpen}
                onCancel={onConnectListModalCancel}
                onOk={onConnectListModalOk}
            >
                <div className={styles["connect-container"]}>
                    {connectors.map((connector, index) => {
                        const walletObj = SUPPORTED_WALLETS[index]
                        if (walletObj.visible) {
                            if (connector.ready) {
                                return <div key={connector.id} className={styles["connect-item-out"]} onClick={connectHandle.bind(null, connector)}>{connectItem(connector, walletObj)}</div>
                            } else if (walletObj.installUrl) {
                                return <div
                                    key={connector.id}
                                    className={styles["connect-item-out"]}>
                                    <a href={walletObj.installUrl} target='_blank'>
                                        <div
                                            className={styles["connect-item"]}
                                            key={connector.id}
                                        >
                                            <div className={styles.cont}>
                                                <div className={styles.tit}>{connector.name}</div>
                                                <div className={styles.desc}>
                                                    Install Metamask
                                                </div>
                                            </div>
                                            <div className={styles.logo}><img src={walletObj.logo} alt={connector.name} /></div>
                                        </div>
                                    </a>
                                </div>


                            } else {
                                return <div key={connector.id}>unSupported</div>
                            }
                        } else {
                            return null;
                        }
                    })}
                </div>
            </Modal>

            {/* 连接进行中的弹层 */}
            <Modal
                centered
                title={<div className={styles["connecting-modal-tit"]} onClick={connectingBack}>
                    <LeftOutlined />
                    <span className={styles.tit}>return</span>
                </div>}
                open={connectingModalOpen}
                onCancel={() => setConnectingModalOpen(false)}
                footer={null}>

                {error && <div className={styles["status-wrap"]}>
                    <div className={styles["connect-error"]}>
                        <span className={styles["error-txt"]}><ExclamationCircleOutlined />connection error</span>
                        <Button onClick={() => { connect({ connector: pendingConnector }) }}>Try again</Button>
                    </div>
                </div>}

                {/* 正在初始化连接 */}
                {isLoading && <div className={styles["status-wrap"]}><div className={styles.initializing}><Spin indicator={<LoadingOutlined spin />} />initializing</div></div>}

                {
                    connectors.filter(item => item.id === pendingConnector?.id).map((connector, index) => {
                        console.log('connector', connector)
                        const walletObj = SUPPORTED_WALLETS.find(item => item.id === connector.id);
                        console.log('walletObj', walletObj)
                        if (error) {
                            return <div className={cx("connect-trigger")} onClick={connectHandle.bind(null, connector)}>{connectItem(connector, walletObj)}</div>
                        } else {
                            return connectItem(connector, walletObj)
                        }
                    })
                }
            </Modal>
        </>
    )
}
