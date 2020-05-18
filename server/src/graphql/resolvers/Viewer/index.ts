import { IResolvers } from 'apollo-server-express';
import { Viewer } from '../../../lib/types';
import { Google } from '../../../lib/api';

export const viewerResolvers: IResolvers = {
    Query: {
        authUrl: (): string => {
            try {
                return Google.authUrl;
            } catch (error) {
                throw new Error(`Failed to query Google Auth Url ${error}`);
            }
        }
    },
    Mutation: {
        logIn: () => {
            return "Mutation.logIn";
        },
        logOut: () => {
            return "Mutation.logOut";
        }
    },
    Viewer: {
        id: (viewer: Viewer): string | undefined => {
            return viewer._id;
        },
        hasWallet: (viewer: Viewer): boolean | undefined => {
            return viewer.walletId ? true : undefined;
        }
    }
};