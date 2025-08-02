import { Nango, ProxyConfiguration } from '@nangohq/node';
import { LinkedInIntegration } from './integrations/linkedin/index';
import { GoogleSheetsIntegration } from './integrations/google-sheets/index';
import { GmailIntegration } from './integrations/google-mail/index';
import { OpenAIIntegration } from './integrations/openai';

/**
 * Configuration interface for KuweAI proxy requests
 * Extends ProxyConfiguration but omits connectionId since it's managed internally
 */
export interface KuweProxyConfig extends Omit<ProxyConfiguration, 'connectionId'> { }

/**
 * Configuration options for KuweAI constructor
 */
export interface KuweAIConfig {
    connectionId?: string;
    secretKey?: string;
}

export class KuweAI {
    nango: Nango;
    connectionId: string;

    // Integration instances
    public readonly linkedin: LinkedInIntegration;
    public readonly googleSheets: GoogleSheetsIntegration;
    public readonly gmail: GmailIntegration;
    public readonly openai: OpenAIIntegration;

    /**
     * Creates a new KuweAI instance
     * @param config - Optional configuration object
     * @param config.connectionId - Nango connection ID (falls back to NANGO_CONNECTION_ID env var)
     * @param config.secretKey - Nango secret key (falls back to NANGO_SECRET_KEY env var)
     */
    constructor(config: KuweAIConfig = {}) {
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
        this.googleSheets = new GoogleSheetsIntegration(this.nango, this.connectionId);
        this.gmail = new GmailIntegration(this.nango, this.connectionId);
        this.openai = new OpenAIIntegration();
    }
}
