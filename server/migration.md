![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/23i9acwg697ztp3gt48a.gif)

## 1. Migration Documentation

Google recently deprecated their old `@google/maps` and `@types/google__maps` libraries in favor of their newer `@googlemaps/google-maps-services-js` library (which conveniently includes typescript typings). Upon visiting [the new library's npm page](https://www.npmjs.com/package/@googlemaps/google-maps-services-js), it states under [Migration](https://www.npmjs.com/package/@googlemaps/google-maps-services-js#migration) that "the two libraries do not share any methods or interfaces".

- The Old library exports a pair of `createClient` functions (one being synchronous the other asynchronous). `AddressComponent` is exported as a seemingly open-ended interface, with its _types_ property being defined by a generic array `T[]`. That, and this library defaults to the synchronous `createClient` function.

- The New library exports a class `Client` which can be instantiated as `const x = new Client({})`. TS classes compile and their typings remain in effect at runtime; so while they might take up some 'space' by sticking around after compilation, this does offer certain advantages. Another benefit? This library uses Promises by default (asynchronous) unlike the old library. That, and the `AddressComponent` interface declaration is more explicit in nature by avoiding generics and utilizing enums. For example, it no longer has its _types_ property defined as a generic array `T[]`. Rather, this property is much more robustly defined as an array of enums `Array<Enum1 | Enum2>`.

First, let's dissect the `AddressComponent` interface and compare the old with the new to arrive at a deeper understanding of these differences and their implications for refactoring our code.

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/c4ih6tllc1eaoetmsq9x.gif)

## 2. AddressComponent and its Constituents

At the most basic level, AddressComponent is declared as an interface in the old and the new package alike; "then what's the difference?" you might be asking yourself. That's a reasonable question, one that will be addressed in detail below.

### A. The Old

In the old library, the `AddressComponent` interface utilizes generics making it appear more ambiguous due to its seemingly open-ended nature. Its properties are defined as follows
`server/node_modules/@types/google__maps/index.d.ts`

```tsx
export interface AddressComponent<T> {
	types: T[];
	long_name: string;
	short_name: string;
}
```

### B. The New

Fortunately, the `AddressComponent` interface does not utilize generics in the new library and is therefore more explicitly defined. Its _types_ property is defined as an array consiting of two enums; a union of `AddressType` and `GeocodingAddressComponentType`. This explicitly indicates which two enums to reference for accepted values in our code instead of leaving us with a generic as the old library did.
`server/node_modules/@googlemaps/google-maps-services-js/dist/common.d.ts`

```tsx
// AddressComponent Interface Declaration
export interface AddressComponent {
	types: Array<AddressType | GeocodingAddressComponentType>;
	long_name: string;
	short_name: string;
}
```

```tsx
// AddressType Enum Declaration
export declare enum AddressType {
	street_address = 'street_address',
	route = 'route',
	intersection = 'intersection',
	political = 'political',
	country = 'country',
	administrative_area_level_1 = 'administrative_area_level_1',
	administrative_area_level_2 = 'administrative_area_level_2',
	administrative_area_level_3 = 'administrative_area_level_3',
	administrative_area_level_4 = 'administrative_area_level_4',
	administrative_area_level_5 = 'administrative_area_level_5',
	colloquial_area = 'colloquial_area',
	locality = 'locality',
	ward = 'ward',
	sublocality = 'sublocality',
	sublocality_level_1 = 'sublocality_level_1',
	sublocality_level_2 = 'sublocality_level_2',
	sublocality_level_3 = 'sublocality_level_3',
	sublocality_level_4 = 'sublocality_level_4',
	sublocality_level_5 = 'sublocality_level_5',
	neighborhood = 'neighborhood',
	premise = 'premise',
	subpremise = 'subpremise',
	postal_code = 'postal_code',
	natural_feature = 'natural_feature',
	airport = 'airport',
	park = 'park',
	point_of_interest = 'point_of_interest',
	establishment = 'establishment'
}
```

```tsx
// GeocodingAddressComponentType Enum Declaration
export declare enum GeocodingAddressComponentType {
	floor = 'floor',
	establishment = 'establishment',
	point_of_interest = 'point_of_interest',
	parking = 'parking',
	post_box = 'post_box',
	postal_town = 'postal_town',
	room = 'room',
	street_number = 'street_number',
	bus_station = 'bus_station',
	train_station = 'train_station',
	transit_station = 'transit_station'
}
```

As you can see, the new library has done an excellent job of eliminating ambiguity as far as the `AddressComponent` interface is concerned.

Next, let's compare and contrast the old `createClient` function to the new `Client` class instantiation.

