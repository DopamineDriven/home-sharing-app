interface Listing {
    id: string;
    title: string;
    image: string;
    address: string;
    price: number;
    numOfGuests: number;
    numOfBeds: number;
    numOfBaths: number;
    rating: number;
}

// exporting Listingsdata -> represents shape of data field returned from API
export type ListingsData = {
    listings: Listing[];
};

export interface DeleteListingData {
    deleteListing: Listing;
}

// only var of deleteListing mutation is an id of type string
export interface DeleteListingVariables {
    id: string;
}