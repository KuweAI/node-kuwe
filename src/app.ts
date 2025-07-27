import { Nango, ProxyConfiguration } from '@nangohq/node';
import { LinkedInIntegration } from './integrations/linkedin/index';

/**
 * Configuration interface for SelvianAI proxy requests
 * Extends ProxyConfiguration but omits connectionId since it's managed internally
 */
export interface SelvianProxyConfig extends Omit<ProxyConfiguration, 'connectionId'> {}

/**
 * Configuration options for SelvianAI constructor
 */
export interface SelvianAIConfig {
    connectionId?: string;
    secretKey?: string;
}

export class SelvianAI {
    nango: Nango;
    connectionId: string;
    
    // Integration instances
    public readonly linkedin: LinkedInIntegration;

    /**
     * Creates a new SelvianAI instance
     * @param config - Optional configuration object
     * @param config.connectionId - Nango connection ID (falls back to NANGO_CONNECTION_ID env var)
     * @param config.secretKey - Nango secret key (falls back to NANGO_SECRET_KEY env var)
     */
    constructor(config: SelvianAIConfig = {}) {
        const connectionId = config.connectionId || process.env.NANGO_CONNECTION_ID;
        const secretKey = config.secretKey || process.env.NANGO_SECRET_KEY;
        
        if (!connectionId || !secretKey) {
            throw new Error(
                'Nango connection ID and secret key are required. ' +
                'Provide them via constructor options or set NANGO_CONNECTION_ID and NANGO_SECRET_KEY environment variables.'
            );
        }
        
        this.connectionId = connectionId;
        this.nango = new Nango({ secretKey });

        // Initialize integrations
        this.linkedin = new LinkedInIntegration(this.nango, this.connectionId);
    }
}
