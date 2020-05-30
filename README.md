# home-sharing-app
GraphQL, Apollo, Typescript, Node, React, MongoDB Atlas, Stripe, Cloudinary, Google OAuth and Geocode API

typescript settings.json 
https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

## GraphQL
- query language for APIs
- v3 -- traditional REST (representational state transfer) API
    - https://developer.github.com/v3/
    - exploring traditional REST API
        - https://api.github.com/
        - https://api.github.com/repos/octocat/Hello-World
    - not as clear cut or concise
        - returns a lot of unnecessary info
            - https://api.github.com/repos/octocat/Hello-World/issues/348/comments
- v4 -- GraphQL API
    - https://developer.github.com/v4/
    - exploring GraphQL API
        - https://developer.github.com/v4/explorer
        - interactive environment

### GraphQL Concepts
- https://graphql.org/learn/schema/
- Query and Mutation represent the entry point of every GraphQL query
------------------------------------------
#### Schema Object Types
- type Character {
    name: String!
    appearsIn: [Episode!]!
}

------------------------------------------
- Character
    - Object Type: type with some fields
- name and appearsIn
    - fields on the Character object type
    - only two fields that can appear in any part of a GraphQL query operating on the Character type
- String
    - built-in scalar type
        - resolve to a single scalar object
        - can't have sub-selections in the query
- String!
    - indicates that the field is non-nullable
        - non-nullable fields always return a value when queried
- [Episode!]!
    - represents an array of Episode objects
        - non-nullable--an array with 0 or more items will always be returned when queried
    - Episode! string is also non-nullable
        - can expect every item of the arr to be an episode object

#### Arguments
------------------------------------------
- type Starship {
    id: ID!
    name: String!
    length(unit: LengthUnit = METER): Float
}

------------------------------------------
- every field on GraphQL obj type can have zero or more args
    - consider the length field above
- All args are named and passed by name specifically
    - length field has one defined argument; unit
- Args can be required or optional
    - optional ? default val : !default val

#### Scalar types
- Scalar types cannot have sub-selections
    - Think Newtonian mechanics; unidimensional quantity
- Default scalar types out of the box
    - Int: signed 32-bit integer (2^32)
    - Float: signed double-precision floating-point value
    - String: UTF-8 character sequence
    - Boolean: T v F
    - ID: unique identifier
        - often used to refetch an object or as the key for a cache
        - serialized in the same way as a string
        - however, defining it as an ID signifies that it is not intended to be human-readable unlike a string
    - Custom scalar type specification
        - Consider a Date type:
            - scalar Date
        - Implementation determines how this type should be serialized, deserialized, and validated

#### Enum (enumeration) Types
- Special type of scalar restricted to set of allowed values
    - (1) Validate any args of this type are one of the predetermined vals
    - (2) Communicate through type system that a field will be one of a finite set of vals
------------------------------------------
enum Episode {
    NEWHOPE
    EMPIRE
    JEDI
}

------------------------------------------
- Three predefined vals for Episode type
    - JS doesn't have enum support, so vals might be internally mapped to a set of integers for example

#### Types that can be defined in GraphQL
- Object Types
- Scalar Types
- Enumeration Types (Enum)

#### Lists and Non-Null
- Type-modifiers
    - affect validation of types
- Adding an ! in front of a string -> String! -> non-nullable
- Wrapping a type in [ ] signifies a List
- myField: [String!]
    - myField: null // valid
    - myField: [ ] // valid
    - myField: ['a', 'b'] // valid
    - myField: ['a', null, 'b'] // error
        - the list itself can be null, but cannot contain null strings
        - however, [String]! -> list itself cannot be null, but it can contain null values (strings)

#### Input Types (and an interface example)
- input CreateListingInput
    - id: ID!
    - title: String!
    - address: String!
    - price: Int!

- keyword input instead of type
- cannot have args on their fields

#### Interfaces
- an abstract type that includes a certain set of fields that a type must include to implement the interface
- interface Character {
    - id: ID!
    - name: String!
    - friends: [Character]
    - appearsIn: [Episode]!
}
- type Human implements Character {
    - id: ID!
    - name: String!
    - friends: [Character]
    - appearsIn: [Episode]!
    - starships: [Starship]
    - totalCredits: Int
}
- type Droid implements Character {
    - id: ID!
    - name: String!
    - friends: [Character]
    - appearsIn: [Episode]!
    - starships: [Starship]
    - primaryFunction: String
}

- Both Human and Droid types have all the fields from the Character interface as well as one or more extra fields
- consider the following
- query HeroForEpisode($ep: Episode!) {
    - hero(episode: $ep) {
        - name
        - primaryFunction
    }
}
---Variables---
{
    "ep": "JEDI"
}

- this query produces an error because primaryFunction doesn't exist on the character interface
- must use an inline-fragment for as for a field on a specific object type not part of predefined interface
- so for primaryFunction
...
- name
- ... on Droid {
    - primaryFunction
}
...

- Union types are also a feature 
    - union result = a|b|c -> (a, b, or c)
    - must be concrete object types

#### Resolver Args
- (1) obj - object returned from parent resolver
- (2) args - arguments provided to the field
- (3) context - val provided to every resolver
- (4) info - info about the execution state of the query


## Apollo Server Package
- https://www.apollographql.com/docs/apollo-server/


### GraphQL Resolvers
- have access to up to four positional args
    - if an arg is unused prefix with underscore (_root)

### Apollo-Server-Express Package
- allows for creating schema with the easier GraphQL schema Language

### GQL Tag -- Function returning a parsed template literal
- Installed GraphQL extension for syntax support
- gql tag parses the string created into a GraphQL Abstract Syntax Tree
    - Apollo Server requires its use to wrap the schema
- Note
    - gql is a function that takes a string as an argument
    - string arg must be constructed with template literals
        - ES6 feature known as "tagged template literals"
- Takeaway
    - gql is a tag(function) where the argument is derived from
    - the template literal applied alongisde it
        - takes the string -> returns a GraphQL Tree

### Resolvers
- resolvers object returns a map
    - map relates schema fields to functions that resolve that field

### IResolvers Interface
- IResolvers interface imported from apollo-server-express
    - can type define resolvers map in this way (resolvers: IResolvers)
- Provides support for enforcing resolvers map object
    - map obj can only contain resolver fields or resolver functions
    - for example, introducing a field with a string val would generate a warning
- A TypeScript generic that allows for defining types of obj and context arguments in resolver functions by passing in type variables
    - IResolvers< TSource, TContext >
    - This makes for reusable code templates
    - However, explicitly defined the types of parameters in each resolver function in this case


--------------------------------------------------------------------------------

## MongoDB
- utilizing MongoDB Atlas for DBaaS
- ObjectId(hexadecimal)
    - 12-byte ObjectId value consists of:
        - 4-byte Unix-epoch timestamp value denoting creation time
        - 5-byte random value
        - 3-byte incrementing counter, initialized to a random value

### NoSQL 
- dynamic schema (or no schema at all) for unstructured data
    - can be stored in many ways (document oriented for example)
    - flexibility -> can change data structure as app evolves
        - with great power comes great responsibility
        - additional checks needed to ensure app logic can handle data of varying structures

--------------------------------------------------------------------------------

## TypeScript Generics 
- Creating a generic TypeScript function
    - const fn = < T >(arg: T): T => arg
- Confer ability to abstract type vals allowing functions and vars to work with a range of different types
- Create Reusable components that can work with a variety of types
    - Abstraction of types used in functions or variables
- see server/src/lib/types.ts for extensive commenting on generics

--------------------------------------------------------------------------------

## Seeding Mock Data to MongoDB Atlas
- seed.ts is located outside of the rootDir/
    - why?
    - it is only used in development
- Therefore, TS should not compile it to valid JS
    - this requires updating the tsconfig.json file
        - use the "exclude" option

