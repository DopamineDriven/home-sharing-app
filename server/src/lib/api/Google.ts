import { google } from 'googleapis';
import {
	Client,
	AddressComponent,
	AddressType,
	GeocodingAddressComponentType
} from '@googlemaps/google-maps-services-js';

const auth = new google.auth.OAuth2(
	process.env.G_CLIENT_ID,
	process.env.G_CLIENT_SECRET,
	`${process.env.PUBLIC_URL}/login`
);

const maps = new Client({});

// eslint-disable-next-line @typescript-eslint/camelcase
const { country, administrative_area_level_1, locality } = AddressType;
const pais = country;
// eslint-disable-next-line @typescript-eslint/camelcase
const { postal_town } = GeocodingAddressComponentType;

const parseAddress = (addressComponents: AddressComponent[]) => {
	let country = null;
	let admin = null;
	let city = null;

	for (const component of addressComponents) {
		// eslint-disable-next-line @typescript-eslint/camelcase
		const { long_name } = component;
		if (component.types.includes(pais)) {
			// eslint-disable-next-line @typescript-eslint/camelcase
			country = long_name;
		}

		if (component.types.includes(administrative_area_level_1)) {
			// eslint-disable-next-line @typescript-eslint/camelcase
			admin = long_name;
		}

		if (
			component.types.includes(locality) ||
			component.types.includes(postal_town)
		) {
			// eslint-disable-next-line @typescript-eslint/camelcase
			city = long_name;
		}
	}

	return { country, admin, city };
};

export const Google = {
	authUrl: auth.generateAuthUrl({
		// eslint-disable-next-line @typescript-eslint/camelcase
		access_type: 'online',
		scope: [
			'https://www.googleapis.com/auth/userinfo.email',
			'https://www.googleapis.com/auth/userinfo.profile'
		]
	}),
	logIn: async (code: string) => {
		const { tokens } = await auth.getToken(code);
		auth.setCredentials(tokens);
		const { data } = await google.people({ version: 'v1', auth }).people.get({
			resourceName: 'people/me',
			personFields: 'emailAddresses,names,photos'
		});
		return { user: data };
	},
	geocode: async (address: string) => {
		if (!process.env.G_GEOCODE_KEY)
			throw new Error('Google Maps API Key missing or not found');
		const res = await maps.geocode({
			params: { address, key: process.env.G_GEOCODE_KEY }
		});

		if (res.status < 200 || res.status > 299) {
			throw new Error('failed to geocode address');
		}
		return parseAddress(res.data.results[0].address_components);
	}
};

/*eslint-disable @typescript-eslint/camelcase */
