# Switchboard MCP Server

<!-- Badges -->
![Arsenal PAC](https://img.shields.io/badge/Arsenal%20PAC-⚙️-FF6B6B?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)
![GitHub Release](https://img.shields.io/github/v/release/ArsenalPAC/SwitchboardMCP?style=for-the-badge)
![Current Version](https://img.shields.io/github/package-json/v/ArsenalPAC/SwitchboardMCP?style=for-the-badge)

[![smithery badge](https://smithery.ai/badge/@ArsenalPAC/switchboardmcp)](https://smithery.ai/server/@ArsenalPAC/switchboardmcp)
![NPM Downloads](https://img.shields.io/npm/dt/switchboard-mcp-server)
![GitHub Downloads](https://img.shields.io/github/downloads/ArsenalPAC/SwitchboardMCP/total)

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white&style=for-the-badge)


## 🎯 Purpose

A Model Context Protocol (MCP) server that enables AI assistants to access the [Switchboard](https://oneswitchboard.com) API for broadcast messaging, email campaigns, and contact management. Built to empower progressive campaigns with automated messaging infrastructure and voter outreach capabilities.

Originally generated using [openapi-mcp-generator](https://github.com/harsha-iiiv/openapi-mcp-generator) with the [Switchboard OpenAPI specification](https://api.oneswitchboard.com/v1/docs).

## 🛠️ Features

- 📱 **Broadcast Management**: List, view, and export broadcast campaigns for SMS outreach
- 💰 **Email Blast Management**: List, view, and export email campaigns for fundraising and voter contact
- 📧 **Contact Management**: Create and manage email addresses and phone numbers with full CRUD operations
- 📊 **List Management**: Create and manage email/phone lists with CSV imports for rapid deployment
- 🏷️ **Label Management**: Create, edit, and apply labels to organize contacts by district, issue, or campaign
- 📤 **Export Functions**: Generate CSV exports of campaigns and contact data for compliance and analysis
- ⚙️ **Job Monitoring**: Track the status of long-running export jobs in real-time

## ⚡ Quick Deploy

### Prerequisites

To use this MCP server, you need:

1. A Switchboard account at [oneswitchboard.com](https://oneswitchboard.com)
2. API credentials from your Switchboard organization settings

### Getting Your API Credentials

1. Log into your Switchboard account
2. Navigate to **Organization Settings** → **API** tab
3. Generate new API credentials
4. Save your **Account ID** and **Secret Key** (you won't be able to access the Secret Key again)

### Option 1: Via npm (Recommended)

Install and run directly via npm:

```bash
npx switchboard-mcp-server
```

Or install globally:

```bash
npm install -g switchboard-mcp-server
switchboard-mcp-server
```

### Option 2: Via Smithery

The easiest way to configure this server is through [Smithery](https://smithery.ai):

1. Visit the [Switchboard MCP Server on Smithery](https://smithery.ai/server/@ArsenalPAC/switchboardmcp)
2. Click "Connect" and provide your Switchboard API credentials
3. Copy the connection URL to use in your MCP client

### Option 3: Local Development

For local development or testing:

1. Clone this repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Set environment variables:
   ```bash
   export BASIC_USERNAME_HTTPBASIC="your_account_id"
   export BASIC_PASSWORD_HTTPBASIC="your_secret_key"
   ```
5. Run the server:
   - For stdio mode: `npm start`
   - For HTTP mode: `npm run start:http`

## 🔌 Integrations

- **Switchboard API**: Full integration with broadcast messaging and contact management
- **Claude Desktop**: Native MCP integration for AI-powered campaign automation
- **CSV Import/Export**: Bulk operations for rapid campaign deployment
- **Real-time Job Monitoring**: Track export progress and data processing

## 🔐 Security Standards

- **API Authentication**: Secure HTTP Basic Auth with Account ID and Secret Key
- **Environment Variables**: Secure credential storage
- **Data Validation**: Zod-based schema validation for all API operations
- **Compliance Ready**: Built for FEC reporting requirements with full export capabilities

## 💻 Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![MCP SDK](https://img.shields.io/badge/MCP%20SDK-1.10.0-blue)
![Zod](https://img.shields.io/badge/Zod-Validation-3E67B1)
![Axios](https://img.shields.io/badge/Axios-HTTP-671DDF)
![Hono](https://img.shields.io/badge/Hono-Server-E36002)

## 🤖 Connecting to AI Clients

### Claude Desktop

Add this to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "switchboard": {
      "command": "npx",
      "args": ["switchboard-mcp-server"],
      "env": {
        "BASIC_USERNAME_HTTPBASIC": "your_account_id",
        "BASIC_PASSWORD_HTTPBASIC": "your_secret_key"
      }
    }
  }
}
```

### Via Smithery URL

If using Smithery, add the connection URL from your Smithery dashboard to your MCP client.

## 🛠️ Available Tools

The server provides the following tools (auto-generated from Switchboard's OpenAPI spec):

### Broadcast Tools
- `list_broadcasts_v1_broadcasts_get` - List all broadcasts
- `get_broadcast_v1_broadcasts__broadcast_id__get` - Get specific broadcast details
- `export_broadcasts_v1_broadcasts_export_post` - Export broadcast data to CSV

### Email Blast Tools  
- `list_email_blasts_v1_email_blasts_get` - List all email blasts
- `get_email_blast_v1_email_blasts__blast_id__get` - Get specific email blast details
- `export_blasts_v1_email_blasts_export_post` - Export email blast data to CSV

### Contact Management Tools
- `list_emails_v1_emails_get` - List email addresses
- `create_email_v1_emails_post` - Create new email address
- `list_phones_v1_phones_get` - List phone numbers
- `create_phone_v1_phones_post` - Create new phone number

### Label Management Tools
- `list_labels_v1_labels_get` - List all labels
- `create_label_v1_labels_post` - Create new label
- `get_label_v1_labels__label_id__get` - Get specific label
- `edit_label_v1_labels__label_id__patch` - Edit existing label

### List Management Tools
- `create_email_list_v1_email_lists_post` - Create email list from CSV
- `list_email_lists_v1_email_lists_get` - List all email lists
- `create_phone_list_v1_phone_lists_post` - Create phone list from CSV
- `list_phone_lists_v1_phone_lists_get` - List all phone lists

### Export & Job Tools
- `get_jobs_v1_jobs__get` - List export jobs
- `get_job_v1_jobs__job_id__get` - Get job status and download URL
- Various `*_export_*` tools for generating CSV exports

### Utility Tools
- `whoami_v1_whoami_get` - Validate API credentials and permissions


## 📧 Support


> **Note:** This project is *not* affiliated with Switchboard. Switchboard support will generally not be able to assist with MCP-related questions or issues.

**Where to Get Help:**
- **Switchboard API Issues:** Email [developers@oneswitchboard.com](mailto:developers@oneswitchboard.com)
- **MCP Server Issues or General Questions:** [Open an issue in this repository](../../issues)
- **Switchboard API Documentation:** [https://api.oneswitchboard.com/v1/docs](https://api.oneswitchboard.com/v1/docs)

## ⚖️ License & Compliance

Licensed under MIT License.

## 🤝 Contributing

Arsenal PAC welcomes contributions! Please feel free to submit a Pull Request.

## 🏛️ Political Disclaimer

Paid for by [Arsenal PAC](https://arsenaldemocracy.org) and is not authorized by any candidate or candidate's committee.