## Modularizing Resolvers
- consider a resolvers map pertaining to the listings domain (module)
    - map will encompass all the resolvers pertaining to this domain
        - listings query, deleteListing mutation, id resolver field for the Listing object, etc.
- enter lodash https://lodash.com/
    - using lodash.merge https://www.npmjs.com/package/lodash.merge
    - npm package to support the merging of multiple resolver maps into a single object
- could do the same for typeDefs if necessary
    - not necessary in this particular app
    - https://www.apollographql.com/docs/graphql-tools/generate-schema/#extending-types
    - Why?
        - Schema file doesn't get large enough that it is difficult to manage
        - Easier to see all typeDefs in a single file
        - Can modularize if desired


--------------------------------------------------------------------------------

## CRA TypeScript
- navigate to root of app
- npx create-react-app client --template typescript
- triple-slash directive (///) in src/react-app-env.d.ts
    - unique TS capability pertaining to single line comments
    - these comments contain a single XML tag
    - /// -> instructs TS compiler to include additional files in compilation process

## Querying Listings
- Invoke a POST or GET HTTP method 
    - use POST to persist or retrieve http data
- Specify contetn of req as application/json
    - GraphQL docs passed as JSON
- Reference URL of GraphQL endpoint
- utilize fetch
    - native browser method to make HTTP reqs


--------------------------------------------------------------------------------

## React Hooks References
- React Today and Tomorrow | React Conf 2018
    - https://www.youtube.com/watch?v=dpw9EHDh2bM
- React Hooks API Reference
    - https://reactjs.org/docs/hooks-reference.html
- Rules of Hooks
    - https://reactjs.org/docs/hooks-rules.html
- Complete Guide to useEffect
    - https://overreacted.io/a-complete-guide-to-useeffect/

## React Hooks 
- Dan Abramov does not recommend using the Container vs Presentational component pattern split any longer
    - why? enter React Hooks 

## useReducer
- behaves very similarly to Redux
- takes a reducer() function that receives current state and an action
    - then returns a new state
- useReducer returns an array of two values and can take three args
    - first arg -> reducer() -> function
    - second arg -> initialArg -> initial state
    - third arg (optional) -> init -> initialization function responsible for initializing state 
- const [state, dispatch] = useReducer(reducer, initialArg, init);
    - reducer receives current state and an action that returns the new state
        - const reducer = (state, action) => {};
    - switch statement often used to determine the return value of state based on the action received 
        - const reducer = (state, action) => {
            switch (action.type) {}
        };
    - see client/src/lib/api/useQuery.ts for more
    - https://reactjs.org/docs/hooks-reference.html#usereducer
- useReducer is more preferable for complex state objects with multiple sub-variables
    - Why?
        - Due to the decoupling of updates that happen to state from actions themselves
- disadvantage of useReducer is it requires more boilerplate and understanding than useState
- overall, if handling complex state objects with multiple sub-values, useReducer >>> useState


--------------------------------------------------------------------------------


## Apollo Client
- Intelligent caching, perform data-fetching, etc
- React Apollo - React's implementation of Apollo Client
- Apollo Boost (simple) vs Apollo Custom (advanced)
    - https://www.apollographql.com/docs/react/migrating/boost-migration/#before (simple)
    - https://www.apollographql.com/docs/react/migrating/boost-migration/#after (advanced)

### Apollo Boost
- pre-built config for caching, state management, and error handling
    - npm i apollo-boost @apollo/react-hooks graphql
        - apollo boost and react apollo are TS libraries
    - must also install TS graphql
        - npm i @types/graphql --save
- import apollo-boost in index.tsx as ApolloClient
    - specify GraphQL API endpoint in ApolloClient constructor as uri
- then import Apollo Provider from @apollo/react-hooks in index.tsx
    - wrap root of app in ApolloProvider and pass the client constructor prop expected by the provider

### Discard lib/api/content
- useQuery, useMutation, server data fetching, and index files all discarded since apollo client hooks replaces them
    - see tinyhouse-code locally for preserved discarded folders/files

## Apollo CLI
- schema validation, server compatibility checks, ability to generate static types
    - employ official Apollo CLI to generate static types from GraphQL API
- can install apollo tooling globally or as an application dependency
    - can also set up scripts in package.json and run the apollo tooling commands with the npx command
- Two commands necessary to run to generate static types from schema
    - (1) download GraphQL schema and save it in project
    - (2) can then generate static types of requests from schema
        - codegen:schema && codegen:generate
            - https://github.com/apollographql/apollo-tooling

### codegen:schema
- "codegen:schema": "npx apollo client:download-schema --endpoint=http://localhost:9001/api"
- then: npm run codegen:schema
    - this returns: Loading Apollo Project, Saving schema to schema.json
        - schema.json file generated in client dir representing entire graphql schema
- now, generate static types for application query and mutation

### codegen:generate
- "codegen:generate": "npx apollo client:codegen --localSchemaFile=schema.json --includes=src/**/*.tsx --target=typescript"
- then: npm run codegen:generate
    - this returns: Loading Apollo Project, Generating query files with 'typescript' target - wrote 3 files
        - https://gulpjs.com/docs/en/getting-started/explaining-globs/
- global types file created in root of project dir as well
    - keeps reference of all enum and input object types that can exist in graphql api
        - since none exist currently, this file is empty at the moment
        - note: can delete if desired


--------------------------------------------------------------------------------

## Ant Design
- ~/home-sharing-app/client $ npm i antd
- antd library built with TS
    - https://ant.design/docs/react/introduce
- lists
    - https://ant.design/components/list/

### Ant Design Skeleton Component
- https://ant.design/components/skeleton/
- Use case
    - placeholder while waiting for content to load and/or to visualize content that is yet to exist
- customize themes
    - https://ant.design/docs/react/customize-theme

--------------------------------------------------------------------------------

## Browser Router vs Hash Router
- Browser Router
    - preferred for CS routed applications 
    - URL paths do not have a hash # symbol
- Hash Router
    - sets URLs in hash mode
    - URLs always contain a hash symbol # after the hostname
        - https://home-sharing-app.app/#/host (for example)
    - Benefits?
        - multiple CS routes without having to provide necessary SS fallbacks
        - Why?
            - everything after # is never sent to the server

--------------------------------------------------------------------------------

## User interface
- _id: string as opposed to _id: ObjectId
    - Why?
        - Google OAuth returns a string value to identify a user
    - bookings and listings remain -> _id: ObjectId 


## OAuth2.0 Roles
- Resource Owner
    - the user that signs in -> grants app access to google account
- App
    - once user grants access to account
        - can make API calls to Google servers on behalf of user
        - add an item to their google calendar, send an email, etc
- Authorization and Resource Server
    - Google server that holds the data and provides the APIs

## Login steps
- click sign-in with google button
    - redirect to google authentication page to login
- user provides account info
    - google handles authentication, session selection, and user consent
- once logged in, google returns authorization code
    - CS passes authorization code to SS
- once server receives authorization code another request is made
    - server sends authorization code to fetch user's access token
- with user access token obtained
    - can use token to interact with Google APIs on behalf of user
    - specifically, Google's People API to get name, email, and profile image
        - https://developers.google.com/people
    - Sequence diagram (UML sequence diagram)
        - https://developers.google.com/identity/protocols/oauth2

### Google APIs and Node.js Client
- https://github.com/googleapis/google-api-nodejs-client

### Google OAuth2.0 Scopes
- https://developers.google.com/identity/protocols/oauth2/scopes

### Method People API
- https://developers.google.com/people/api/rest/v1/people/get

## Viewer GraphQL Object Type
- Object representative of user (viewer) contains the following fields
    - id: ID -> unique identifier
    - token: String -> unique token to counteract CSRF attacks
    - avatar: String -> viewer's avatar image
    - hasWallet: Boolean -> connection to stripe payment processor
    - didRequest: Boolean! -> value indicating if a req is made from client to obtain viewer info (non-optional, denoted by !)

## Using Ant Design framework for the Login Page
- Layout, Card, and Typography components
    - Layout
        - https://ant.design/components/layout/
    - Card
        - https://ant.design/components/card/
    - Typography
        - https://ant.design/components/typography/

## React Router
- React Router Hooks (>=16.8)
    - https://reacttraining.com/react-router/web/api/Hooks

## Viewer Interface
- import Viewer interface to root file from client/src/lib/types.ts
- useState hook to create viewer state obj that child components of App can access and use
- Initialize viewer state obj with all null values except didRequest: false
- useState Hook -> destructure setViewer() func used to update the viewer state object
- Why pass the setViewer function to the Login component?
    - so that the client viewer object can be updated after the logIn mutation runs 
- Utilize React Router's render props pattern to pass in setViewer() func
    - https://reactjs.org/docs/render-props.html
- Then, a props interface is established in Login.tsx
    - interface Props {setViewer: (viewer: Viewer) => void;}
    - export const Login = ({ setViewer }: Props) => {...};


## Manual Query of AuthURL -> Login.tsx
- Queries
    - https://www.apollographql.com/docs/react/data/queries/
- useQuery hook from React Apollo runs a query upon component mount
    - https://www.apollographql.com/docs/react/api/react-hooks/#usequery
    - Yet, that is not desirable here
    - Instead, have authUrl query fired onClick(e) of Sign in with Google button
    - Two options provided by React Apollo to incorporate authUrl onClick(e)
        - (1) use the useLazyQuery Hook
            - https://www.apollographql.com/docs/react/api/react-hooks/#uselazyquery
        - (2) Run query() func from the client obj obtained from useApolloClient Hook
            - https://www.apollographql.com/docs/react/api/react-hooks/#useapolloclient
        - That said, the useQuery and useLazyQuery hooks leverage and use the client object which can be accessed directly from the useApolloClient Hook
            - Decision -> useApolloClientHook (from @apollo/react-hooks) to get client object

## useApolloClient Hook -> Login.tsx
- import { useApolloClient } from "@apollo/react-hooks";
- declare before return within Login func
    - const client = useApolloClient();
- Why use this approach?
    - client object gives access to a query() func
    - this allows the authUrl query to be ran manually
- handleAuthorize() component func -> click listener
    - fires when user clicks the login button
    - use client obj from useApolloClient hook to request the authUrl query
    - first, import authUrl query doc from "../../lib/graphql/queries";
        - { AUTH_URL }
    - also import corresponding typeDefs for authUrl query data
        - { AuthUrl as AuthUrlData } ".../AuthUrl/__generated __/AuthUrl";
    - see ./client/src/sections/Login/Login.tsx for more

## AppHeader Component
- serves as app navbar
- Layout in ant design -> Header, Sider, Content, Footer, and Layout
    - Header serves as navbar
- Affix from ant design used in index.jsx (root)
    - Affix component wraps AppHeader and keeps it at the top of page
        - specify offsetTop={0} option to achieve this

--------------------------------------------------------------------------------

## Cookies 🍪
- HttpOnly Flag
    - not accessible with JS and are therefore immune to XSS attacks
- Secure Flag
    - ensure cookies can only be sent securely through HTTPS

### Generate a random secret
- open the terminal, type "node", hit enter
- next, input the following:
    - require('crypto').randomBytes(64).toString('hex')
        - hit enter
    - this returns a 122-character hexadecimal string

## X-CSRF Token
- client passes token with every request
    - server receives token as part of req header ("X-CSRF-TOKEN") to pass to authorize() func
- server uses token to verify identity of the request
    - aka, verify that the req is coming from the authenticated viewer
- authorize() func -> ./server/src/lib/utils/index.ts
- authorize() func is to be used when accessing sensitive user data
    - for example, viewer income
    - accesses users collection to return a user that matches cookie and token of logged-in viewer
- pass request option to ApolloClient in ./client/src/index.tsx
    - https://www.apollographql.com/docs/react/get-started/#configuration-options
    - (operation: Opertaion) => Promise < void >
    - function called with each request
        - takes a GraphQL operation and can return a promise
    - Dynamically set fetchOptions -> add to context of operation with
        - operation.setContext({ headers })
        - any options sit therein take precedence over fetchOptions
        - Very useful for authentication
    - token is part of the viewer state obj -> set after user signed in
        - apolloclient config is unaware of the viewer state obj
            - why? it is created/defined server side
        - solution: set token to client's sessionStorage
            - retrieve token in apolloclient function from sessionStorage
                - token ? pass as part of header : pass empty string ""
    - Why is sessionStorage an ideal storage mechanism for this use-case?
        - data in sessionStorage is not automatically passed to server unlike cookie data
        - Okay, so what?
            - want token to be part of the request header as another alternative form verification step
        - Ah, okay. Now what?
            - set the token in sessStorage on user log-in
            - remove the token from sessStorage when user logs-out
            - this occurs in onCompleted callback of useMutation hook
        - Then navigate to ./client/src/sections/Login/Login.tsx
            - set "token" to session storage in onCompleted callback of useMutation hook here as well 
        - Now-> ./client/src/sections/AppHeader/components/MenuItems/index.tsx
            - remove token data from sessionStorage on logout
            - update onCompleted cb of logOut mutation in MenuItems component

--------------------------------------------------------------------------------


## User Resolvers
- client must query & resolve user data from server
    - utilize gql fields for a single root-level user query (one at a time)
    - caveat -> only send sensitive info (income) upon user request
- add user: String! to type Query -> ./server/src/graphql/typeDefs.ts
- User isn't directly related to concept of viewer...
    - Now what?
        - create new resolvers map to contain resolver func w/in user module
    - cd server/src/graphql/resolvers &&mkdir User &&cd User &&touch index.ts
        - import { IResolvers } from "apollo-server-express";
        - export userResolvers map and assign its type w/ IResolvers interface
            - export const userResolvers: IResolvers = { Query: { user: () => { return "Query.user" } } };
    - cd .. -> move up to resolvers dir, open index.ts
        - import { userResolvers } from "./User"
        - place userResolvers map in lodash merge() func with viewerResolvers

## GQL User obj type as compared to User TS interface
- GQL obj type ->
    - id field (instead of _id)
    - no token field
    - hasWallet boolean field (instead of walletId field)
        - note: walletId will be actual ID from stripe stored in database
            - this is sensitive info -> GQL only needs to know true or false
    - bookings field returns array of Booking objects (instead of Booking ids)
    - listings field returns array of Listings objects (instead of Listings ids)


## Creating User obj type in typeDefs
- ./server/src/graphql/typeDefs.ts
- create User object type
    - type User {
        - id: ID!
        - name: String!
        - contact: String!
        - hasWallet: Boolean!
        - income: Int
        - bookings(limit: Int!, page: Int!): Bookings
        - listings(limit: Int!, page: Int!): Listings!
    - }
- arr of Listings objects must be present whereas Bookings objects -> optional
- income and bookings only queried to resolved values when user explicitly requests this (sensitive) information
    - would not want another person to query for a certain user and know the bookings they have made
- Handling income & bookings fields
    - check viewer id making the req
    - viewer id = queried user id ? return intended values : return null

## bookings & listings - paginated fields
- Pagination -- process of fractionating bulk data into constituent pages
    - resolver functions handle pagination in server
    - client will pass two arguments to these fields -> limit and page
        - limit -- dictates data limit queried for single page
        - page -- references constituent page being queried
- above User object type, create Bookings and Listings object types
    - each object type will contain two fields each
    - type Bookings {
        - total: Int!
        - result: [Booking!]!
    - }

    - type Listings {
        - total: Int!
        - result: [Listing!]!
    - }

    - type User {
        - ...
    - }
- see ./server/src/graphql/typeDefs.ts for more

### Pagination - useful links
- https://graphql.org/learn/pagination/
- https://www.apollographql.com/docs/react/data/pagination/


## Building User Resolvers
- expect id (not _id) to be passed into user() resolver function
    - this is defined in a types.ts file adjacent to index.ts with user resolver
    - UserArgs interface defines the shape of the args for user resolver
        - contains an id of type string
    - when userResolvers func complete -> resolves to a Promise of a User
- user field -> entry point from client -> user resolver func() executed first when viewer attempts to query user field
    - other resolver funcs that user obj depends on are run thereafter
    - How to determine whether a user is authorized to make the query?
        - introduce new field in User TS interface (src/lib/types.ts)
        - add beneath listings field within User interface
            - authorized?: boolean;
        - this field is unique since it is not a part of the user doc stored in db collection
        - used only in resolver functions to determine whether user has the authorization to resolve certain fields
            - compare id of viewer making req with id of user being queried
            - but how to get info about viewer making req?
                - utilize authorize() func
                    - accepts db and req objs as params -> returns viewer obj based on cookie and token of req being made


## Pagination
- Pagination -- process of fractionating bulk data into constituent components 
    - limits imposed dictate amount of data to be displayed per page
- Three types of pagination 
    - numbered pagination (offset-based)
    - sequential pagination
    - scroll-based pagination (infinite scroll)
- Bottom Line
    - Used to reduce Latency since a full data dump is not necessary (bite-sized pieces)
- Offset-Based Pagination
    - often easiest to implement
    - backend retrieves limit and page values 
        - dictates limit of content displayed per page
    - Disadvantages
        - item insertion or removal while a user is going through the pages
            - creates a large chance of seeing the same item twice or skipping an additional item
            - Why? Concept of Boundaries between data within pages and limits
        - example: an item is added to beginning of list a user is already paginating through
            - user might see item on one page and then again on the next as it could potentially satisfy both boundaries
    - Takeaway
        - offset-based pagination may not be ideal for apps where users find themselves scrolling through pages fairly quickly especially if items are added or deleted often
            - such as a social media app
- Cursor-Based Pagination
    - Uses a "cursor" to keep track of data within a set of items
    - cursor could just reference the id of the last obj fetched
        - could also have a reference to encoded sorting criteria
    - client POV: cursor passed in and server determines set of data returned
    - heightened accuracy avoids aforementioned disadvantages of offset-based approach
- Relay Cursor-Based Pagination
    - takes the cursor-model but also returns data in a more particular format
    - Data returned with Edges and Nodes
        - Additional data such as pageInfo may also be returned
            - has reference to when cursor has an end 
            - whether previous or next page info exists
    - Advantageous if building a large app that will ahve a large number of pages with moderate user traffic

### Offset-Based Pagination Example
- P = page=1; L = limit=10; cursor starts at doc [0]
    - `(P-1)L = (1-1)10 = [0]`
- P = page=2; L = limit=10; cursor starts at doc [10]
    - `(P-1)L = (2-1)10 = [10]`
- P = page=3; L = limit=10; cursor starts at doc [20]
    - `(P-1)L = (3-1)10 = [20]`

## Apollo Client Cache
- Apollo Client (Apollo-Boost) has out of the box in-memory intelligent caching requiring zero configuration
    - caches recently viewed data in soft cache (like LRUcache)
    - https://www.apollographql.com/docs/react/why-apollo/#zero-config-caching
- Bonus
    - Apollo-boost also allows directly updating info in the cache when needed
    - https://www.apollographql.com/docs/react/caching/cache-configuration/


--------------------------------------------------------------------------------

## Listing Query and Resolvers
- Listing Authorize ()
    - bookings field within listing obj only authorized if viewer._id === listing.host (listing.host === user._id)
- First and foremost, update Listing TS interface in src/lib/types.ts
- export interface Listing {
    - ///
    - authorized?: boolean;
- }


--------------------------------------------------------------------------------

## Google Geocoding API
- GaRGaaS (Geocoding and Reverse Geocoding as a Service)

### Geocoding
- the process of converting addresses into geo coords (latitude and longitude)
- can place markers on a map or position the map

### Reverse Geocoding
- process of converting geo coords into a human-readable address

## Geocoding response overview
```json
{
    "results": [
        { 
            "address_components":[{...}],
            "formatted_address":"", 
            "geometry":{...}, 
            "location_type":"", 
            "viewport": {...}, 
            "place_id":"", 
            "plus_code":{...}, 
            "types":[...] 
        }
    ], 
    "status": ""
}
```

## Geocoding in this app
- https://docs.mongodb.com/manual/reference/method/js-cursor/
```ts
let cursor = await db.listings.find({
    country: "Canada",
    admin: "Ontario",
    city: "Toronto"
});
```
- https://developers.google.com/maps/documentation/geocoding/intro#Types
- recommended to migrate to https://github.com/googlemaps/google-maps-services-js
    - types supported
    - as opposed to @google/maps and @types/google__maps

### What is a higher order component?
- A function that accepts a component and returns a new modified component
- similar to how a thunk is a function that accepts a function and returns a new modified function 
    - https://stackoverflow.com/questions/45145221/in-simple-terms-whats-the-difference-between-a-thunk-and-a-higher-order-functi
- Cross-comparisons aside, ./client/src/sections/AppHeader/index.tsx utilizes the withRouter higher order component
    - this allows the component to be wrapped with the Router which enables the use of the global history object as a prop 


## Index Location-Based Data with MongoDB
- https://docs.mongodb.com/manual/indexes/#id2
- Goal: create a compound index for listings to support effecient execution of queries for this collection 
- Why are Indexes important?
    - Without them, Mongo must perform a collection scan for each query
    - Indexes reduce the number of documents it must inspect
- Indexes use a B-tree data structure 
    - Self-balancing data structures
    - Maintain sorted data and allow searches, sequential access, insertions, and deletions in logarithmic time O(logn)
    - collection scans sans indexes run in linear time O(n)
    - https://towardsdatascience.com/linear-time-vs-logarithmic-time-big-o-notation-6ef4227051fb
```ts
db.users.find({ score: { "$lt": 30 } }).sort({ score: -1 })
{ score: 1 } index
// where $lt -> less than
```
- the above index queries all scores less than 30 (0 < scores < 30) which mongo creates a data structure for all value of score field for all docs in collection meeting specified parameters
    - then, it performs a logarithmic search to get all documents rapidly 
    - mongoDB defines indexes at the collection level and supports indexes on any field or sub-field in the documents of a collection
    - MongoDB automatically creates a unique index on the _id field during collection creation
        - _id -> unique; rejects duplicate values for this field 
            - prevents clients from inserting two documents with same particular _id value for this particular field
        - alternative index types: geospatial, text, etc. 

### Compound Indexes
- https://docs.mongodb.com/manual/core/index-compound/
- https://docs.mongodb.com/manual/core/index-compound/#compound-index-prefix
- MongoDB supports the creation of indexes on multiple fields
```ts
db.collection.createIndex({ <field1>: <type>, <field2>: <type>, ... })
```
- order of fields listed in compound index has significance
```ts
{ userid: 1, score: -1 } Index
```
- consider the above
    - Index first sorts by userid
    - then, within each userid value, it sorts further by score
```ts
let cursor = await db.listings.find({
    country: "Canada",
    admin: "Ontario",
    city: "Toronto"
});
```
- currently, mongo will conduct a collection scan in linear time when this collection is queried 
    - not a huge issue until app/data scales rapidly
    - so, hypothetically would want to implement a compound index scan for country -> admin -> city
```ts
let index = await db.collection.createIndex({ 
    country: <string>, 
    admin: <string>,
    city: <string>
});
```
- using MongoDB Atlas interface to implement index 
- https://docs.mongodb.com/manual/applications/indexes/
```json
{
    "country": 1,
    "admin": 1,
    "city": 1
}
```
- prepares in ascending alphabetical order

--------------------------------------------------------------------------------


## Stripe
- used to facilitate payments between tenants and hosts
- https://stripe.com/docs/connect/standard-accounts
- Tenant -> Transaction -> Host
    - App takes approx 5% of Transaction amount as revenue
    - Known as the "Platform Fee"
- Millions of companies in >135 countries utilize Stripe
    - amazon, Google, salesforce, Microsoft, lyft, Uber, Spotify, Nasdaq, Zillow, slack...
- HQ -> San Francisco

### Building a Payment Infrastructure
- Payments by debit card
- Payments by credit card
- International payments 
- Payments by cryptocurrency (TBD)

### The potential of the online economy
- https://stripe.com/about
    - Despite internet businesses growing faster than the rest of the economy, only ~3% of global commerce happens online today
    - Regulatory complexity, a byzantine global financial system, and a shortage of engineers are constraining the impact of the internet economy
    - Removing the barriers to online commerce helps more businesses get started, expedites growth for existing companies, and increases economic output and trade globally

## Stripe Plans
- https://stripe.com/pricing
- Integrated vs Customized
    - Integrated
        - Pay-as-you-go pricing
        - 2.9% + $0.30
    - Customized
        - Organizations/large payment volume
        - custom package
    - extra for customizations (local payment options, international payment options)

## Enter Stripe Connect
- Payments for platforms and marketplaces 
    - Accept payments and get sellers and contractors paid in 30+ countries with a single platform
    - Use Standard Connect to add payments to platform for free
- Standard vs Custom/Express via Connect
- Standard
    - Hosted onboarding and verification
    - International support in 30+ countries
    - Full Stripe Dashboard for sellers
    - Dynamic risk-based KYC/AML checks
        - Know Your Clients/Anti-Money Laundering
    - No platform-specific fees
        - https://stripe.com/pricing#connect-pricing
- Custom/Express
    - Build branded onboarding flows
    - Platform management dashboard
    - Control payout timing and funds flow
    - Automate 1099 generation and delivery
    - Starting at 0.25% of account vol, per-account fee may apply
- Note: Stripe Radar provides Fraud protection via machine learning
    - not covered in this app but something to keep in mind 

## Routing Payments
- https://stripe.com/connect
- One-to-one
    - one customer charged and one recipient paid out
    - 1:1 relationship between charge and transfer
        - example: ride-sharing service
- One-to-many
    - one customer charged with funds split between multiple recipients
    - 1:many relationship between charge and transfer
        - example: retail marketplace hosting multiple online stores
- Many-to-many
    - multiple customers charged with funds being split out across multiple recipients
    - many:many relationship between charge and transfer
        - example: SaaS platform charging customers a monthly fee for access to fitness classes at various studios

### In this app
- one-to-one routing payment utilized
- https://stripe.com/docs/connect/accounts
- using the Standard approach 
    - consider integration effort and fraud/dispute liability implications
        - user is responsible for disputing fraud or other liabilities, not the platform
        - lowest integration effort

### Setting up Stripe Account
- Stripe allows developers to integrate stripe connect into platforms before activating business account
- That said, before accepting real payments in a production environment, one must activate stripe account and provide required credentials
    - business address, business bank account, business type, etc
- added secret key to server .env and publishable key to client .env
- Then set up redirect URI(s) and to get client ID
    - go to settings, then connect settings
        - add client ID to client .env
    - click + Add URI below client ID row
    - specify as http://localhost:3000/stripe

### Using Connect with Standard Accounts
- https://stripe.com/docs/connect/standard-accounts

### Authentication Flow
- first, on client, call to action on user profile section
    - signed in users will be prompted to connect their stripe account
    - user clicks action to connect
    - redirected to stripes login page bringing up custom screen configured in Stripe dashboard for app 
        - Login page notifies user which account they are connecting with via the client id passed in ./client from .env unique to the app 
    - user would either ask to create or login
        - since in test mode can skip
    - upon success, redirected to redirect URI specified 
        - localhost:3000/stripe
    - server gets authorization code (sent in URL on redirect) to make another request to stripe for the connected user_id
        - user_id used to act on behalf of user
        - if someone books a listing, then the host with a uniqe user_id is paid out by stripe accordingly
        - user_id = wallet_id field in database
- Mutations
    - connectStripe (see ./server/src/graphql/typeDefs)
        - uses authorization code returned on redirect URI
        - passes authorization code back to stripe to exchange for user_id -> wallet_id field
    - disconnectStripe
        - gives user ability to disconnect stripe credentials from application
        - aka, to remove wallet_id stored in database
    - two root level graphql fields necessary to handle stripe auth

### Resolver functions
- set up in .server/src/graphql/resolvers/Viewer/index.ts
- head to process.env.PORT/api (graphQL GUI) and enter the following
```ts
mutation {
  connectStripe(input: {code: "333"}) {
    didRequest
  }
}
```
- Which returns the following on success
```json
{
  "data": {
    "connectStripe": {
      "didRequest": true
    }
  }
}
```
- likewise for disconnectStripe
```ts
mutation {
  disconnectStripe {
    didRequest
  }
}
```
- returns
```json
{
  "data": {
    "disconnectStripe": {
      "didRequest": true
    }
  }
}
```

### Building the connect resolvers
- on step four (outlined here)
    - https://stripe.com/docs/connect/standard-accounts#token-request
- first class TS support provided by Stripe API lib for Node
    - details on minor changes that can be made
    - https://s3.amazonaws.com/assets-protected.fullstack.io/courses/tinyhouse-react-masterclass-part-2/module_10/lesson_10.4/protected/stripe-node-typescript.pdf?AWSAccessKeyId=AKIAINKVCFPZEA7UP6MQ&Expires=1590518893&Signature=Ouj5%2BWLNpZr54jUTQ8C%2F9ctTmVw%3D
- response obj returned from client.oauth.token() func contain a series of different fields such as
    - stripe_user_id, access_token, scope, livemode, token_type, etc
    - some use cases might want to track access_token of a user
        - to make requests on behalf of a persons account
        - to support recurring payments
    - however, for this use-case the only param desired is
        - stripe_user_id

### Configuring Stripe api connection in ./src/lib/api/Stripe.ts
- @types/stripe library no longer required
- as of v8.0 (current version 8.55), Node apps now have first class TypeScript support
- https://github.com/stripe/stripe-node#usage-with-typescript
```javascript
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
```
- code -> authorization code received from client used to make authorization request to Stripe server (see function above)
    - url passes the code as well as the scope granted back on redirect as follows
```javascript
http://localhost:3000/stripe?scope=read_write&code={AUTHORIZATION_CODE}
```
- on `return response;` above the following is included
```JSON
{
  "token_type": "bearer",
  "stripe_publishable_key": "{PUBLISHABLE_KEY}",
  "scope": "read_write",
  "livemode": false,
  "stripe_user_id": "{ACCOUNT_ID}",
  "refresh_token": "{REFRESH_TOKEN}",
  "access_token": "{ACCESS_TOKEN}"
}
```
- the stripe_user_id is of interest herein
    - stripe_user_id === wallet_id for the database 
- stripeConnect -> uses authorization code to get wallet_id
    - wallet_id value stored in database
```
    const updateRes = await db.users.findOneAndUpdate(
        { _id: viewer._id },
        { $set: { walletId: wallet.stripe_user_id } },
        { returnOriginal: false }
    );
```
- stripeDisconnect -> disconnects user (viewer) from stripe
    - wallet_id set to undefined in database
```
    const updateRes = await db.users.findOneAndUpdate(
        { _id: viewer._id },
        { $set: { walletId: undefined } },
        { returnOriginal: false }
    );
```

## Connecting with Stripe on the Client
- Step (1)
    - Create OAuth link
        - need stripe_client_id and redirect uri
```javascript
`https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_S_CLIENT_ID}&scope=read_write`
```
- Step (2)
    - User creates or connects their account
