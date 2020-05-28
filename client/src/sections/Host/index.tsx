import React from 'react';
import { Link } from "react-router-dom";
import { Viewer } from "../../lib/types";
import { ListingType } from "../../lib/graphql/globalTypes";
import { iconColor } from "../../lib/utils";
import { BankOutlined, HomeOutlined } from "@ant-design/icons";
import { 
    Form, 
    Input, 
    InputNumber, 
    Layout,
    Radio, 
    Typography 
} from "antd";

interface Props {
    viewer: Viewer;
}

const { APARTMENT, HOUSE } = ListingType;

const { Item } = Form;
const { TextArea } = Input;
const { Content } = Layout;
const { Text, Title } = Typography;

export const Host = ({ viewer }: Props) => {
    return !viewer.id || !viewer.hasWallet ? (
        <Content className="host-content">
            <div className="host__form-header">
                <Title level={4} className="host__form-title">
                    Sign in and connect with Stripe to host a listing!
                </Title>
                <Text type="secondary">
                    Must be signed in and connected with Stripe to host 
                    new listings. Please{" "}
                    <Link to="/login">login</Link> and connect with Stripe.
                </Text>
            </div>
        </Content>
    ) : (
        <Content className="host-content">
            <Form layout="vertical">
                <div className="host__form-header">
                    <Title level={3} className="host__form-title">
                        Let's get started creating your new listing!
                    </Title>
                    <Text type="secondary">
                        This form will collect some basic and 
                        additional info about the listing.
                    </Text>
                </div>

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

                <Item label="Title" extra="max character count: 45">
                    <Input maxLength={45} placeholder="The iconic and luxurious Bel-Air mansion" />
                </Item>

                <Item label="Listing Description" extra="max character count: 400">
                    <TextArea 
                        rows={3}
                        maxLength={400}
                        placeholder={`Modern, clean, and iconic home of the Fresh Prince. Situated in the heart of Bel-Air, Los Angeles.`}
                    />
                </Item>

                <Item label="Address">
                    <Input placeholder="251 North Bristol Avenue" />
                </Item>
                
                <Item label="City/Town">
                    <Input placeholder="Los Angeles" />
                </Item>

                <Item label="State/Province">
                    <Input placeholder="California" />
                </Item>

                <Item label="ZIP/Postal Code">
                    <Input placeholder="90077" />
                </Item>

                <Item label="Price" extra="All prices in $USD/day">
                    <InputNumber min={1} placeholder="180" />
                </Item>
            </Form>
        </Content>
    );
};
