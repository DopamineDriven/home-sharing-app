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
- Wrapping a type in [] signifies a List
- myField: [String!]
    - myField: null // valid
    - myField: [] // valid
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