- Step (3)
    - User is redirected back to app with authorization code in URL

- Reference
    - https://stripe.com/docs/connect/standard-accounts#integrating-oauth

### Stripe - a new section component
- Imports
    - React
    - useEffect -> trigger connectStripe mutation upon first mount
    - useMutation 
        - pass in autogenerated types for connectStripe mutation
        - pass in the mutation document
        - return the mutation func as well as the data, loading, and error statuses of mutation result
    - Layout and Spin components from antd for when mutation is in flight
        - destruct Content component from parent Layout
    - ConnectStripe mutation document and its autogenerated ts defs 
- Considerations
```typescript
export const Stripe = () => {
    const [connectStripe, { data, loading, error }] = useMutation<
        ConnectStripeData,
        ConnectStripeVariables
    >(CONNECT_STRIPE);

    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get("code");

        if (code) {
            connectStripe({
                variables: {
                    input: { code }
                }
            });
        }
    }, []);
```
- using the URL constructor within useEffect, the code parameter value is extrapolated from the URL
    - once retrieved, connectStripe mutation is instantiated
    - its variables being the input value, code
- Warnings from tslint about placing the connectStripe() mutation in the useEffect dependency array since there is a risk for it to change in value
    - do not want to do that
    - Why?
        - the connectStripe func is being instantiated/created within this component 
        - if the stripe component rerenders for whatever reason, a new copy of the connectStripe() func will result
        - if connectStripe was in the dependency array, the effect would run again which is not desirable
    - Bottom Line: the connectStripe() func should only run once 
    - Solution? -> useRef
