import React from "react";
import { User as UserData } from "../../../../lib/graphql/queries/User/__generated__/User";
import { Avatar, Card, Divider, Typography } from "antd";

// (a)
interface Props {
    user: UserData["user"];
}

const { Paragraph, Text, Title } = Typography;

export const UserProfile = ({ user }: Props) => {
    return (
        <div className="user-profile">
            <Card className="user-profile__card">
                <div className="user-profile__avatar">
                    <Avatar size={100} src={user.avatar} />
                </div>
                <Divider />
                <div className="user-profile__details">
                    <Title level={4}>Details</Title>
                    <Paragraph>
                        Name: <Text strong>{user.name}</Text>
                    </Paragraph>
                    <Paragraph>
                        Contact: <Text strong>{user.contact}</Text>
                    </Paragraph>
                </div>
            </Card>
        </div>
    );
};

/*
(a)
lookup types - https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-1.html#example-1
    take advantage of autogenerated type definitions
        ./client/src/lib/graphql/queries/User/__generated__/User.ts

------------------------------------------------------------------
export interface User_user {
  __typename: "User";
  id: string;
  name: string;
  avatar: string;
  contact: string;
  hasWallet: boolean;
  income: number | null;
}

export interface User {
  user: User_user;    <-- access type of user here -- User_user
}
---------------------------------------------------------------------

User interface describes shape of data returned from user query
    When looking to describe the shape of user prop passed down to UserProfle
    Use [] bracket syntax to set its type as the type of user property
    within the User data interface
*/