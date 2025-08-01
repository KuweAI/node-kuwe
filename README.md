# @kuwe-ai/node

A powerful Node.js SDK for seamless API integrations with LinkedIn and Google Sheets. Built on top of Nango for robust OAuth2 authentication and proxy capabilities.

## 🚀 Features

- **LinkedIn Integration**: Create and manage LinkedIn posts programmatically
- **Google Sheets Integration**: Read, write, and manipulate Google Sheets data
- **OAuth2 Authentication**: Secure authentication handled via Nango
- **TypeScript Support**: Full type safety and IntelliSense support
- **Easy Configuration**: Simple setup with environment variables or direct configuration

## 📦 Installation

```bash
npm install @kuwe-ai/node
```

## ⚙️ Setup

Before using this SDK, you'll need to set up Nango with your API credentials:

1. **Set up environment variables:**
```bash
NANGO_CONNECTION_ID=your_connection_id
NANGO_SECRET_KEY=your_secret_key
```

2. **Or configure directly in code:**
```typescript
import { KuweAI } from '@kuwe-ai/node';

const kuwe = new KuweAI({
  connectionId: 'your_connection_id',
  secretKey: 'your_secret_key'
});
```

## 🔗 LinkedIn Integration

### Create a Text Post

```typescript
import { KuweAI } from '@kuwe-ai/node';

const kuwe = new KuweAI();

// Create a public LinkedIn post
const result = await kuwe.linkedin.createTextPost(
  "Hello LinkedIn! This post was created via the Kuwe AI SDK 🚀",
  "PUBLIC" // or "PRIVATE"
);

console.log(result);
// {
//   success: true,
//   data: {
//     postId: "urn:li:share:123456789",
//     postUrl: "https://linkedin.com/...",
//     message: "Post created successfully"
//   }
// }
```

### Get Access Token

```typescript
const accessToken = await kuwe.linkedin.getAccessToken();
console.log('LinkedIn Access Token:', accessToken);
```

## 📊 Google Sheets Integration

### Write Data to a Range

```typescript
import { KuweAI } from '@kuwe-ai/node';

const kuwe = new KuweAI();

// Write data to a specific range
const result = await kuwe.googleSheets.writeRange(
  'your_spreadsheet_id',
  'Sheet1!A1:D2',
  [
    ['Name', 'Email', 'Age', 'City'],
    ['John Doe', 'john@example.com', 30, 'New York']
  ]
);

console.log(result);
// {
//   success: true,
//   data: { ... },
//   message: "Range updated successfully"
// }
```

### Read Data from a Range

```typescript
const data = await kuwe.googleSheets.readRange(
  'your_spreadsheet_id',
  'Sheet1!A1:D10'
);

console.log(data);
// {
//   success: true,
//   data: {
//     values: [
//       ['Name', 'Email', 'Age', 'City'],
//       ['John Doe', 'john@example.com', 30, 'New York']
//     ]
//   },
//   message: "Range read successfully"
// }
```

### Append New Rows

```typescript
const result = await kuwe.googleSheets.appendValues(
  'your_spreadsheet_id',
  'Sheet1!A:D',
  [
    ['Jane Smith', 'jane@example.com', 25, 'Los Angeles'],
    ['Bob Johnson', 'bob@example.com', 35, 'Chicago']
  ]
);
```

### Batch Update Multiple Ranges

```typescript
const result = await kuwe.googleSheets.batchUpdate(
  'your_spreadsheet_id',
  [
    {
      range: 'Sheet1!A1:B2',
      majorDimension: 'ROWS',
      values: [['Header 1', 'Header 2'], ['Value 1', 'Value 2']]
    },
    {
      range: 'Sheet1!D1:E2',
      majorDimension: 'ROWS',
      values: [['Header 3', 'Header 4'], ['Value 3', 'Value 4']]
    }
  ]
);
```

### Write Selectively (Skip Cells)

```typescript
// Use null to skip cells, "" to clear them
const result = await kuwe.googleSheets.writeSelectively(
  'your_spreadsheet_id',
  'Sheet1!A1:C3',
  [
    ['Keep this', null, 'Update this'],  // Skip middle cell
    [null, 'New value', null],           // Only update middle cell
    ['', 'Clear first, update second', null]  // Clear first, skip last
  ]
);
```

## 🛠️ Advanced Configuration

### Custom Configuration

```typescript
import { KuweAI, KuweAIConfig } from '@kuwe-ai/node';

const config: KuweAIConfig = {
  connectionId: 'custom_connection_id',
  secretKey: 'custom_secret_key'
};

const kuwe = new KuweAI(config);
```

### Error Handling

```typescript
try {
  const result = await kuwe.linkedin.createTextPost("My post content");
  
  if (result.success) {
    console.log('Post created:', result.data);
  } else {
    console.error('Post creation failed:', result.error);
  }
} catch (error) {
  console.error('SDK Error:', error.message);
}
```

## 📚 API Reference

### KuweAI Class

The main SDK class that provides access to all integrations.

#### Constructor
- `new KuweAI(config?: KuweAIConfig)`

#### Properties
- `linkedin: LinkedInIntegration` - LinkedIn API methods
- `googleSheets: GoogleSheetsIntegration` - Google Sheets API methods

### LinkedIn Integration

#### Methods
- `createTextPost(text: string, visibility?: "PUBLIC" | "PRIVATE"): Promise<Response>`
- `getAccessToken(): Promise<string>`

### Google Sheets Integration

#### Methods
- `writeRange(spreadsheetId, range, values, valueInputOption?, majorDimension?): Promise<Response>`
- `readRange(spreadsheetId, range, majorDimension?): Promise<Response>`
- `appendValues(spreadsheetId, range, values, valueInputOption?, majorDimension?): Promise<Response>`
- `batchUpdate(spreadsheetId, data, valueInputOption?): Promise<Response>`
- `writeSelectively(spreadsheetId, range, values, valueInputOption?, majorDimension?): Promise<Response>`

## 🔧 Requirements

- Node.js 14.0.0 or higher
- Valid Nango account with configured integrations
- LinkedIn and/or Google Sheets API access

## 📝 License

MIT

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 🚀 Development

```bash
# Clone the repository
git clone https://github.com/your-username/node-kuwe.git

# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

## 📞 Support

For support and questions, please visit our [GitHub Issues](https://github.com/your-username/node-kuwe/issues).

---

Made with ❤️ by [Kuwe AI](https://kuwe.ai)