## 3. Client Instantiation

The old library exports a pair of `createClient` functions; the default is synchronous in nature whereas the non-default returns a promise. The new library exports a `Client` class which can be instantiated via the keyword `new` in our code. `Client` is asynchronous by default.

### A. The Old

The deprecated way of declaring a client involved explicitly calling one of two `createClient` functions

```tsx
// synchronous (default)
export function createClient(options: CreateClientOptions): GoogleMapsClient;

// asynchronous
export function createClient(
	options: CreateClientOptionsWithPromise
): GoogleMapsClientWithPromise;
```

The non-default `createClient` function calls an `CreateClientOptionsWithPromise` interface on options. This Promise interface extends the properties of the `CreateClientOptions` interface called in the default `createClient` function.

```tsx
// CreateClientWithOptionsPromise Interface

export interface CreateClientOptionsWithPromise extends CreateClientOptions {
	Promise: PromiseConstructor;
}
```

The extension of the `CreateClientOptions` interface by the `CreateClientOptionsWithPromise` interface implies that the properties declared by the former are prepended to the shape of the latter. Therefore, it is necessary to explicitly call for a `Promise` after configuring the API key-value pair at `createClient` as follows

```tsx
const maps = createClient({ key: `${process.env.G_GEOCODE_KEY}`, Promise });
```

This overrides the default synchronous `createClient` configuration and indicates that it is to return a Promise. Next, let's take a look at the new Class-based `Client`.

### B. The New

The typescript class `Client` is a light-wrapper around API methods providing shared configurations for axios settings and supports Promises by default. For example, it supports retry, keep-alive, [cancellation](https://github.com/axios/axios#cancellation), and [interceptor](https://github.com/axios/axios#interceptors) methods. `Client` is declared as follows

```tsx
export declare class Client {
	private axiosInstance;
	private experienceId;
	constructor({ axiosInstance, config, experienceId }?: ClientOptions);
	setExperienceId(...ids: string[]): void;
	clearExperienceId(): void;
	private clearExperienceIdHeader;
	getExperienceId(): string[];
	directions(request: DirectionsRequest): Promise<DirectionsResponse>;
	distancematrix(request: DistanceMatrixRequest): Promise<DistanceMatrixResponse>;
	elevation(request: ElevationRequest): Promise<ElevationResponse>;
	timezone(request: TimeZoneRequest): Promise<TimeZoneResponse>;
	geolocate(request: GeolocateRequest): Promise<GeolocateResponse>;
	geocode(request: GeocodeRequest): Promise<GeocodeResponse>;
	reverseGeocode(request: ReverseGeocodeRequest): Promise<ReverseGeocodeResponse>;
	placeAutocomplete(request: PlaceAutocompleteRequest): Promise<PlaceAutocompleteResponse>;
	placeDetails(request: PlaceDetailsRequest): Promise<PlaceDetailsResponse>;
	findPlaceFromText(request: FindPlaceFromTextRequest): Promise<FindPlaceFromTextResponse>;
	placePhoto(request: PlacePhotoRequest): Promise<PlacePhotoResponse>;
	placesNearby(request: PlacesNearbyRequest): Promise<PlacesNearbyResponse>;
	placeQueryAutocomplete(request: PlaceQueryAutocompleteRequest): Promise<PlaceQueryAutocompleteResponse>;
	textSearch(request: TextSearchRequest): Promise<TextSearchResponse>;
	nearestRoads(request: NearestRoadsRequest): Promise<NearestRoadsResponse>;
	snapToRoads(request: SnapToRoadsRequest): Promise<SnapToRoadsResponse>;
}

/*
 * Instantiate with defaults
 * const client = new Client()
 *
 * Instantiate with config
 * const client = new Client({config})
 *
 *
 * Instantiate with axiosInstance **Advanced**
 * const axiosInstance = axios.create(config)
 * const client = new Client({axiosInstance})
 */
```

The old library exposes a public method, taking individual parameters as arguments, whereas the new library eliminates overhead complexity by offering direct access to the transport layer. The latter is achieved by exposing methods that take params, headers, body, etc..

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/gf62nizlgchzmh3iq0vz.gif)

## 4. Let the Migration begin

With the dissection of declaration files out of the way, let's get to it.

### A. Uninstall the old, Install the new

First, uninstall the old `@google/maps` and `@types/google__maps` packages and install the new `@googlemaps/google-maps-services-js` library in your server directory

```git
npm un --save @google/maps @types/google__maps && npm i --save @googlemaps/google-maps-services-js
```

Now, head to `server/src/lib/api/Google.ts`. The pre-migrated code should resemble the following:

