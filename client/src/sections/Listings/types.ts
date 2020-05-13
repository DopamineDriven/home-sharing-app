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