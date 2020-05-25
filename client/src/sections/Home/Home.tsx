import React from "react";
import { Layout } from "antd";
import { HomeHero } from "./components";

const { Content } = Layout;

export const Home = () => {
    return (
        <Content className="home">
            <HomeHero />
        </Content>
    );
};
