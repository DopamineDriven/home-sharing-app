import React from "react";
import { Viewer } from "../../../../lib/types";
import { useMutation } from "@apollo/react-hooks";
import { LOG_OUT } from "../../../../lib/graphql/mutations/LogOut";
import { LogOut as LogOutData } from "../../../../lib/graphql/mutations/LogOut/__generated__/LogOut";
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { Avatar, Button, Menu } from "antd";
import {
	displaySuccessNotification,
	displayErrorMessage,
} from "../../../../lib/utils/index";
import { HomeOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";

interface Props {
	viewer: Viewer;
	setViewer: (viewer: Viewer) => void;
}

const { Item, SubMenu } = Menu;

export const MenuItems = withRouter(({ viewer, setViewer, history }: Props & RouteComponentProps) => {
	const [logOut] = useMutation<LogOutData>(LOG_OUT, {
		onCompleted: data => {
			if (data && data.logOut) {
				setViewer(data.logOut);
				sessionStorage.removeItem("token");
				history.replace("/");
				displaySuccessNotification("Successfully Logged Out");
			}
		},
		onError: () => {
			displayErrorMessage("Log out failed; please try again");
		}
	});

	const handleLogOut = () => {
		logOut();
	};

	const subMenuLogin =
		viewer.id && viewer.avatar ? (
			<SubMenu title={<Avatar src={viewer.avatar} />}>
				<Item key="/user">
					<Link to={`/user/${viewer.id}`}>
						<UserOutlined />
						Profile
					</Link>
				</Item>
				<Item key="/logout">
					<div onClick={handleLogOut}>
						<LogoutOutlined />
						Log Out
					</div>
				</Item>
			</SubMenu>
		) : (
			<Item>
				<Link to="/login">
					<Button type="primary">Sign In</Button>
				</Link>
			</Item>
		);

	return (
		<Menu mode="horizontal" selectable={false} className="menu">
			<Item key="/host">
				<Link to="/host">
					<HomeOutlined />
				</Link>
			</Item>
			{subMenuLogin}
		</Menu>
	);
});