```tsx
import { google } from 'googleapis';
import { createClient, AddressComponent } from '@google/maps';

const auth = new google.auth.OAuth2(
	process.env.G_CLIENT_ID,
	process.env.G_CLIENT_SECRET,
	`${process.env.PUBLIC_URL}/login`
);

const maps = createClient({ key: `${process.env.G_GEOCODE_KEY}`, Promise });

const parseAddress = (addressComponents: AddressComponent[]) => {
	let country = null;
	let admin = null;
	let city = null;

	for (const component of addressComponents) {
		if (component.types.includes('country')) {
			country = component.long_name;
		}

		if (component.types.includes('administrative_area_level_1')) {
			admin = component.long_name;
		}

		if (
			component.types.includes('locality') ||
			component.types.includes('postal_town')
		) {
			city = component.long_name;
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
		const res = await maps.geocode({ address }).asPromise();

		if (res.status < 200 || res.status > 299) {
			throw new Error('failed to geocode address');
		}

		return parseAddress(res.json.results[0].address_components);
	}
};
```

### B. Update Imports

Import `@googlemaps/google-maps-services-js` instead of the old `@google/maps` library. Then, replace the import of `createClient` with `Client`. We also want to import the two previously mentioned enums of utility - `AddressType` and `GeocodingAddressComponentType`.

```tsx
// Old
import { createClient, AddressComponent } from '@google/maps';

// New
import {
	Client, // Class
	AddressComponent, // Interface
	AddressType, // Enum
	GeocodingAddressComponentType // Enum
} from '@googlemaps/google-maps-services-js';
```

### C. Instantiate the Client

Now to instantiate the new Client. Instead of configuring the API key at client as the old library called for, the API key will be configured per method in a params object. Since `Client` is defined as a typescript class, it can be instantiated with the `new` keyword.

```tsx
// Old
const maps = createClient({ key: `${process.env.G_GEOCODE_KEY}`, Promise });

// New
const maps = new Client({});
```

You should see 6 new errors appear after instantiating the new maps `Client`. Not to worry, these will be resolved next.

### D. Refactoring the parseAddress function

As touched on previously, the `AddressComponent` interface has a _types_ property defined as an array consisting of the union of two enums - `AddressType` and `GeocodingAddressComponentType`. The unchanged code should look as follows

```tsx
// ...
const parseAddress = (addressComponents: AddressComponent[]) => {
	let country = null;
	let admin = null;
	let city = null;

	for (const component of addressComponents) {
		if (component.types.includes('country')) {
			country = component.long_name;
		}

		if (component.types.includes('administrative_area_level_1')) {
			admin = component.long_name;
		}

		if (
			component.types.includes('locality') ||
			component.types.includes('postal_town')
		) {
			city = component.long_name;
		}
	}

	return { country, admin, city };
};
// ...
```

Since we have access to the `AddressType` and `GeocodingAddressComponentType` enums defined in the _types_ property of the `AddressComponent` interface, the four `components.types.includes('string')` if-conditionals can be updated as follows

```tsx
// ...
const parseAddress = (addressComponents: AddressComponent[]) => {
	let country = null;
	let admin = null;
	let city = null;

	for (const component of addressComponents) {
		if (component.types.includes(AddressType.country)) {
			country = component.long_name;
		}

		if (component.types.includes(AddressType.administrative_area_level_1)) {
			admin = component.long_name;
		}

		if (
			component.types.includes(AddressType.locality) ||
			component.types.includes(GeocodingAddressComponentType.postal_town)
		) {
			city = component.long_name;
		}
	}

	return { country, admin, city };
};
// ...
```

Object destructuring can be utilized here. Since `let country = null` is called at the start of the function and is passed as a child of `AddressType` in the first if-conditional, let's destructure `AddressType` and `GeocodingAddressComponentType` outside of the function as follows. Note that the destructured `country` constant must be renamed to prevent clashing with the internal `let country = null` value. I chose to rename this value `pais`, which is country in Spanish.

```tsx
// ...
const { country, administrative_area_level_1, locality } = AddressType;
const pais = country;
const { postal_town } = GeocodingAddressComponentType;

const parseAddress = (addressComponents: AddressComponent[]) => {
	let country = null;
	let admin = null;
	let city = null;

	for (const component of addressComponents) {
		if (component.types.includes(pais)) {
			country = component.long_name;
		}

		if (component.types.includes(administrative_area_level_1)) {
			admin = component.long_name;
		}

		if (
			component.types.includes(locality) ||
			component.types.includes(postal_town)
		) {
			city = component.long_name;
		}
	}

	return { country, admin, city };
};
```

