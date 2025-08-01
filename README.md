# @kuwe-ai/node-sdk

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful Node.js SDK for integrating with popular APIs like Gmail, Google Sheets, LinkedIn and more through a unified, type-safe interface powered by [Nango](https://nango.dev).

## ✨ Features

- 🚀 **Unified API**: Single interface for multiple third-party services
- 🔒 **OAuth2 Authentication**: Secure authentication powered by Nango
- 📝 **TypeScript Support**: Full type safety and IntelliSense support
- 🎯 **Easy Integration**: Simple, consistent API across all services
- 🔄 **Auto Token Management**: Automatic token refresh and error handling
- 📦 **Lightweight**: Minimal dependencies, maximum performance

## 🧩 Supported Integrations

| Service | Status | Features |
|---------|--------|----------|
| **Gmail** | ✅ | Send emails, read messages, manage labels, search, drafts |
| **Google Sheets** | ✅ | Read/write ranges, batch operations, append data |
| **LinkedIn** | ✅ | Profile management, posting, connections |

*More integrations coming soon!*

## 📦 Installation

```bash
npm install @kuwe-ai/node-sdk
```

## 🚀 Quick Start

### 1. Set up Nango

First, create a [Nango account](https://nango.dev) and configure your integrations:

```bash
# Set your environment variables
export NANGO_SECRET_KEY="your-nango-secret-key"
export NANGO_CONNECTION_ID="your-connection-id"
```

### 2. Initialize the SDK

```typescript
import { KuweAI } from '@kuwe-ai/node-sdk';

// Initialize with environment variables
const kuwe = new KuweAI();

// Or pass configuration directly
const kuwe = new KuweAI({
  connectionId: 'your-connection-id',
  secretKey: 'your-secret-key'
});
```

### 3. Start using integrations

```typescript
// Send an email with Gmail
await kuwe.gmail.sendEmail(
  'recipient@example.com',
  'Hello from KuweAI!',
  'This email was sent using the KuweAI SDK.'
);

// Write data to Google Sheets
await kuwe.googleSheets.writeRange(
  'spreadsheet-id',
  'Sheet1!A1:B2',
  [['Name', 'Email'], ['John Doe', 'john@example.com']]
);

// Get LinkedIn profile
const profile = await kuwe.linkedin.getProfile();
```

## 📚 Detailed Usage

### Gmail Integration

#### Send Emails

```typescript
// Simple email
await kuwe.gmail.sendEmail(
  'recipient@example.com',
  'Subject',
  'Email body'
);

// Email with HTML, CC, and BCC
await kuwe.gmail.sendEmail(
  ['recipient1@example.com', 'recipient2@example.com'],
  'Newsletter',
  '<h1>Welcome!</h1><p>This is an HTML email.</p>',
  'from@example.com', // optional sender
  ['cc@example.com'], // CC recipients
  ['bcc@example.com'], // BCC recipients
  true // isHtml
);
```

#### Manage Emails

```typescript
// Get inbox emails
const emails = await kuwe.gmail.getEmails(['INBOX'], 20);

// Search emails
const searchResults = await kuwe.gmail.searchEmails(
  'from:important@company.com subject:urgent'
);

// Get email details
const email = await kuwe.gmail.getEmailDetails('message-id');

// Mark emails as read
await kuwe.gmail.markEmailsAsRead(['msg1', 'msg2'], true);

// Delete emails
await kuwe.gmail.deleteEmails(['msg1', 'msg2']);
```

#### Draft Management

```typescript
// Create a draft
const draft = await kuwe.gmail.createDraft(
  'recipient@example.com',
  'Draft Subject',
  'Draft content'
);

// Send the draft
await kuwe.gmail.sendDraft(draft.data.id);
```

#### Labels and Profile

```typescript
// Get all labels
const labels = await kuwe.gmail.getLabels();

// Add labels to emails
await kuwe.gmail.addLabelsToEmails(['msg1'], ['LABEL_1']);

// Get user profile
const profile = await kuwe.gmail.getProfile();
```

### Google Sheets Integration

#### Basic Operations

```typescript
// Write data to a range
await kuwe.googleSheets.writeRange(
  'spreadsheet-id',
  'Sheet1!A1:C3',
  [
    ['Name', 'Age', 'City'],
    ['Alice', 30, 'New York'],
    ['Bob', 25, 'San Francisco']
  ]
);

// Read data from a range
const data = await kuwe.googleSheets.readRange(
  'spreadsheet-id',
  'Sheet1!A1:C10'
);

// Append new rows
await kuwe.googleSheets.appendValues(
  'spreadsheet-id',
  'Sheet1!A:C',
  [['Charlie', 35, 'Chicago']]
);
```

#### Advanced Operations

```typescript
// Batch update multiple ranges
await kuwe.googleSheets.batchUpdate(
  'spreadsheet-id',
  [
    {
      range: 'Sheet1!A1:A3',
      majorDimension: 'ROWS',
      values: [['Header'], ['Data1'], ['Data2']]
    },
    {
      range: 'Sheet2!B1:B2',
      majorDimension: 'ROWS', 
      values: [['Value1'], ['Value2']]
    }
  ]
);

// Write selectively (skip cells with null)
await kuwe.googleSheets.writeSelectively(
  'spreadsheet-id',
  'Sheet1!A1:C2',
  [
    ['Keep', null, 'Update'], // null values won't overwrite existing data
    ['New', 'Data', null]
  ]
);
```

### LinkedIn Integration

```typescript
// Get user profile
const profile = await kuwe.linkedin.getProfile();

// Post an update
await kuwe.linkedin.createPost('Check out this amazing SDK!');

// Get connections
const connections = await kuwe.linkedin.getConnections();
```

## ⚙️ Configuration

### Environment Variables

```bash
# Required
NANGO_SECRET_KEY=your-nango-secret-key
NANGO_CONNECTION_ID=your-connection-id
```

### Constructor Options

```typescript
interface KuweAIConfig {
  connectionId?: string;  // Override environment variable
  secretKey?: string;     // Override environment variable
}

const kuwe = new KuweAI({
  connectionId: 'custom-connection-id',
  secretKey: 'custom-secret-key'
});
```

## 🔧 Authentication

This SDK uses [Nango](https://nango.dev) for OAuth2 authentication. You'll need to:

1. **Create a Nango account** at [nango.dev](https://nango.dev)
2. **Set up integrations** for the services you want to use
3. **Configure OAuth apps** for each service (Gmail, Google Sheets, LinkedIn)
4. **Get your credentials** and connection IDs from Nango dashboard

### Supported Authentication Types

- **OAuth2** (Gmail, Google Sheets, LinkedIn)
- **OAuth1** (for legacy services)
- **API Keys** (for services that support it)
- **Basic Auth** (for simple authentication)

## 📖 API Reference

### KuweAI Class

```typescript
class KuweAI {
  // Integrations
  readonly gmail: GmailIntegration;
  readonly googleSheets: GoogleSheetsIntegration;
  readonly linkedin: LinkedInIntegration;
  
  constructor(config?: KuweAIConfig);
}
```

### Integration Response Format

All integration methods return a consistent response format:

```typescript
interface IntegrationResponse<T> {
  success: boolean;
  data: T;
  message: string;
}
```

### Error Handling

```typescript
try {
  const result = await kuwe.gmail.sendEmail(/* ... */);
  console.log(result.message); // "Email sent successfully"
} catch (error) {
  console.error('Failed to send email:', error.message);
}
```

## 🛠️ Development

### Prerequisites

- Node.js >= 14.0.0
- TypeScript >= 5.8.0

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/node-kuwe.git
cd node-kuwe

# Install dependencies
npm install

# Build the project
npm run build

# Run linting
npm run lint

# Run tests
npm test
```

### Project Structure

```
src/
├── app.ts              # Main KuweAI class
├── index.ts            # Package exports
├── integrations/       # Integration implementations
│   ├── base.ts         # Base integration class
│   ├── gmail/          # Gmail integration
│   ├── google-sheets/  # Google Sheets integration
│   ├── linkedin/       # LinkedIn integration
│   └── index.ts        # Integration exports
└── test.ts             # Test files
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Adding New Integrations

1. **Create integration folder**: `src/integrations/your-service/`
2. **Extend base class**: Implement `Integration<CredentialType>`
3. **Add to exports**: Update `src/integrations/index.ts`
4. **Add to main app**: Update `src/app.ts`
5. **Write tests**: Add comprehensive tests
6. **Update docs**: Add usage examples to README

### Example Integration Structure

```typescript
// src/integrations/your-service/your-service.ts
import { Integration, OAuth2Credentials } from '../base';

export class YourServiceIntegration extends Integration<OAuth2Credentials> {
  readonly name = 'your-service';
  readonly providerConfigKey = 'your-service';

  public async yourMethod(param: string) {
    const response = await this.proxyRequest({
      method: 'GET',
      endpoint: `/api/endpoint/${param}`
    });

    return {
      success: true,
      data: response.data,
      message: 'Operation completed successfully'
    };
  }
}
```

### Guidelines

- **Follow TypeScript best practices**
- **Add comprehensive error handling**
- **Include JSDoc comments**
- **Write tests for new features**
- **Update documentation**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 **Email**: [support@kuwe.ai](mailto:support@kuwe.ai)
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/node-kuwe/issues)
- 📖 **Documentation**: [GitHub Wiki](https://github.com/your-username/node-kuwe/wiki)
- 💬 **Discord**: [Join our community](https://discord.gg/your-invite)

## 🙏 Acknowledgments

- [Nango](https://nango.dev) for providing excellent OAuth infrastructure
- [Google APIs](https://developers.google.com) for comprehensive API documentation
- [LinkedIn API](https://developer.linkedin.com) for professional networking integration

---

<div align="center">
  <strong>Made with ❤️ by the KuweAI team</strong>
</div>