import { Modal } from 'antd';
import React, { useState, useEffect } from 'react';
import './QuitModal.scss';
import { useLanguageSelector } from '~/component/redux/selector';
const QuitModal = ({ visible, title, purpose, callback }) => {
    const currentLanguage = useLanguageSelector().currentLanguage;
    const { modal, setModal } = visible;
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState(currentLanguage.confirmLogout);

    useEffect(() => {
        switch (purpose) {
            case 'logout':
                setModalText(currentLanguage.confirmLogout);
                break;
            case 'leaveroom':
                setModalText(currentLanguage.confirmLeaveRoom);
                break;
            case 'delete-conversation':
                setModalText(currentLanguage.confirmDeleteConversation);
                break;
            default:
                break;
        }
    }, [purpose]);

    const handleOk = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            setModal(false);
            setConfirmLoading(false);
            callback();
        }, 2000);
    };

    const handleCancel = () => {
        setModal(false);
    };

    return (
        <Modal
            title={title}
            open={modal}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
            okText={currentLanguage.okText}
            cancelText={currentLanguage.cancelText}
            okButtonProps={{
                danger: true,
            }}
        >
            <p>{modalText}</p>
        </Modal>
    );
};

export default QuitModal;
