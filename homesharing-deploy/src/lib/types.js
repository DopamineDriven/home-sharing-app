"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingType = void 0;
var ListingType;
(function (ListingType) {
    ListingType["Apartment"] = "APARTMENT";
    ListingType["House"] = "HOUSE";
})(ListingType = exports.ListingType || (exports.ListingType = {}));
// <Listing> is type parameter of collection interface
/*
- Generics is a tool that allows for the creation of reusable components
    - abstract types used in functions or vars
- can use union types to make return type one of many
- using the any keyword is not ideal
    - does not imply what function will return

*/
/*
const identity = <T>(arg: number | string): number | string => {
    return arg
};

identity(5); // allowed
identity("5"); // also allowed via union
*/
/*
- use angle brackets syntax - <> - to pass type variables (aka a type param or arg)
    - the type argument is available in the function as well
    - whatever Type var passed will be the type of the argument and return type of the function

const identity = <T>(arg: T): T => {
    return arg
};

identity<number>(5); // arg type and return type -> number
identity<string>("5"); // arg type and return type -> string
identity<object>({ fresh: "kicks" }); // arg type and return type -> object

*/
/*
- Assumption
    - want identity() function to create an obj that has a field prop
        - field prop with the value of arg


const identity = <T>(arg: T): T => {
    const obj = {
        field: arg
    };
    return arg
};

- Assumption
    - want to type constrain the obj created to a specific Interface type
        - TS type aliases and interfaces accept type vas as well
            - create an IdentityObj interface above the function
                - this sets type of a field prop to a type var passed in

interface IdentityObj<T> {
    field: T;
}

const identity = <T>(arg: T): T => {
    const obj = {
        field: arg
    };
    return arg
};

- Note
    - in identity function can define the type of obj as
        - the IdentityObj interface and pass the type var along
    - or could have the function return the field prop from obj to
        - conform to the expected return type of the identity() function


interface IdentityObj<T> {
    field: T;
}

const identity = <T>(arg: T): T => {
    const obj: IdentityObj<T> = {
        field: arg
    };
    return obj.field;
};

*/
/*
- Default Generic Values (Generic Parameter Defaults)
- Example
    - identity() function and IdentityObj interface assign
    - default type of any to the type var passed in

interface IdentityObj<T = any> {
  field: T;
}

const identity = <T = any>(arg: T): T => {
  const obj: IdentityObj<T> = {
    field: arg
  };
  return obj.field;
};

- in this way, if a type var isn't defined when using this function and
    - the compiler cannot infer what the type var is, it will be set to any

*/
/*
- The letter T is often used to infer a type var by convention
    - likely due to the fact that it stands for Type
- Example
    - identity() function accepting two type vars
        - TData and TVariables

interface IdentityObj<T = any> {
  field: T;
}

const identity = <TData = any, TVariables = any>(arg: TData): TData => {
  const obj: IdentityObj<TData> = {
    field: arg
  };
  return obj.field;
};
*/ 
//# sourceMappingURL=types.js.map