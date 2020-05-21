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