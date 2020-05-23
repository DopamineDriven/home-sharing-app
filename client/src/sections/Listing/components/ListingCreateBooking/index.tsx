import React from "react";
import { Button, Card, DatePicker, Divider, Typography } from "antd";
import moment, { Moment } from 'moment';
import { displayErrorMessage, formatListingPrice } from "../../../../lib/utils";

const { Paragraph, Title } = Typography;

interface Props {
    price: number;
    checkInDate: Moment | null;
    checkOutDate: Moment | null;
    setCheckInDate: (checkInDate: Moment | null) => void;
    setCheckOutDate: (checkOutDate: Moment | null) => (void | null);
}

export const ListingCreateBooking = ({ 
    price,
    checkInDate,
    checkOutDate,
    setCheckInDate,
    setCheckOutDate 
}: Props) => {
    const disabledDate = (currentDate?: Moment | any) => {
        if (currentDate) {
            const dateIsBeforeEndOfDay = currentDate.isBefore(moment().endOf("day"));

            return dateIsBeforeEndOfDay;
        } else {
            return false;
        }
    };

    const verifyAndSelectCheckOutDate = (selectedCheckOutDate: Moment | null) => {
        if (checkInDate && selectedCheckOutDate) {
            if (moment(selectedCheckOutDate).isBefore(checkInDate, "days")) {
                return displayErrorMessage(
                    "check out date must be on or after the check in date"
                );
            }   
        }
        setCheckOutDate(selectedCheckOutDate);
    };

    const checkOutInputDisabled = !checkInDate;
    const buttonDisabled = !checkInDate || !checkOutDate;

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
                        <DatePicker 
                            value={checkInDate ? checkInDate : undefined}
                            format={"YYYY/MM/DD"}
                            disabledDate={disabledDate}
                            showToday={false}
                            onOpenChange={() => setCheckOutDate(null)}
                            onChange={dateValue => setCheckInDate(dateValue)} 
                        />
                    </div>
                    <div className="listing-booking__card-date-picker">
                        <Paragraph strong>Check Out</Paragraph>
                        <DatePicker 
                            value={checkOutDate ? checkOutDate : undefined}
                            format={"YYYY/MM/DD"}
                            disabledDate={disabledDate}
                            disabled={checkOutInputDisabled}
                            showToday={false}
                            onChange={dateValue => verifyAndSelectCheckOutDate(dateValue)}
                        />
                    </div>
                </div>
                <Divider />
                <Button 
                    size="large" 
                    type="primary" 
                    className="listing-booking__card-cta"
                    disabled={buttonDisabled}
                >
                    Request to book
                </Button>
            </Card>
        </div>
    );
};