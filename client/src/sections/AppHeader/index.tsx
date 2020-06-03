import React, { useState, useEffect } from "react";
import { Viewer } from "../../lib/types";
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Input, Layout } from "antd";
import logo from "./assets/react-graphql-logo.png";
import { MenuItems } from "./components";
import { displayErrorMessage } from '../../lib/utils/index';

interface Props {
    viewer: Viewer;
    setViewer: (viewer: Viewer) => void;
}

const { Header } = Layout;
const { Search } = Input;

export const AppHeader =({ 
    viewer, setViewer
}: Props) => {
    const [search, setSearch] = useState("");

    const history = useHistory();
    const location = useLocation();
    
    // pathnameSubStrings: string[] -> domain[0], listings[1], location[2]
    useEffect(() => {
        const { pathname } = location;
        const pathnameSubStrings = pathname.split("/");
        if (!pathname.includes("/listings")) {
            setSearch("");
            return;
        }
        if (pathname.includes("/listings") && pathnameSubStrings.length === 3) {
            setSearch(pathnameSubStrings[2]);
            return;
        }
    }, [location]);

    const onSearch = (value: string) => {
        const trimmedValue = value.trim();
        trimmedValue 
            ? history.push(`/listings/${trimmedValue}`) 
            : displayErrorMessage("Please enter a valid search parameter");
    };

    return (
        <Header className="app-header">
            <div className="app-header__logo-search-section">
                <div className="app-header__logo">
                    <Link to="/">
                        <img src={logo} alt="App logo" />
                    </Link>
                </div>
                <div className="app-header__search-input">
                    <Search
                        placeholder="Search"
                        enterButton
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onSearch={onSearch}
                    />
                </div>
            </div>
            <div className="app-header__menu-section">
                <MenuItems viewer={viewer} setViewer={setViewer} />
            </div>
        </Header>
    );
};

// higher order component (HOC)