- useRef Hook -> mutable variables inside functional components
    - In a state variable -> useState or useReducer
        - updates in state vars result in rerender event
    - In a Ref -> equivalent to instance vars in class components
        - Mutating the .current property won't cause a rerender
    - Takeway: mutating .current prop does not cause a re-render
```ts
// ..

export const Stripe = () => {
    const [connectStripe, { data, loading, error }] = useMutation<
        ConnectStripeData,
        ConnectStripeVariables
    >(CONNECT_STRIPE);
    const connectStripeRef = useRef(connectStripe);

    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get("code");

        if (code) {
            connectStripeRef.current({
                variables: {
                    input: { code }
                }
            });
        }
    }, []);
    
    // ...
```
- Note: Ref.current prop should not be mutated outside of useEffect or useReducer 
- Navigate to ./client/src/sections/Stripe/index.tsx for more


### Stripe Disconnect -- Enter UserProfile.tsx
- useMutation hook to handle disconnectStripe
- onSuccess banner displayed if data && data.disconnectStripe
- onError banner displayed if unable to disconnect
- onSuccess, ensure that viewer state obj is updated to reflect (hasWallet boolean toggled from true to false)
- To pass setViewer to child component, need parent User to have it passed to it from its parent App.tsx
```ts
// .client/src/index.tsx <App/> component
// ...
<Route 
    exact path="/user/:id" 
    render={
        props => <User {...props} viewer={viewer} setViewer={setViewer} />
    }	 
/>
// ...
```
- declare setViewer prop in User section parent component
    - then pass viewer and setViewer props down to the UserProfile child component
