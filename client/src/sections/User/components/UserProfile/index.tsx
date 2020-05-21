import React, { Fragment } from "react";
import { User as UserData } from "../../../../lib/graphql/queries/User/__generated__/User";
import { Avatar, Button, Card, Divider, Typography } from "antd";

// (a)
interface Props {
    user: UserData["user"];
    viewerIsUser: boolean;
}

const { Paragraph, Text, Title } = Typography;

export const UserProfile = ({ user, viewerIsUser }: Props) => {
    const additionalDetailsSection = viewerIsUser ? (
        <Fragment>
            <Divider />
            <div className="user-profile__details">
                <Title level={4}>Additional Details</Title>
                <Paragraph>
                    Interested in becoming a host? Register with your Stripe account!
                </Paragraph>
                <Button type="primary" className="user-profile__details-cta">
                    Connect with Stripe
                </Button>
                <Paragraph type="secondary">
                    This app uses{" "}
                    <a
                        href="https://stripe.com/en-US/connect"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Stripe
                    </a>{" "}
                    to transfer earnings in a secure and trusted manner.
                </Paragraph>
            </div>
        </Fragment>
    ) : null;

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
                {additionalDetailsSection}
            </Card>
        </div>
    )
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