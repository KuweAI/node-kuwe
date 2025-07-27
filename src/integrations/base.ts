import { Nango } from '@nangohq/node';
import { SelvianProxyConfig } from '../app';

/**
 * Base interface that all integrations must implement
 */
export interface BaseIntegration {
    readonly name: string;
    readonly providerConfigKey: string;
}

/**
 * Abstract base class for all integrations
 * Provides common functionality and ensures consistent structure
 */
export abstract class Integration implements BaseIntegration {
    abstract readonly name: string;
    abstract readonly providerConfigKey: string;

    constructor(
        protected nango: Nango,
        protected connectionId: string
    ) { }

    /**
     * Helper method to make proxy requests with integration-specific defaults
     */
    protected async proxyRequest(config: Omit<SelvianProxyConfig, 'providerConfigKey'>) {
        const fullConfig: SelvianProxyConfig = {
            ...config,
            providerConfigKey: this.providerConfigKey
        };

        return await this.nango.proxy({
            ...fullConfig,
            connectionId: this.connectionId
        });
    }

    public async getConnCredentials(providerConfigKey: string) {
        const res = await this.nango.getConnection(providerConfigKey, this.connectionId);
        return res.credentials;
    }
    /**
     * Validates if the integration is properly configured
     */
    public async validateConnection(): Promise<{ isValid: boolean; error?: string }> {
        try {
            // Each integration can override this method for specific validation
            return { isValid: true };
        } catch (error) {
            return {
                isValid: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
} 