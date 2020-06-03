import React, { useState, FormEvent } from 'react';
import { useMutation } from "@apollo/react-hooks";
import { useScrollToTop } from "../../lib/hooks";
import { Link, Redirect } from "react-router-dom";
import { Viewer } from "../../lib/types";
import { ListingType } from "../../lib/graphql/globalTypes";
import { 
    iconColor, 
    displayErrorMessage, 
    displaySuccessNotification 
} from "../../lib/utils";
import { HOST_LISTING } from "../../lib/graphql/mutations";
import {
    HostListing as HostListingData,
    HostListingVariables
} from "../../lib/graphql/mutations/HostListing/__generated__/HostListing";
import { BankOutlined, HomeOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { UploadChangeParam } from "antd/lib/upload";
// import  FormComponentProps  from "antd/lib/form";
import { 
    Button,
    Form, 
    Input, 
    InputNumber, 
    Layout,
    Radio, 
    Typography,
    Upload
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
    useScrollToTop();
    const [imageLoading, setImageLoading] = useState(false);
    const [imageBase64Value, setImageBase64Value] = useState<string | null>(null);
    
    const [hostListing, { loading, data }] = useMutation<
        HostListingData,
        HostListingVariables
    >(HOST_LISTING, {
        onCompleted: () => {
            displaySuccessNotification("Listing created successfully!");
        },
        onError: () => {
            displayErrorMessage("Unable to create listing. Please try again");
        }, 
        fetchPolicy: "cache-and-network"
    });

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

    const handleHostListing = (e: FormEvent) => {
        e.preventDefault();
    };

    const onFinish = (values: any) => {
        console.log(`received values of form ${values}`);

        const fullAddress = `${values.address}, ${values.city}, ${values.state}, ${values.postalCode} `
        
        const input = {
            ...values,
            address: fullAddress,
            image: imageBase64Value,
            price: values.price*100
        };
        delete input.city;
        delete input.state;
        delete input.postalCode;

        hostListing({
            variables: {
                input
            }
        });
    };

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
    ) : loading ? (
        <Content className="host-content">
            <div className="host__form-header">
                <Title level={3} className="host__form-title">
                    Please wait!
                </Title>
                <Text type="secondary">
                    Your listing is being created
                </Text>
            </div>
        </Content>
    ) : data && data.hostListing ? (
        <Redirect to={`/listing/${data.hostListing.id}`} />
    ) : (
        <Content className="host-content">
            <Form layout="vertical" onSubmitCapture={handleHostListing} onFinish={onFinish}>
                <div className="host__form-header">
                    <Title level={3} className="host__form-title">
                        Let's get started creating your new listing!
                    </Title>
                    <Text type="secondary">
                        This form will collect some basic and 
                        additional info about the listing.
                    </Text>
                </div>

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

                <Item 
                    label="Max # of Guests"
                    name="numOfGuests"
                    rules={[
                        { 
                            required: true,
                            message: "Please indicate max # of guests for the listing"
                        }
                    ]}
                >
                    <InputNumber min={1} placeholder="4" />
                </Item>

                <Item 
                    label="Title" 
                    extra="max character count: 45"
                    name="title"
                    rules={[
                        {
                            required: true,
                            message: "please enter a title for the listing"
                        }
                    ]}
                >
                    <Input maxLength={45} placeholder="The iconic and luxurious Bel-Air mansion" />
                </Item>

                <Item 
                    label="Listing Description" 
                    extra="max character count: 400"
                    name="description"
                    rules={[
                        {
                            required: true,
                            message: "please enter a description for the listing"
                        }
                    ]}
                >
                    <TextArea 
                        rows={3}
                        maxLength={400}
                        placeholder={`Modern, clean, and iconic home of the Fresh Prince. Situated in the heart of Bel-Air, Los Angeles.`}
                    />
                </Item>

                <Item 
                    label="Address"
                    name="address"
                    rules={[
                        {
                            required: true,
                            message: "please enter an address for the listing"
                        }
                    ]}
                >
                    <Input placeholder="251 North Bristol Avenue" />
                </Item>
                
                <Item 
                    label="City/Town"
                    name="city"
                    rules={[
                        {
                            required: true,
                            message: "please enter a city or region for the listing"
                        }
                    ]}
                >
                    <Input placeholder="Los Angeles" />
                </Item>

                <Item 
                    label="State/Province"
                    name="state"
                    rules={[
                        {
                            required: true,
                            message: "please enter a state or province for the listing"
                        }
                    ]}
                >
                    <Input placeholder="California" />
                </Item>

                <Item 
                    label="ZIP/Postal Code"
                    name="postalCode"
                    rules={[
                        {
                            required: true,
                            message: "please enter a postal code for the listing"
                        }
                    ]}
                >
                    <Input placeholder="90077" />
                </Item>

                <Item 
                    label="Image" 
                    extra="Image file type must be JPEG or PNG; max size: 1MB"
                    name="image"
                    rules={[
                        {
                            required: true,
                            message: "please provide an image for the listing"
                        }
                    ]}
                >
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

                <Item 
                    label="Price" 
                    extra="All prices in $USD/day"
                    name="price"
                    rules={[
                        {
                            required: true,
                            message: "please select a price for the listing"
                        }
                    ]}
                >
                    <InputNumber min={1} placeholder="180" />
                </Item>

                <Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Item>
            </Form>
        </Content>
    );
};

// // (a) V3 --- deprecated to VOID in v4 
//https://ant.design/components/form/v3
// export const WrappedHost = Form.create({
//     name: "host_form"
// })(Host);


const beforeImageUpload = (file: File) => {
    const fileIsValidImage = file.type === "image/jpeg" || file.type === "image/png";
    // convert to MB in binary form; 2^10 bytes = 1024 bytes = 1 GB; 2^20 bytes = 1024^2 = 1MB
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

/* (b) */
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


/*
(a)
Create form with Form.create
This returns a function
    For the returned func, pass in the concatenated Host component (HOC)
        This creates wrapped Host HOC
    Form.create({}) is a generic intended to recieve props of the form
    as well as that of the component being wrapped
Note: Form.create func has generic of an intersection type passed in
    Props & FormComponentProps
*/


/*
(b)
Blob is a file-like obj with minor differences
FileReader constructor class -> obj allows reading of content of file or blob
    readAsDataURL -> read contents of file or blob
    onload -> event handler that is executed when load event fired
    load event fired when file has been read (readAsDataURL)
    when onload triggered, call callback func with results of filereader (base64 val) as string
    type assertion -> as string (a bit of a hack but ehhh)
*/