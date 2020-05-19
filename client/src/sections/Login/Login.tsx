import React, { useEffect, useRef } from 'react';
import { Viewer } from '../../lib/types';
import { useApolloClient, useMutation } from "@apollo/react-hooks";
import { AUTH_URL } from "../../lib/graphql/queries/AuthUrl";
import { AuthUrl as AuthUrlData } from "../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl";
import { LOG_IN } from "../../lib/graphql/mutations/LogIn";
import { 
    LogIn as LogInData,
    LogInVariables
} from "../../lib/graphql/mutations/LogIn/__generated__/LogIn";
import { Card, Layout, Spin, Typography } from "antd";
import googleLogo from "./assets/google_logo.jpg";

const { Content } = Layout;
const { Text, Title } = Typography;

interface Props {
    setViewer: (viewer: Viewer) => void;
}

export const Login = ({ setViewer }: Props) => {
    const client = useApolloClient();

    const [
        logIn,
        { data: logInData, loading: logInLoading, error: logInError }
    ] = useMutation<LogInData, LogInVariables>(LOG_IN, {
        // useMutation option from apollo -> onCompleted callback executed on mutation success
        onCompleted: data => {
            if (data && data.logIn) {
                setViewer(data.logIn);
            }
        }
    });

    // can access mutable logIn prop via .current prop of obj returned from useRef below
    // logInRef.current prop will reference original func regardless of rerenders
    const logInRef = useRef(logIn);

    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get("code");
        // only if code available will a logIn req be made -> pass code as a var
        if (code) {
            logInRef.current({
                variables: {
                    input: { code }
                }
            });
        }
    }, []);

    const handleAuthorize = async () => {
        try {
            const { data } = await client.query<AuthUrlData>({
                query: AUTH_URL
            });
            window.location.href = data.authUrl;
        } catch {

        }
    };

    return logInLoading ? (
        <Content className="log-in">
            <Spin size="large" tip="Logging in..." />
        </Content>    
    ) : (
        <Content className="log-in">
            <Card className="log-in-card">
                <div className="log-in-card__intro">
                    <Title level={3} className="log-in-card__intro-title">
                        <span role="img" aria-label="wave">
                            👋
                        </span>
                    </Title>
                    <Title level={3} className="log-in-card__intro-title">
                        Log in to Home Sharing App!
                    </Title>
                    <Text>Sign in with Google to start booking available rentals</Text>
                </div>
                <button 
                    className="log-in-card__google-button"
                    onClick={handleAuthorize}
                >
                    <img 
                        src={googleLogo}
                        alt="Google Logo"
                        className="log-in-card__google-button-logo"
                    />
                    <span className="log-in-card__google-button-text">
                        Sign in with Google
                    </span>
                </button>
                <Text type="secondary">
                    Upon signing in you will be redirected to the Google consent
                    form to sign in with your Google account
                </Text>
            </Card>
        </Content>
    );
};
