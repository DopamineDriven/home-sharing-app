import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { useScrollToTop } from "../../lib/hooks";
import { Moment } from "moment";
import { Col, Layout, Row } from "antd";
import { 
    ListingBookings, 
    ListingCreateBooking, 
    WrappedListingCreateBookingModal as ListingCreateBookingModal, 
    ListingDetails 
} from "./components";
import { ErrorBanner, PageSkeleton } from "../../lib/components";
import { LISTING } from "../../lib/graphql/queries";
import { 
    Listing as ListingData,
    ListingVariables
} from "../../lib/graphql/queries/Listing/__generated__/Listing";
import { Viewer } from "../../lib/types";

interface Props {
    viewer: Viewer;
}

interface MatchParams {
    id: string;
}

const { Content } = Layout;
const PAGE_LIMIT = 3;

export const Listing = ({ viewer, match }: Props & RouteComponentProps<MatchParams>) => {
    useScrollToTop();
    const [bookingsPage, setBookingsPage] = useState(1);
    const [checkInDate, setCheckInDate] = useState<Moment | null>(null);
    const [checkOutDate, setCheckOutDate] = useState<Moment | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const { data, loading, error, refetch } = useQuery<
        ListingData, ListingVariables
    >(LISTING, {
        variables: {
            id: match.params.id,
            bookingsPage,
            limit: PAGE_LIMIT
        }
    });

    const clearBookingData = () => {
        setModalVisible(false);
        setCheckInDate(null);
        setCheckOutDate(null);
    };

    const handleListingRefetch = async () => {
        await refetch();
    };

    const listing = data ? data.listing : null;
    
    const listingBookings = listing ? listing.bookings : null;
    
    const listingDetailsElement = listing ? <ListingDetails listing={listing} /> : null;

    const listingBookingsElement = listingBookings ? (
        <ListingBookings 
            listingBookings={listingBookings}
            bookingsPage={bookingsPage}
            limit={PAGE_LIMIT}
            setBookingsPage={setBookingsPage}
        />
    ) : null;

    const listingCreateBookingElement = listing ? (
        <ListingCreateBooking 
            viewer={viewer}
            host={listing.host}
            price={listing.price}
            bookingsIndex={listing.bookingsIndex}
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            setCheckInDate={setCheckInDate}
            setCheckOutDate={setCheckOutDate}
            setModalVisible={setModalVisible}
        />
    ) : null;

    const listingCreateBookingModalElement = 
        listing && checkInDate && checkOutDate ? (
            <ListingCreateBookingModal
                id={listing.id}
                price={listing.price}
                modalVisible={modalVisible}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                setModalVisible={setModalVisible}
                clearBookingData={clearBookingData}
                handleListingRefetch={handleListingRefetch}
            />
        ) : null;


    return loading ? (
        <Content className="listing">
            <PageSkeleton />
        </Content>
	) : error ? (
        <Content className="listing">
            <ErrorBanner description="listing may not exist or an error occurred; please try again" />
            <PageSkeleton />
        </Content>
	) : (
        <Content className="listing">
            <Row gutter={24} justify="space-between">
                <Col xs={24} lg={14} flex="auto">
                    {listingDetailsElement}
                    {listingBookingsElement}
                </Col>
                <Col xs={24} lg={10} flex="auto">
                    {listingCreateBookingElement}
                </Col>
            </Row>
            {listingCreateBookingModalElement}
        </Content>
    )
};
// http://localhost:3000/listing/5d378db94e84753160e08b37
// data to test listingbookingselement on return in dev
// const listingBookings = {
//     total: 4,
//     result: [
//       {
//         id: "5daa530eefc64b001767247c",
//         tenant: {
//           id: "117422637055829818290",
//           name: "User X",
//           avatar:
//             "https://lh3.googleusercontent.com/a-/AAuE7mBL9NpzsFA6mGSC8xIIJfeK4oTeOJpYvL-gAyaB=s100",
//           __typename: "User"
//         },
//         checkIn: "2019-10-29",
//         checkOut: "2019-10-31",
//         __typename: "Booking"
//       },
//       {
//         id: "5daa530eefc64b001767247d",
//         tenant: {
//           id: "117422637055829818290",
//           name: "User X",
//           avatar:
//             "https://lh3.googleusercontent.com/a-/AAuE7mBL9NpzsFA6mGSC8xIIJfeK4oTeOJpYvL-gAyaB=s100",
//           __typename: "User"
//         },
//         checkIn: "2019-11-01",
//         checkOut: "2019-11-03",
//         __typename: "Booking"
//       },
//       {
//         id: "5daa530eefc64b001767247g",
//         tenant: {
//           id: "117422637055829818290",
//           name: "User X",
//           avatar:
//             "https://lh3.googleusercontent.com/a-/AAuE7mBL9NpzsFA6mGSC8xIIJfeK4oTeOJpYvL-gAyaB=s100",
//           __typename: "User"
//         },
//         checkIn: "2019-11-05",
//         checkOut: "2019-11-09",
//         __typename: "Booking"
//       },
//       {
//         id: "5daa530eefc64b001767247f",
//         tenant: {
//           id: "117422637055829818290",
//           name: "User X",
//           avatar:
//             "https://lh3.googleusercontent.com/a-/AAuE7mBL9NpzsFA6mGSC8xIIJfeK4oTeOJpYvL-gAyaB=s100",
//           __typename: "User"
//         },
//         checkIn: "2019-11-10",
//         checkOut: "2019-11-11",
//         __typename: "Booking"
//       }
//     ]
//   } as any;