```ts
// .client/src/sections/User/index.tsx
// ...

interface Props {
    viewer: Viewer;
    setViewer: (viewer: Viewer) => void;
}

export const User = ({ 
    viewer,
    setViewer, 
    match 
}: Props & RouteComponentProps<MatchParams>) => {
    // ...

    const userProfileElement = user ? (
        <UserProfile 
            user={user}
            viewer={viewer} 
            viewerIsUser={viewerIsUser}
            setViewer={setViewer}
        />
    ) : null;

    // ...
```
- which enables UserProfile child component to pass in the viewer and setViewer props as follows
```ts
// .client/src/sections/User/components/UserProfile/index.tsx 
// ...

import { Viewer } from "../../../../lib/types";

interface Props {
    user: UserData["user"];
    viewer: Viewer;
    viewerIsUser: boolean;
    setViewer: (viewer: Viewer) => void;
}

// ...

export const UserProfile = ({ 
    user, 
    viewer, 
    viewerIsUser, 
    setViewer 
}: Props) => {
    const [disconnectStripe, { loading }] = useMutation<DisconnectStripeData>(
        DISCONNECT_STRIPE, {
            onCompleted: data => {
                if (data && data.disconnectStripe) {
                    setViewer({ ...viewer, hasWallet: data.disconnectStripe.hasWallet });
                    displaySuccessNotification(
                        "Successfully disconnected from Stripe!",
                        "Reconnect with Stripe to continue to create or host listings."
                    );
                }
            },
            onError: () => {
                displayErrorMessage(
                    "Failed to disconnect from Stripe, please try again."
                );
            }
        }
    );

    // ...
```
- on disconnect success, the hasWallet bool value will return false

