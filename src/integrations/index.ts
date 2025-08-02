// Export base integration classes and interfaces
export { Integration } from './base';
export type { BaseIntegration } from './base';

// Export authentication types and utilities
export { 
  AuthType,
  type OAuth2Credentials,
  type OAuth1Credentials, 
  type BasicAuthCredentials,
  type ApiKeyCredentials,
  type AuthCredentials,
  type AuthTypeValues,
  type ExtractAuthToken
} from './base';

// Export integration implementations
export { LinkedInIntegration } from './linkedin/linkedin';
export { GmailIntegration } from './google-mail/google-mail';
export { OpenAIIntegration } from './openai/openai';