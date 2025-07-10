# Switchboard MCP Server (Smithery Native) 🚀

A clean, modern implementation of the Switchboard MCP server built with Smithery best practices.

## Why This Rewrite?

The original implementation was generated from OpenAPI specs, resulting in:
- Complex code with eval() usage
- Manual transport handling
- Deployment issues with Smithery
- 1000+ lines of code

This new implementation:
- ✅ Native Smithery support
- ✅ 43% less code
- ✅ Type-safe Zod schemas
- ✅ Zero eval() usage
- ✅ Automatic transport handling
- ✅ 100% feature parity

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npx @smithery/cli dev
```

This will start the development server with hot-reload.

### Testing

You can test tools in the Smithery playground that opens automatically during development.

## Configuration

The server requires Switchboard API credentials:

- `account_id`: Your Switchboard Account ID
- `secret_key`: Your Switchboard Secret Key

Get these from: https://oneswitchboard.com/organization/settings?tab=api

## Available Tools (36 Total)

### Contact Management
- `create_phone_contact` - Add phone contacts with details
- `create_email_contact` - Add email contacts with details
- `list_phone_contacts` - List all phone numbers
- `list_email_contacts` - List all email addresses
- `update_phone_labels` - Manage phone contact labels
- `update_email_labels` - Manage email contact labels
- `export_phone_contacts` - Export all phone contacts
- `export_email_contacts` - Export all email contacts

### Broadcast Management 
- `list_broadcasts` - List SMS/MMS campaigns
- `get_broadcast` - Get broadcast details
- `get_broadcast_messages` - List messages in a broadcast
- `export_broadcasts` - Export all broadcast data
- `export_broadcast_messages` - Export messages for a broadcast

### Email Campaigns
- `list_email_blasts` - List email campaigns
- `get_email_blast` - Get email blast details
- `get_email_blast_messages` - List messages in an email blast
- `export_email_blasts` - Export all email blast data
- `export_email_blast_messages` - Export messages for an email blast

### Label Management
- `list_labels` - List all labels
- `create_label` - Create new labels
- `get_label` - Get label details
- `edit_label` - Edit/rename labels

### Phone Lists & Imports
- `list_phone_lists` - List all phone lists
- `create_phone_list` - Import phone contacts from CSV
- `get_phone_list` - Get phone list details
- `export_phone_list` - Export a specific phone list
- `update_phone_list_labels` - Update labels for entire phone list

### Email Lists & Imports
- `list_email_lists` - List all email lists  
- `create_email_list` - Import email contacts from CSV
- `get_email_list` - Get email list details
- `export_email_list` - Export a specific email list
- `update_email_list_labels` - Update labels for entire email list

### Other Features
- `export_inbox` - Export inbox messages with filters
- `list_jobs` - List async jobs (imports/exports)
- `get_job` - Get job status
- `whoami` - Verify API credentials

## Architecture

```
src/
└── index.ts         # Complete server implementation (~600 lines)
```

Simple, clean, maintainable.

## Deployment

```yaml
# smithery.yaml
runtime: "typescript"
```

Push to GitHub and deploy via Smithery UI. That's it!

## Migration from Old Server

Both implementations are API-compatible. Users can switch seamlessly with no changes to their workflows.

## Contributing

This is a Smithery-native MCP server. Follow these principles:

1. Use `server.tool()` for all tools
2. Define schemas with Zod
3. Keep error handling consistent
4. No manual transport handling

## License

MIT 