### Refetch user data after stripe disconnect
- on success of disconnectStripe mutation
    - UI of user profile should reflect the conditionally rendered elements for a hasWallet value of false
- How to achieve this? Refetch the user query in the parent User component
    - destructure refetch prop from useQuery hook
    - create async handleUserRefetch func
    - pass handleUserRefetch() down as a prop to UserProfile component
```ts
// .client/src/sections/User/index.tsx
// ...

    const { data, loading, error, refetch } = useQuery<UserData, UserVariables>(
        USER, {
            variables: {
                id: match.params.id,
                bookingsPage,
                listingsPage,
                limit: PAGE_LIMIT
            }
        }
    );

    const handleUserRefetch = async () => {
        await refetch();
    }

    // ...

    const userProfileElement = user ? (
        <UserProfile 
            user={user}
            viewer={viewer} 
            viewerIsUser={viewerIsUser}
            setViewer={setViewer}
            handleUserRefetch={handleUserRefetch}
        />
    ) : null;

// ...
```
- then declare handleUserRefetch as a prop in child UserProfile component
- in the onCompleted callback of the mutation, trigger handleUserRefetch() function
```ts
// .client/src/sections/User/components/UserProfile/index.tsx
// ...

interface Props {
    user: UserData["user"];
    viewer: Viewer;
    viewerIsUser: boolean;
    setViewer: (viewer: Viewer) => void;
    handleUserRefetch: () => void;
}

// ...

export const UserProfile = ({ 
    user, 
    viewer, 
    viewerIsUser, 
    setViewer,
    handleUserRefetch 
}: Props) => {
    const [disconnectStripe, { loading }] = useMutation<DisconnectStripeData>(
        DISCONNECT_STRIPE, {
            onCompleted: data => {
                if (data && data.disconnectStripe) {
                    setViewer({ ...viewer, hasWallet: data.disconnectStripe.hasWallet });
                    displaySuccessNotification(
                        "Successfully disconnected from Stripe!",
                        "Reconnect with Stripe to create or host listings."
                    );
                    handleUserRefetch();
                }
            },
            onError: () => {
                displayErrorMessage(
                    "Failed to disconnect from Stripe, please try again."
                );
            }
        }
    );

    // ...
```

--------------------------------------------------------------------------------

## HostListing
- Mutations
    - HostListing
    - update typeDefs
    - why does it return a Listing object type?
        - to return a newly created listing doc to the client
```ts
// ./server/src/graphql/typeDefs.ts

	type Mutation {
		logIn(input: LogInInput): Viewer!
		logOut: Viewer!
		connectStripe(input: ConnectStripeInput!): Viewer!
		disconnectStripe: Viewer!
		hostListing(input: HostListingInput!): Listing!
    }
```
- then, define HostListingInput!
```ts
// ./server/src/graphql/typeDefs.ts

	input HostListingInput {
		title: String!
		description: String!
		image: String!
		type: ListingType!
		address: String!
		price: Int!
		numOfGuests: Int!
    }
```
- Next, the TS interface type for HostListingInput argument is to be established 
- export HostListingArgs with an input of type HostListingInput
    - Shape of HostListingInput interface mirrors its typeDef GraphQL API definition
