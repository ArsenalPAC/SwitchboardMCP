# Switchboard MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with access to the [Switchboard](https://oneswitchboard.com) API for broadcast messaging, email campaigns, and contact management.

## Features

This MCP server exposes Switchboard's API capabilities as tools that AI assistants can use:

- **Broadcast Management**: List, view, and export broadcast campaigns
- **Email Blast Management**: List, view, and export email campaigns  
- **Contact Management**: Create and manage email addresses and phone numbers
- **List Management**: Create and manage email/phone lists with CSV imports
- **Label Management**: Create, edit, and apply labels to organize contacts
- **Export Functions**: Generate CSV exports of campaigns and contact data
- **Job Monitoring**: Track the status of long-running export jobs

## Prerequisites

To use this MCP server, you need:

1. A Switchboard account at [oneswitchboard.com](https://oneswitchboard.com)
2. API credentials from your Switchboard organization settings

## Getting Your API Credentials

1. Log into your Switchboard account
2. Navigate to **Organization Settings** → **API** tab
3. Generate new API credentials
4. Save your **Account ID** and **Secret Key** (you won't be able to access the Secret Key again)

## Installation & Usage

### Option 1: Via Smithery (Recommended)

The easiest way to use this server is through [Smithery](https://smithery.ai):

1. Visit the [Switchboard MCP Server on Smithery](https://smithery.ai/server/switchboard)
2. Click "Connect" and provide your Switchboard API credentials
3. Copy the connection URL to use in your MCP client

### Option 2: Local Development

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

## Connecting to AI Clients

### Claude Desktop

Add this to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "switchboard": {
      "command": "npx",
      "args": ["-y", "switchboard-mcp-server"],
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

## Available Tools

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

## Example Usage

Here are some example prompts you can use with AI assistants:

- "Show me my recent broadcasts"
- "Create a new label called 'VIP Customers'"
- "Export all my email blast data from last month"
- "List all contacts with the 'High Donor' label"
- "Check the status of my latest export job"

## Rate Limits

Switchboard's API has a rate limit of 300 requests per minute. The MCP server will respect these limits.

## Support

- **Switchboard API Issues**: Contact developers@oneswitchboard.com
- **MCP Server Issues**: Create an issue in this repository
- **Switchboard Documentation**: https://api.oneswitchboard.com/v1/docs

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 