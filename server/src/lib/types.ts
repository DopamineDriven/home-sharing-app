import { Collection, ObjectId } from "mongodb";

// bool values indicate which days in the month have been booked
export interface BookingsIndexMonth {
    [key: string]: boolean;
}

export interface BookingsIndexYear {
    [key: string]: BookingsIndexMonth;
}

// key-value pairs in TS -> index signatures
export interface BookingsIndex {
    [key: string]: BookingsIndexYear;
}

export enum ListingType {
    Apartment = "APARTMENT",
    House = "HOUSE"
}

export interface Booking {
    _id: ObjectId;
    listing: ObjectId;
    tenant: string;
    checkIn: string;
    checkOut: string;
}

export interface Listing {
    _id: ObjectId;
    title: string;
    description: string;
    image: string;
    host: string;
    type: ListingType;
    address: string;
    country: string;
    admin: string;
    city: string;
    bookings:  ObjectId[];
    bookingsIndex: BookingsIndex;
    price: number;
    numOfGuests: number;
    authorized?: boolean;
}

export interface User {
    _id: string;
    token: string;
    name: string;
    avatar: string;
    contact: string;
    walletId?: string;
    income: number;
    bookings: ObjectId[];
    listings: ObjectId[];
    authorized?: boolean;
}

export interface Viewer {
    _id?: string;
    token?: string;
    avatar?: string;
    walletId?: string;
    didRequest: boolean;
}

export interface Database {
    listings: Collection<Listing>;
    users: Collection<User>;
    bookings: Collection<Booking>;
    viewer: Collection<Viewer>;
}

// <Listing> is type parameter of collection interface

/*
- Generics is a tool that allows for the creation of reusable components
    - abstract types used in functions or vars
- can use union types to make return type one of many
- using the any keyword is not ideal
    - does not imply what function will return

*/

/*
const identity = <T>(arg: number | string): number | string => {
    return arg
};

identity(5); // allowed 
identity("5"); // also allowed via union
*/

/*
- use angle brackets syntax - <> - to pass type variables (aka a type param or arg)
    - the type argument is available in the function as well
    - whatever Type var passed will be the type of the argument and return type of the function

const identity = <T>(arg: T): T => {
    return arg
};

identity<number>(5); // arg type and return type -> number
identity<string>("5"); // arg type and return type -> string
identity<object>({ fresh: "kicks" }); // arg type and return type -> object

*/

/*
- Assumption
    - want identity() function to create an obj that has a field prop
        - field prop with the value of arg


const identity = <T>(arg: T): T => {
    const obj = {
        field: arg
    };
    return arg
};

- Assumption
    - want to type constrain the obj created to a specific Interface type
        - TS type aliases and interfaces accept type vas as well
            - create an IdentityObj interface above the function
                - this sets type of a field prop to a type var passed in

interface IdentityObj<T> {
    field: T;
}

const identity = <T>(arg: T): T => {
    const obj = {
        field: arg
    };
    return arg
};

- Note
    - in identity function can define the type of obj as
        - the IdentityObj interface and pass the type var along
    - or could have the function return the field prop from obj to
        - conform to the expected return type of the identity() function


interface IdentityObj<T> {
    field: T;
}

const identity = <T>(arg: T): T => {
    const obj: IdentityObj<T> = {
        field: arg
    };
    return obj.field;
};

*/

/*
- Default Generic Values (Generic Parameter Defaults)
- Example
    - identity() function and IdentityObj interface assign
    - default type of any to the type var passed in

interface IdentityObj<T = any> {
  field: T;
}

const identity = <T = any>(arg: T): T => {
  const obj: IdentityObj<T> = {
    field: arg
  };
  return obj.field;
};

- in this way, if a type var isn't defined when using this function and
    - the compiler cannot infer what the type var is, it will be set to any

*/

/*
- The letter T is often used to infer a type var by convention
    - likely due to the fact that it stands for Type
- Example
    - identity() function accepting two type vars
        - TData and TVariables

interface IdentityObj<T = any> {
  field: T;
}

const identity = <TData = any, TVariables = any>(arg: TData): TData => {
  const obj: IdentityObj<TData> = {
    field: arg
  };
  return obj.field;
};
*/