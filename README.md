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
- https://graphql.org/learn/schema/

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



