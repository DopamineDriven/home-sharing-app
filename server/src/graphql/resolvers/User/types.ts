import { Booking, Listing } from "../../../lib/types";

export interface UserArgs {
    id: string;
}

export interface UserBookingsArgs {
    limit: number;
    page: number;
}

// describe shape of data for bookings() resolver to return
    // total field of type number
    // result field to be an array of the Booking interface
export interface UserBookingsData {
    total: number;
    result: Booking[];
}

export interface UserListingsArgs {
    limit: number;
    page: number;
}

export interface UserListingsData {
    total: number;
    result: Listing[];
}

/*
One could also have a single interface for the args for both the 
bookings() and listings() resolver function. Additionally, one can 
create a base interface for the data to be returned from the bookings() and 
listings() resolvers and have this base extended for the interfaces for 
UserBookingsData and UserListingsData.
*/