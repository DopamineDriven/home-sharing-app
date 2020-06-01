import React from "react";
import { Button, Divider, Modal, Typography } from "antd";
import { Moment } from "moment";

interface Props {
    modalVisible: boolean;
    setModalVisible: (modalVisible: boolean) => void;
}

const { Paragraph, Text, Title } = Typography;

export const ListingCreateBookingModal = ({ 
    modalVisible,
    setModalVisible 
}: Props) => {
    return (
        <Modal
            visible={modalVisible}
            centered
            footer={null}
            onCancel={() => setModalVisible(false)}
        >
        </Modal>
    );
};