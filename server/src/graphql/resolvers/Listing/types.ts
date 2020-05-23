import { Booking } from "../../../lib/types";

export interface ListingArgs {
    id: string;
}

export interface ListingBookingsArgs {
    limit: number;
    page: number;
}

export interface ListingBookingsData {
    total: number;
    result: Booking[];
}

/*
import Booking interface (descriptive of booking doc shape in database)

export interface Booking {
    _id: ObjectId;
    listing: ObjectId;
    tenant: string;
    checkIn: string;
    checkOut: string;
}

*/