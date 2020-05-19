import React from "react";
import { Viewer } from "../../../../lib/types";
import { Link } from "react-router-dom";
import { Button, Menu } from "antd";
import { HomeOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";

interface Props {
    viewer: Viewer;
}

const { Item, SubMenu } = Menu;

export const MenuItems = ({ viewer }: Props) => {

    const subMenuLogin = viewer.id ? (
        <SubMenu>
            <Item key="/user">
                <UserOutlined />
                Profile
            </Item>
            <Item key="/logout">
                <LogoutOutlined />
                Log Out
            </Item>
        </SubMenu>
    ) : (
        <Item>
            <Link to="/login">
                <Button type="primary">
                    Sign In
                </Button>
            </Link>
        </Item>
    );

    return (
        <Menu
            mode="horizontal"
            selectable={false}
            className="menu"
        >
            <Item key="/host">
                <Link to="/host">
                    <HomeOutlined />
                    Host
                </Link>
            </Item>
            {subMenuLogin}
        </Menu>
    )
}