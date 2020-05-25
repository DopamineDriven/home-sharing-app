import React from "react";
import { Layout } from "antd";
import { RouteComponentProps } from "react-router-dom";
import { HomeHero } from "./components";
import mapBackground from "./assets/map-background.jpg";

const { Content } = Layout;

export const Home = ({ history }: RouteComponentProps) => {
    const onSearch = (value: string) => {
        const trimmedValue = value.trim();
        history.push(`/listings/${trimmedValue}`)
    };

    return (
        <Content className="home" style={{ backgroundImage: `url(${mapBackground})` }}>
            <HomeHero onSearch={onSearch} />
        </Content>
    );
};
