import React from "react";
import { Button, Card, DatePicker, Divider, Tooltip, Typography } from "antd";
import moment, { Moment } from 'moment';
import { displayErrorMessage, formatListingPrice } from "../../../../lib/utils";
import { Viewer } from "../../../../lib/types";
import {
    Listing as ListingData
} from "../../../../lib/graphql/queries/Listing/__generated__/Listing";
import { BookingsIndex } from "./types";

const { Paragraph, Text, Title } = Typography;

interface Props {
    viewer: Viewer;
    host: ListingData["listing"]["host"];
    price: number;
    bookingsIndex: ListingData["listing"]["bookingsIndex"];
    checkInDate: Moment | null;
    checkOutDate: Moment | null;
    setCheckInDate: (checkInDate: Moment | null) => void;
    setCheckOutDate: (checkOutDate: Moment | null) => (void | null);
    setModalVisible: (modalVisible: boolean) => void;
}

export const ListingCreateBooking = ({ 
    viewer,
    host,
    price,
    bookingsIndex,
    checkInDate,
    checkOutDate,
    setCheckInDate,
    setCheckOutDate,
    setModalVisible
}: Props) => {
    const bookingsIndexJSON: BookingsIndex = JSON.parse(bookingsIndex);

    const dateIsBooked = (currentDate: Moment) => {
        const year = moment(currentDate).year();
        const month = moment(currentDate).month();
        const day = moment(currentDate).day();

        // if val for year or month cannot be found, automatically return false
        if (bookingsIndexJSON[year] && bookingsIndexJSON[year][month]) {
            return Boolean(bookingsIndexJSON[year][month][day]);
        } else {
            return false;
        }
    };

    const disabledDateCheckIn = (currentDate?: Moment | any) => {
        if (currentDate) {
            const dateIsBeforeEndOfDay = currentDate.isBefore(moment().endOf("day"));
            const dateIsMoreThanYTD = moment(currentDate).isAfter(
                moment()
                    .endOf("day")
                    .add(365, "days")
            );
            
            return (
                dateIsBooked(currentDate) || 
                dateIsBeforeEndOfDay || 
                dateIsMoreThanYTD
            );
        } else {
            return false;
        }
    };

    const disabledDateCheckOut = (currentDate?: Moment | any) => {
        if (currentDate) {
            const dateIsBeforeEndOfDay = currentDate.isBefore(moment().endOf("day"));
            const dateIsMoreThanYTDPlusOneWeek = moment(currentDate).isAfter(
                moment()
                    .endOf("day")
                    .add(372, "days")
            );
            
            return (
                dateIsBooked(currentDate) || 
                dateIsBeforeEndOfDay || 
                dateIsMoreThanYTDPlusOneWeek
            );
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
            
            let dateCursor = checkInDate;

            while (moment(dateCursor).isBefore(selectedCheckOutDate, "days")) {
                dateCursor = moment(dateCursor).add(1, "days");

                const year = moment(dateCursor).year();
                const month = moment(dateCursor).month();
                const day = moment(dateCursor).date();

                if (
                    bookingsIndexJSON[year] &&
                    bookingsIndexJSON[year][month] &&
                    bookingsIndexJSON[year][month][day]
                ) {
                    return displayErrorMessage(
                        "cannot book a window of time overlapping with an existing booking"
                    );
                }
            }
        }
        setCheckOutDate(selectedCheckOutDate);
    };

    const viewerIsHost = viewer.id === host.id;
    const checkInInputDisabled = !viewer.id || viewerIsHost || !host.hasWallet;
    const checkOutInputDisabled = checkInInputDisabled || !checkInDate;
    const buttonDisabled = checkOutInputDisabled || !checkInDate || !checkOutDate;
    
    let buttonMessage = "charge will not yet be applied";

    if (!viewer.id) {
        buttonMessage = "must be signed in to book a listing";
    } else if (viewerIsHost) {
        buttonMessage = "cannot book your own listing";
    } else if (!host.hasWallet) {
        buttonMessage = 
            "host has disconnected from Stripe and therefore cannot receive payments";
    }

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
                            showToday={true}
                            disabled={checkInInputDisabled}
                            disabledDate={disabledDateCheckIn}
                            onOpenChange={() => setCheckOutDate(null)}
                            onChange={dateValue => setCheckInDate(dateValue)}
                            renderExtraFooter={() => {
                                return (
                                    <div>
                                        <Text 
                                            type="secondary"
                                            className="ant-calendar-footer-text"    
                                        >
                                            Booking checkin cannot exceed year-to-date
                                        </Text>
                                    </div>
                                );
                            }}
                        />
                    </div>
                    <div className="listing-booking__card-date-picker">
                        <Paragraph strong>Check Out</Paragraph>
                        <DatePicker 
                            value={checkOutDate ? checkOutDate : undefined}
                            format={"YYYY/MM/DD"}
                            showToday={false}
                            disabled={checkOutInputDisabled}
                            disabledDate={disabledDateCheckOut}
                            onChange={dateValue => verifyAndSelectCheckOutDate(dateValue)}
                            dateRender={current => {
                                if (
                                    moment(current).isSame(checkInDate ? checkInDate : undefined, "day")
                                ) {
                                    return (
                                        <Tooltip title="check in date">
                                            <div className="ant-calendar-date ant-calendar-date__check-in">
                                                {current.date()}
                                            </div>
                                        </Tooltip>
                                    );
                                } else {
                                    return (
                                        <div className="ant-calendar-date">
                                            {current.date()}
                                        </div>
                                    );
                                }
                            }}
                            renderExtraFooter={() => {
                                return (
                                    <div>
                                        <Text 
                                            type="secondary"
                                            className="ant-calendar-footer-text"    
                                        >
                                            Checkout cannot be before checkin date
                                        </Text>
                                    </div>
                                );
                            }}
                        />
                    </div>
                </div>
                <Divider />
                <Button 
                    size="large" 
                    type="primary" 
                    className="listing-booking__card-cta"
                    disabled={buttonDisabled}
                    onClick={() => setModalVisible(true)}
                >
                    Request to book
                </Button>
                <Text type="secondary" mark>
                    {buttonMessage}
                </Text>
            </Card>
        </div>
    );
};