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
