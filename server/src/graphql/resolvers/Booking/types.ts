export interface CreateBookingArgs {
    input: CreateBookingInput;
}

export interface CreateBookingInput {
    id: string;
    source: string;
    checkIn: string;
    checkOut: string;
}