```ts
// ./server/src/graphql/resolvers/Listing/types.ts

import { Booking, Listing, ListingType } from "../../../lib/types";

// ...

export interface HostListingInput {
  title: string;
  description: string;
  image: string;
  type: ListingType;
  address: string;
  price: number;
  numOfGuests: number;
}

export interface HostListingArgs {
  input: HostListingInput;
}
```
- On to the resolver, import the newly defined types
```ts
// ./server/src/graphql/resolvers/Listing/index.ts
// ...
import { 
    ListingArgs, 
    ListingBookingsArgs, 
    ListingBookingsData,
    ListingsArgs,
    ListingsData,
    ListingsFilter,
    ListingsQuery,
    HostListingArgs,
    HostListingInput
} from "./types";
// ...
```
- server-side validation via HostListingInput in the same file
```ts
// ...
const verifyHostListingInput = ({
    title,
    description,
    type,
    price
}: HostListingInput) => {
    const { Apartment, House } = ListingType;
    if (title.length > 100) {
        throw new Error("listing title must be under 100 characters");
    }
    if (description.length > 5000) {
        throw new Error("listing description must be under 5000 characters")
    }
    if (type !== Apartment && type !== House) {
        throw new Error("listing type must be either an apartment or house");
    }
    if (price <= 0) {
        throw new Error("price must be greater than 0");
    }
};

export const listingResolvers: IResolvers = {
    // ...
```
- hostListing async, define root, input, and context with validation as first arg
```ts
    // ...
    },
    Mutation: {
        hostListing: async (
            _root: undefined,
            { input }: HostListingArgs,
            { db, req }: { db: Database; req: Request }
        ): Promise<Listing> => {
            verifyHostListingInput(input);

            //...
```
- then, authorize that viewer is logged in by passing in db and req objects from context which reference the CSRF-token in the header
- if viewer does not exist, throw an error
```ts
// ...
    Mutation: {
        hostListing: async (
            _root: undefined,
            { input }: HostListingArgs,
            { db, req }: { db: Database; req: Request }
        ): Promise<Listing> => {
            verifyHostListingInput(input);

            let viewer = await authorize(db, req);
            if (!viewer) {
                throw new Error("viewer cannot be found");
            }
        }
    },
    // ...
```
- if viewer obj does exist, get country, admin, and city info from Google geocoder as a function of the address in the input object
- execute error handling if country, admin, or city aren't found
```ts
    // ...
    Mutation: {
        hostListing: async (
            _root: undefined,
            { input }: HostListingArgs,
            { db, req }: { db: Database; req: Request }
        ): Promise<Listing> => {
            verifyHostListingInput(input);

            let viewer = await authorize(db, req);
            if (!viewer) {
                throw new Error("viewer cannot be found");
            }

            const { country, admin, city } = await Google.geocode(input.address);
            if (!country || !admin || !city) {
                throw new Error("invalid address input");
            }

        }
    },
    // ...
```
- then, use insertOne method of Node-Mongo-Driver to inset a new listing document into the collection
    - use spread operator to add fields from input obj directly
```ts
// ...
Mutation: {
        hostListing: async (
            _root: undefined,
            { input }: HostListingArgs,
            { db, req }: { db: Database; req: Request }
        ): Promise<Listing> => {
            verifyHostListingInput(input);

            let viewer = await authorize(db, req);
            if (!viewer) {
                throw new Error("viewer cannot be found");
            }

            const { country, admin, city } = await Google.geocode(input.address);
            if (!country || !admin || !city) {
                throw new Error("invalid address input");
            }

            const insertResult = await db.listings.insertOne({
                _id: new ObjectId(),
                ...input,
                bookings: [],
                bookingsIndex: {},
                country,
                admin,
                city,
                host: viewer._id
            });

        }
    },
```
- Since each document in the users collection has a listings field containing an array of listing ids representative of listings that the user has, the user doc of the viewer making the request must be updated with the newly added listing id
- What now? Access the newly inserted listing document of course
    - there are a few ways to approach this... https://stackoverflow.com/questions/40766654/node-js-mongodb-insert-one-and-return-the-newly-inserted-document/40767118
    - http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#insertOne
    - callback vs result approach
- Access first item in .ops array in the insert result
    - assign insert result to insertListing const
    - describe its shape as Listing interface
    - then run the updateOne() method from the Node-MongoDB-Driver to update targeted user collection doc
        - how? by finding the doc where the _id field matches that of the viewer_id then push the insertedListing _id into the listings field of the matching user doc
```ts
// ...
    Mutation: {
        hostListing: async (
            _root: undefined,
            { input }: HostListingArgs,
            { db, req }: { db: Database; req: Request }
        ): Promise<Listing> => {
            verifyHostListingInput(input);

            let viewer = await authorize(db, req);
            if (!viewer) {
                throw new Error("viewer cannot be found");
            }

            const { country, admin, city } = await Google.geocode(input.address);
            if (!country || !admin || !city) {
                throw new Error("invalid address input");
            }

            const insertResult = await db.listings.insertOne({
                _id: new ObjectId(),
                ...input,
                bookings: [],
                bookingsIndex: {},
                country,
                admin,
                city,
                host: viewer._id
            });

            const insertedListing: Listing = insertResult.ops[0];

            await db.users.updateOne(
                { _id: viewer._id },
                { $push: { listings: insertedListing._id } }
            );

            return insertedListing;
        }
    },
    // ...
```
- and voila, the hostListing mutation can now receive an input obj containing info about a new listing

### Building the Host UI
- see ./client/src/sections/Host/index.tsx
- https://ant.design/components/form/?locale=en-US#header
- align antd icons and span elements
    - https://stackoverflow.com/questions/48829694/in-ant-design-how-can-we-center-icon-vertically-in-row
- Form.Item, Radio, and Icons
```tsx
    <Item label="Listing Type">
        <Radio.Group>
            <Radio.Button value={APARTMENT}>
                <BankOutlined style={{ 
                    color: iconColor, 
                    display: "inline-block", 
                    verticalAlign: "middle" 
                }} />
                &nbsp;
                <span style={{ 
                    display: "inline-block", 
                    verticalAlign: "middle" 
                }}>
                    Apartment
                </span>
            </Radio.Button>
            <Radio.Button value={HOUSE}>
                <HomeOutlined style={{ 
                    color: iconColor,
                    display: "inline-block",
                    verticalAlign: "middle" 
                }} />
                &nbsp;
                <span style={{
                    display: "inline-block",
                    verticalAlign: "middle"
                }}>
                    House
                </span>
            </Radio.Button>
        </Radio.Group>
    </Item>
```

## Image Handling on the Host page
- preview image upload (avatar example)
    - https://ant.design/components/upload/#header
    - clicking the + icon opens machine's file system prompting user to select an image to upload
    - upon selection, displays a base64 encoded image preview
        - but how does it become base64 encoded?
        - source: Base64 Encoding: A visual Explanation
        - https://www.lucidchart.com/techblog/2017/10/23/base64-encoding-a-visual-explanation/
