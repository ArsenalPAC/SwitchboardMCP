# Switchboard MCP Server

<!-- Badges -->
![Arsenal PAC](https://img.shields.io/badge/Arsenal%20PAC-⚙️-FF6B6B?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)
![Current Version](https://img.shields.io/github/package-json/v/ArsenalPAC/SwitchboardMCP?style=for-the-badge)

[![smithery badge](https://smithery.ai/badge/@ArsenalPAC/switchboardmcp)](https://smithery.ai/server/@ArsenalPAC/switchboardmcp)
![NPM Downloads](https://img.shields.io/npm/dt/switchboard-mcp-server)
![GitHub Downloads](https://img.shields.io/github/downloads/ArsenalPAC/SwitchboardMCP/total)

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white&style=for-the-badge)

## 🎯 Purpose

Model Context Protocol (MCP) server for the Switchboard API, enabling AI assistants to access broadcast messaging, email campaigns, and contact management capabilities.

## 🛠️ Features

- 📱 **SMS/MMS Broadcast Management**: List and manage text message campaigns
- 📧 **Email Campaign Tools**: Handle email blasts and email list management  
- 👥 **Contact Management**: Create and organize contacts with labels
- 🏷️ **Label System**: Organize contacts with custom labels
- 📊 **Export Capabilities**: Export campaign data for analysis
- 🔐 **Secure Authentication**: HTTP Basic auth with account credentials

## ⚡ Quick Deploy

### Installation via Smithery

```bash
npx -y @smithery/cli install @arsenalpac/switchboardmcp
```

### Manual Installation

```bash
npm install -g switchboard-mcp-server
```

## 🔧 Configuration

### Required Credentials

You'll need your Switchboard API credentials:
- **Account ID**: Found at https://oneswitchboard.com/organization/settings?tab=api
- **Secret Key**: Generated from the same settings page

### MCP Client Configuration

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "switchboard": {
      "command": "npx",
      "args": ["-y", "@arsenalpac/switchboardmcp"],
      "config": {
        "account_id": "ac_your_account_id_here",
        "secret_key": "sk_your_secret_key_here"
      }
    }
  }
}
```

### Environment Variables (Alternative)

You can also set credentials via environment variables:
```bash
export BASIC_USERNAME_HTTPBASIC="ac_your_account_id"
export BASIC_PASSWORD_HTTPBASIC="sk_your_secret_key"
```

## 🔌 Available Tools

### Broadcast Management
- `list_broadcasts_v1_broadcasts_get` - List all broadcasts
- `get_broadcast_v1_broadcasts__broadcast_id__get` - Get broadcast details
- `export_broadcasts_v1_broadcasts_export_post` - Export broadcast data
- `get_broadcast_phone_messages_v1_broadcasts__broadcast_id__phone_messages_get` - List messages in a broadcast

### Email Campaign Management
- `list_email_blasts_v1_email_blasts_get` - List email campaigns
- `get_email_blast_v1_email_blasts__blast_id__get` - Get email blast details
- `export_blasts_v1_email_blasts_export_post` - Export email blast data

### Contact Management
- `create_phone_v1_phones_post` - Add phone number contact
- `create_email_v1_emails_post` - Add email contact
- `list_phones_v1_phones_get` - List phone contacts
- `list_emails_v1_emails_get` - List email contacts

### List Management
- `create_phone_list_v1_phone_lists_post` - Create phone list from CSV
- `create_email_list_v1_email_lists_post` - Create email list from CSV
- `list_phone_lists_v1_phone_lists_get` - List all phone lists
- `list_email_lists_v1_email_lists_get` - List all email lists

### Label Management
- `create_label_v1_labels_post` - Create new label
- `list_labels_v1_labels_get` - List all labels
- `update_labels_v1_phones_update_labels_post` - Update phone labels
- `update_labels_v1_emails_update_labels_post` - Update email labels

## 📋 Example Usage

### List Recent Broadcasts
```javascript
// AI Assistant can run:
await use_mcp_tool("switchboard", "list_broadcasts_v1_broadcasts_get", {});
```

### Create a New Contact
```javascript
// AI Assistant can run:
await use_mcp_tool("switchboard", "create_phone_v1_phones_post", {
  requestBody: JSON.stringify({
    phone_number: "+12025551234",
    first_name: "Jane",
    last_name: "Doe",
    label_names: ["Volunteer", "Donor"]
  })
});
```

### Export Campaign Data
```javascript
// AI Assistant can run:
await use_mcp_tool("switchboard", "export_broadcasts_v1_broadcasts_export_post", {
  requestBody: JSON.stringify({})
});
```

## 🔐 Security Standards

- **API Authentication**: Secure HTTP Basic authentication
- **Data Protection**: All communications use HTTPS
- **Credential Storage**: Never commit credentials to version control
- **Access Control**: API keys are scoped to organization level

## 💻 Development

### Local Development
```bash
# Clone the repository
git clone https://github.com/ArsenalPAC/SwitchboardMCP.git
cd SwitchboardMCP

# Install dependencies
npm install

# Build the project
npm run build

# Run locally
npm start
```

### Testing with MCP Inspector
```bash
# Use the MCP Inspector to test the server
npx @modelcontextprotocol/inspector
```

## 🤝 Contributing

Arsenal PAC welcomes contributions! Please feel free to submit a Pull Request.

## 🏛️ Political Disclaimer

Paid for by [Arsenal PAC](https://arsenaldemocracy.org) and is not authorized by any candidate or candidate's committee.

## 📧 Support


> **Note:** This project is *not* affiliated with Switchboard. Switchboard support will generally not be able to assist with MCP-related questions or issues.

**Where to Get Help:**
- **Switchboard API Issues:** Email [developers@oneswitchboard.com](mailto:developers@oneswitchboard.com)
- **MCP Server Issues or General Questions:** [Open an issue in this repository](../../issues)
- **Switchboard API Documentation:** [https://api.oneswitchboard.com/v1/docs](https://api.oneswitchboard.com/v1/docs)

## ⚖️ License & Compliance

Licensed under MIT License.
