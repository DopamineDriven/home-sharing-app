import React from "react";
import { Button, Divider, Modal, Typography } from "antd";
import { KeyOutlined } from "@ant-design/icons";
import moment, { Moment } from "moment";
import { formatListingPrice, iconColor } from "../../../../lib/utils";

interface Props {
    price: number;
    modalVisible: boolean;
    checkInDate: Moment;
    checkOutDate: Moment;
    setModalVisible: (modalVisible: boolean) => void;
}

const { Paragraph, Text, Title } = Typography;

export const ListingCreateBookingModal = ({ 
    price,
    modalVisible,
    checkInDate,
    checkOutDate,
    setModalVisible 
}: Props) => {

    const daysBooked = checkOutDate.diff(checkInDate, "days") + 1;
    const listingPrice = price * daysBooked;
    // const homeSharingFee = 0.05 * listingPrice;
    const totalPrice = listingPrice;


    return (
        <Modal
            visible={modalVisible}
            centered
            footer={null}
            onCancel={() => setModalVisible(false)}
        >
            <div className="listing-booking-modal">
                <div className="listing-booking-modal__intro">
                    <Title className="listing-booking-modal__intro-title">
                        <KeyOutlined style={{ 
                            color: iconColor,
                            display: "inline-block",
                            verticalAlign: "middle" 
                        }} />
                    </Title>
                    <Title level={3} className="listing-booking-modal__intro-title">
                        Book your trip
                    </Title>
                    <Paragraph>
                        Enter payment information to book this listing from{" "}
                        <Text mark strong>
                            {moment(checkInDate).format("MMMM Do YYYY")}
                        </Text>{" "}
                        through{" "}
                        <Text mark strong>
                            {moment(checkOutDate).format("MMMM Do YYYY")}
                        </Text>
                    </Paragraph>
                </div>

                <Divider />
                
                <div className="listing-booking-modal__charge-summary">
                    <Paragraph>
                        {formatListingPrice(price, false)}/day x {daysBooked} days ={" "}
                        <Text strong>
                            {formatListingPrice(listingPrice, false)}
                        </Text>
                    </Paragraph>
                    {/* <Paragraph>
                        HomeSharing Fee <Text>~5%</Text> ={" "}
                        <Text strong>
                            {formatListingPrice(homeSharingFee)}
                        </Text>
                    </Paragraph> */}
                    <Paragraph className="listing-booking-modal__charge-summary-total">
                        Total = 
                        <Text mark>
                            {formatListingPrice(totalPrice, false)}
                        </Text>
                    </Paragraph>
                </div>

                <Divider />

                <div className="listing-booking-modal__stripe-card-section">
                    <Button
                        size="large"
                        type="primary"
                        className="listing-booking-modal__cta"
                    >
                        Book
                    </Button>
                </div>
            </div>
        </Modal>
    );
};