- Base64 encoded data representation
```jsx
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAALCAYAAABCm8wlAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QoPAxIb88htFgAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAACxSURBVBjTdY6xasJgGEXP/RvoonvAd8hDyD84+BZBEMSxL9GtQ8Fis7i6BkGI4DP4CA4dnQON3g6WNjb2wLd8nAsHWsR3D7JXt18kALFwz2dGmPVhJt0IcenUDVsgu91eCRZ9IOMfAnBvSCz8I3QYL0yV6zfyL+VUxKWfMJuOEFd+dE3pC1Finwj0HfGBeKGmblcFTIN4U2C4m+hZAaTrASSGox6YV7k+ARAp4gIIOH0BmuY1E5TjCIUAAAAASUVORK5CYII=">
```
### Enter Base64 encoded images
- when data needs to be stored and transferred over a medium expecting textually based data (String me along https://www.youtube.com/watch?v=vfp2HIT5SP8)
- Image for a new listing in /host page is a perfect example of this (String!)
- Disallowed: transfer listing image as an image file from client to server through GraphQL API
- Allowed: convert to base64 encoded format (string representation) of the image
```tsx
// ...
    <Item label="Image" extra="Image file type must be JPG or PNG; max size: 1MB">
        <div className="host__form-image-upload">
            <Upload 
                name="image"
                listType="picture-card"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            />
        </div>
    </Item>
// ...
```
- from the mock url
```json
// 20200528071944
// https://www.mocky.io/v2/5cc8019d300000980a055e76

{
  "name": "xxx.png",
  "status": "done",
  "url": "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  "thumbUrl": "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
}
```
- above, the action url is a mock url that serves to mimic an actual image upload request being made. This is required to preview images with antd
- Antd's Upload "action" prop fies an AJAX request the moment the image is uploaded
    - why use a mock?
    - to bypass the action via a mock HTTP response indicating to the user that the image was actually uploaded as part of a request
    - this allows the image to be previewed by the user prior to form submission since, after all, the base64 value should only be sent to the server after the entire form is submitted
- beforeUpload callback function prop
```ts
beforeUpload?: (file: RcFile, FileList: RcFile[]) => boolean | PromiseLike<void>;
```
- executed just before upload is made => boolean
    - check if image is of a valid type (JPEG or PNG)
    - check if image is under 1MB in size
- beforeImageUpload() func created beneath (outside) component function
    - why?
    - it has no need to access or affect anything within the component itself
        - it simply receives the image file from the callback function and returns a boolean following validation
    - type of the file component is the File interface available within TS
        - provides info about files and access to their content
- beforeImageUpload()
    - (1) check if file type is either jpeg or png
    - (2) check if file size is less than 1MB
        - file.size property is in bytes
        - convert to MB in binary form -> multiply file.size by (1024^(1/2))

```tsx
// ...

export const Host = () => {
   {/* ... */}
   ) : (
        <Content className="host-content">
            <Form layout="vertical">
            {/* ... */}

                <Item label="Image" extra="Image file type must be JPEG or PNG; max size: 1MB">
                    <div className="host__form-image-upload">
                        <Upload 
                            name="image"
                            listType="picture-card"
                            showUploadList={false}
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            beforeUpload={beforeImageUpload}
                        />
                    </div>
                </Item>
            
            {/* ... */}
            </Form>
        </Content>
    );
};


const beforeImageUpload = (file: File) => {
    const fileIsValidImage = file.type === "image/jpeg" || file.type === "image/png";
    // convert to MB in binary form
    const fileIsValidSize = file.size/(1024**2) < 1;

    if (!fileIsValidImage) {
        displayErrorMessage("Uploaded image must be of file type JPG or PNG");
        return false;
    }

    if (!fileIsValidSize) {
        displayErrorMessage("Uploaded image must be under 1MB in size");
        return false;
    }

    return fileIsValidImage && fileIsValidSize;
};
```
- 1 byte = 8 bits. 
- 1 kilobyte (K / Kb) = 2^10 bytes = 1,024 bytes. 
- 1 megabyte (M / MB) = 2^20 bytes = 1,048,576 bytes

### onChange() event handler prop = {handleImageUpload}
- triggered anytime a change is made
    - when image first uploaded and when upload is complete
    - (1) onChange is triggered -> handleImageUpload() func 
        - file.status===uploading
        - setImageLoading set to true
    - (2) once it is done (no longer loading)
        - pass image file to getBase64Value (a string less than 1MB in size)
        - once that value is returned, it is passed to the imageBase64Value to update state
- getBase64Value() func; created beneath (outside of) component function
    - serves as callback to update imageBase64Value state in handleImageUpload func
    - upon success state is updated
- FileReader constructor class -> obj allows the reading of content from file or blob
    - What is a "Blob"? 
        - "A file-like object of immutable, raw data. Blobs represent data that isn't necessarily in a JavaScript-native format. The File interface is based on Blob, inheriting blob functionality and expanding it to support files on the user's system." 
    - eadAsDataURL -> read contents of file or blob
    - onload -> event handler that is executed when load event fired
    - load event fired when file has been read (readAsDataURL)
    - when onload triggered, call callback func with results of filereader (base64 val) as string
    - type assertion -> as string (a bit of a hack but ehhh it's almost certain it will always be a valid string value due to the layers of validation built in)
```tsx
//...

import { UploadChangeParam } from "antd/lib/upload";
{/* ... */}

export const Host = ({ viewer }: Props) => {
    const [imageLoading, setImageLoading] = useState(false);
    const [imageBase64Value, setImageBase64Value] = useState<string | null>(null);
    console.log(imageBase64Value);

    const handleImageUpload = (info: UploadChangeParam) => {
        const { file } = info;

        if (file.status === "uploading") {
            setImageLoading(true);
            return;
        }

        if (file.status === "done" && file.originFileObj) {
            getBase64Value(file.originFileObj, imageBase64Value => {
                setImageBase64Value(imageBase64Value);
                setImageLoading(false);
            });
        }
    };

    {/* ... */}


    ) : (
        <Content className="host-content">
            <Form layout="vertical">
            {/* ... */}
            
                <Item label="Image" extra="Image file type must be JPEG or PNG; max size: 1MB">
                    <div className="host__form-image-upload">
                        <Upload 
                            name="image"
                            listType="picture-card"
                            showUploadList={false}
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            beforeUpload={beforeImageUpload}
                            onChange={handleImageUpload}
                        >
                            {imageBase64Value ? (
                                <img src={imageBase64Value} alt="Listing" />
                            ) : (
                                <div>
                                    {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div className="ant-upload-text">Upload</div>
                                </div>
                            )}
                        </Upload>
                    </div>
                </Item>

                <Item label="Price" extra="All prices in $USD/day">
                    <InputNumber min={1} placeholder="180" />
                </Item>
            </Form>
        </Content>
    );
};

{/* ... */}


const getBase64Value = (
    img: File | Blob,
    callback: (imageBase64Value: string) => void
) => {
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = () => {
        callback(reader.result as string);
    };
};
```
- to continue following the exciting development of this function, see 
```tsx
./client/src/sections/Host/index.tsx
```



## Form.Create() - Ant Design Pro - deprecated to void in v4
- From https://pro.ant.design/docs/uset-typescript documentation
- Form contains a func acting as a HOF (higher order func)
    - enables the production of another component
    - form data obj is avaialable in the resultant component
- reference this for v4 (used in this app)
    - https://ant.design/components/form/v3
```tsx
<Item 
    label="Listing Type"
    name="type"
    rules={[
        { 
            required: true,
            message: "Please select a listing type"
        }
    ]}
>
    <Radio.Group>
        <Radio.Button value={APARTMENT}>
            <BankOutlined style={{ 
                color: iconColor, 
                display: "inline-block", 
                verticalAlign: "middle" 
            }} />
            &nbsp;
            <span style={{ 
                display: "inline-block", 
                verticalAlign: "middle" 
            }}>
                Apartment
            </span>
        </Radio.Button>
        <Radio.Button value={HOUSE}>
            <HomeOutlined style={{ 
                color: iconColor,
                display: "inline-block",
                verticalAlign: "middle" 
            }} />
            &nbsp;
            <span style={{
                display: "inline-block",
                verticalAlign: "middle"
            }}>
                House
            </span>
        </Radio.Button>
    </Radio.Group>
</Item>
```
- additional v4 migration sources
    - https://medium.com/ant-design/ant-design-4-0-is-out-dd13be64c265
    - https://ant.design/components/form/v3
    - https://pro.ant.design/docs/uset-typescript


--------------------------------------------------------------------------------

## Cloud-based image management service
- Base64 encoded images no longer required to be stored in database
- Makes app more responsive as querying large amounts of image data no longer necessary
- decreases database size
- saves money
- URL-based api

## Cloudinary
- free plan
    - around 25mb image/video storage available
- Upload API reference documentation
    - https://cloudinary.com/documentation/image_upload_api_reference#upload_method