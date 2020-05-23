import React from "react";
import { Button, Card, Divider, Typography } from "antd";
import { formatListingPrice } from "../../../../lib/utils";

const { Paragraph, Title } = Typography;

interface Props {
    price: number;
}

export const ListingCreateBooking = ({price}: Props) => {
    return (
        <div className="listing-booking">
            <Card className="listing-booking__card">
                <div>
                    <Paragraph>
                        <Title level={2} className="listing-booking__card-title">
                            {formatListingPrice(price)}
                        </Title>
                    </Paragraph>
                    <Divider />
                    <div className="listing-booking__card-date-picker">
                        <Paragraph strong>Check In</Paragraph>
                    </div>
                    <div className="listing-booking__card-date-picker">
                        <Paragraph strong>Check Out</Paragraph>
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