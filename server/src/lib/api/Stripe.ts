import stripe from "stripe";

const client = new stripe(`${process.env.S_SECRET_KEY}`, {
    apiVersion: "2020-03-02"
});

export const Stripe = {
    connect: async (code: string) => {
        /* eslint-disable @typescript-eslint/camelcase */
        const response = await client.oauth.token({
            grant_type: "authorization_code",
            code
        /* eslint-enable @typescript-eslint/camelcase */
        });
        return response;
    }
};

/*
response obj returned from client.oauth.token() func contain a series
of different fields such as
    stripe_user_id, access_token, scope, livemode, token_type, etc
    some use cases might want to track access_token of a user
        to make requests on behalf of a persons account
        to support recurring payments
    however, for this use-case the only param desired is
        stripe_user_id
*/