There is one more object that can be destructured. At the start of the `for` loop, target `const component of addressComponents` as follows:

```tsx
// ...
for (const component of addressComponents) {
	const { long_name } = component;

	if (component.types.includes(pais)) {
		country = long_name;
	}

	if (component.types.includes(administrative_area_level_1)) {
		admin = long_name;
	}

	if (
		component.types.includes(locality) ||
		component.types.includes(postal_town)
	) {
		city = long_name;
	}
}
// ...
```

Great! The newly updated parseAddress function should look as follows

```tsx
const { country, administrative_area_level_1, locality } = AddressType;
const pais = country;
const { postal_town } = GeocodingAddressComponentType;

const parseAddress = (addressComponents: AddressComponent[]) => {
	let country = null;
	let admin = null;
	let city = null;

	for (const component of addressComponents) {
		const { long_name } = component;

		if (component.types.includes(pais)) {
			country = long_name;
		}

		if (component.types.includes(administrative_area_level_1)) {
			admin = long_name;
		}

		if (
			component.types.includes(locality) ||
			component.types.includes(postal_town)
		) {
			city = long_name;
		}
	}

	return { country, admin, city };
};
```

## 5. Updating the exported Google constant

Prior to refactoring, `export const Google` should resemble the following

```tsx
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
		const res = await maps.geocode({ address }).asPromise();

		if (res.status < 200 || res.status > 299) {
			throw new Error('failed to geocode address');
		}

		return parseAddress(res.json.results[0].address_components);
	}
};
```

Neither `authUrl` or `logIn` are of interest at present, so their content will be omitted from code snippets. The `geocode` function, however, is of utmost relevance

```tsx
export const Google = {
	// ...,
	geocode: async (address: string) => {
		const res = await maps.geocode({ address }).asPromise();

		if (res.status < 200 || res.status > 299) {
			throw new Error('failed to geocode address');
		}

		return parseAddress(res.json.results[0].address_components);
	}
};
```

### A. Error handling - no API key

First, let's address error handling in the case of no API key being present. Throwing a new error seems to be the suitable approach, which is executed as follows

```tsx
export const Google = {
	// ...,
	geocode: async (address: string) => {
		if (!process.env.G_GEOCODE_KEY)
			throw new Error('Google Maps API Key missing or not found');
		const res = await maps.geocode({ address }).asPromise();

		if (res.status < 200 || res.status > 299) {
			throw new Error('failed to geocode address');
		}

		return parseAddress(res.json.results[0].address_components);
	}
};
```

### B. Configuring the API Key in the params object

This is where the API key is to be configured per method in the params object. Recall that `Client` is asynchronous in nature by default; therefore, appending `.asPromise()` is no longer necessary and can be removed. Incorporating a params object to configure the API key is executed as follows

```tsx
export const Google = {
	// ...,
	geocode: async (address: string) => {
		if (!process.env.G_GEOCODE_KEY)
			throw new Error('Google Maps API Key missing or not found');
		const res = await maps.geocode({
			params: { address, key: process.env.G_GEOCODE_KEY }
		});

		if (res.status < 200 || res.status > 299) {
			throw new Error('failed to geocode address');
		}

		return parseAddress(res.json.results[0].address_components);
	}
};
```

Passing the API Key in the params object allows for direct access into the transport-layer. The advantage of this will become apparent momentarily. Let's refactor the contents of returned `parseAddress` next.

### C. Refactoring contents of the returned Geocode Response

With the old library, a public method prompted `res.json` to be passed by the returned `parseAddress` function. With the new library and direct access to the transport-layer, `res.data` replaces `res.json`. One notable advantage of this is that only the value is sent by the server, not the key. Your updated code should look as follows:

```tsx
export const Google = {
	// ...,
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
```

Direct access to the transport-layer sure is nice.

## 7. Success

That's it! You have successfully completed the migration process. The contents of `server/src/lib/api/Google.ts` should now look as follows

```tsx
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

const { country, administrative_area_level_1, locality } = AddressType;
const pais = country;
const { postal_town } = GeocodingAddressComponentType;

const parseAddress = (addressComponents: AddressComponent[]) => {
	let country = null;
	let admin = null;
	let city = null;

	for (const component of addressComponents) {
		const { long_name } = component;

		if (component.types.includes(pais)) {
			country = long_name;
		}

		if (component.types.includes(administrative_area_level_1)) {
			admin = long_name;
		}

		if (
			component.types.includes(locality) ||
			component.types.includes(postal_town)
		) {
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
```

Thanks for following along! Please feel free to comment below or message me directly with any questions, comments, or concerns.

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/dk733wzdwg4xst6qq1m7.gif)
