import { Nango } from '@nangohq/node';
import { KuweProxyConfig } from '../app';

/**
 * Authentication credential type definitions
 */
export interface OAuth2Credentials {
    type: 'OAUTH2';
    access_token: string;
    refresh_token?: string;
    expires_at?: number;
    scope?: string;
}

export interface OAuth1Credentials {
    type: 'OAUTH1';
    oauth_token: string;
    oauth_token_secret: string;
}

export interface BasicAuthCredentials {
    type: 'BASIC';
    username: string;
    password: string;
}

export interface ApiKeyCredentials {
    type: 'API_KEY';
    apiKey: string;
}

/**
 * Union type of all possible credential types
 */
export type AuthCredentials = OAuth2Credentials | OAuth1Credentials | BasicAuthCredentials | ApiKeyCredentials;

/**
 * Authentication type constants for better type safety
 */
export const AuthType = {
    OAUTH2: 'OAUTH2',
    OAUTH1: 'OAUTH1', 
    BASIC: 'BASIC',
    API_KEY: 'API_KEY'
} as const;

export type AuthTypeValues = typeof AuthType[keyof typeof AuthType];

/**
 * Extract the primary authentication token based on credential type
 */
export type ExtractAuthToken<T extends AuthCredentials> = 
    T extends OAuth2Credentials ? string :
    T extends OAuth1Credentials ? string :
    T extends BasicAuthCredentials ? { username: string; password: string } :
    T extends ApiKeyCredentials ? string :
    never;

/**
 * Base interface that all integrations must implement
 */
export interface BaseIntegration {
    readonly name: string;
    readonly providerConfigKey: string;
}

/**
 * Abstract base class for all integrations with type-safe authentication
 * Provides common functionality and ensures consistent structure
 */
export abstract class Integration<TCredentials extends AuthCredentials = AuthCredentials> implements BaseIntegration {
    abstract readonly name: string;
    abstract readonly providerConfigKey: string;

    constructor(
        private nango: Nango,
        private connectionId: string
    ) { }

    /**
     * Helper method to make proxy requests with integration-specific defaults
     */
    protected async proxyRequest(config: Omit<KuweProxyConfig, 'providerConfigKey'>) {
        const fullConfig: KuweProxyConfig = {
            ...config,
            providerConfigKey: this.providerConfigKey
        };

        return await this.nango.proxy({
            ...fullConfig,
            connectionId: this.connectionId
        });
    }

    /**
     * Get raw credentials from Nango
     */
    public async getConnCredentials(): Promise<TCredentials> {
        const res = await this.nango.getConnection(this.providerConfigKey, this.connectionId);
        return res.credentials as TCredentials;
    }

    /**
     * Get the primary authentication token/credentials based on the auth type
     * Returns the appropriate token type with full type safety
     */
    public async getAuthToken(): Promise<ExtractAuthToken<TCredentials>> {
        const credentials = await this.getConnCredentials();
        
        switch (credentials.type) {
            case AuthType.OAUTH2:
                return (credentials as OAuth2Credentials).access_token as ExtractAuthToken<TCredentials>;
            
            case AuthType.OAUTH1:
                return (credentials as OAuth1Credentials).oauth_token as ExtractAuthToken<TCredentials>;
            
            case AuthType.BASIC:
                return {
                    username: (credentials as BasicAuthCredentials).username,
                    password: (credentials as BasicAuthCredentials).password
                } as ExtractAuthToken<TCredentials>;
            
            case AuthType.API_KEY:
                return (credentials as ApiKeyCredentials).apiKey as ExtractAuthToken<TCredentials>;
            
            default:
                throw new Error(`Unsupported authentication type: ${(credentials as any).type}`);
        }
    }

    /**
     * Validates if the integration is properly configured
     */
    public async validateConnection(): Promise<{ isValid: boolean; error?: string }> {
        try {
            const credentials = await this.getConnCredentials();
            
            // Basic validation based on auth type
            switch (credentials.type) {
                case AuthType.OAUTH2:
                    if (!(credentials as OAuth2Credentials).access_token) {
                        return { isValid: false, error: 'Missing access token' };
                    }
                    break;
                case AuthType.OAUTH1:
                    if (!(credentials as OAuth1Credentials).oauth_token) {
                        return { isValid: false, error: 'Missing OAuth token' };
                    }
                    break;
                case AuthType.BASIC:
                    if (!(credentials as BasicAuthCredentials).username || !(credentials as BasicAuthCredentials).password) {
                        return { isValid: false, error: 'Missing username or password' };
                    }
                    break;
                case AuthType.API_KEY:
                    if (!(credentials as ApiKeyCredentials).apiKey) {
                        return { isValid: false, error: 'Missing API key' };
                    }
                    break;
                default:
                    return { isValid: false, error: 'Unknown authentication type' };
            }
            
            return { isValid: true };
        } catch (error) {
            return {
                isValid: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
} 