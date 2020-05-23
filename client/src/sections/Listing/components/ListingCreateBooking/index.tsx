import React from "react";
import { Button, Card, DatePicker, Divider, Typography } from "antd";
import { Moment } from "moment";
import { formatListingPrice } from "../../../../lib/utils";

const { Paragraph, Title } = Typography;

interface Props {
    price: number;
    checkInDate: Moment | null;
    checkOutDate: Moment | null;
    setCheckInDate: (checkInDate: Moment | null) => void;
    setCheckOutDate: (checkOutDate: Moment | null) => void;
}

export const ListingCreateBooking = ({ 
    price,
    checkInDate,
    checkOutDate,
    setCheckInDate,
    setCheckOutDate 
}: Props) => {
    return (
        <div className="listing-booking">
            <Card className="listing-booking__card">
                <div>
                    <Paragraph>
                        <Title level={2} className="listing-booking__card-title">
                            {`${formatListingPrice(price)}/day`}
                        </Title>
                    </Paragraph>
                    <Divider />
                    <div className="listing-booking__card-date-picker">
                        <Paragraph strong>Check In</Paragraph>
                        <DatePicker />
                    </div>
                    <div className="listing-booking__card-date-picker">
                        <Paragraph strong>Check Out</Paragraph>
                        <DatePicker />
                    </div>
                </div>
                <Divider />
                <Button size="large" type="primary" className="listing-booking__card-cta">
                    Request to book
                </Button>
            </Card>
        </div>
    );
};