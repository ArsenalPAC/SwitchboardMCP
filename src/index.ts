import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import axios, { AxiosInstance } from 'axios';

// Configuration schema - defines what users need to provide
export const configSchema = z.object({
  account_id: z.string().describe("Your Switchboard API Account ID (from https://oneswitchboard.com/organization/settings?tab=api)"),
  secret_key: z.string().describe("Your Switchboard API Secret Key (from https://oneswitchboard.com/organization/settings?tab=api)")
});

type Config = z.infer<typeof configSchema>;

// Helper to create authenticated axios instance
function createApiClient(config: Config): AxiosInstance {
  return axios.create({
    baseURL: 'https://api.oneswitchboard.com',
    auth: {
      username: config.account_id,
      password: config.secret_key
    },
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
}

// Main server export
export default function ({ config }: { config: Config }) {
  const server = new McpServer({
    name: 'Switchboard MCP Server',
    version: '2.0.0'
  });

  // Create authenticated API client
  const api = createApiClient(config);

  // Tool: List broadcasts
  server.tool(
    'list_broadcasts',
    'List all broadcasts in your organization',
    {
      page: z.number().optional().default(1).describe('Page number for pagination'),
      per_page: z.number().optional().default(25).describe('Number of results per page')
    },
    async ({ page, per_page }) => {
      try {
        const response = await api.get('/v1/broadcasts', {
          params: { page, per_page }
        });
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: Get broadcast details
  server.tool(
    'get_broadcast',
    'Get details of a specific broadcast',
    {
      broadcast_id: z.string().describe('The ID of the broadcast to retrieve')
    },
    async ({ broadcast_id }) => {
      try {
        const response = await api.get(`/v1/broadcasts/${broadcast_id}`);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: Create phone contact
  server.tool(
    'create_phone_contact',
    'Create a new phone number contact',
    {
      phone_number: z.string().describe('Phone number in E.164 format (e.g., +12025551234)'),
      first_name: z.string().optional().describe('Contact first name'),
      last_name: z.string().optional().describe('Contact last name'),
      label_names: z.array(z.string()).optional().describe('Array of label names to assign')
    },
    async ({ phone_number, first_name, last_name, label_names }) => {
      try {
        const response = await api.post('/v1/phones', {
          phone_number,
          first_name,
          last_name,
          label_names
        });
        
        return {
          content: [{
            type: 'text',
            text: `Contact created successfully: ${JSON.stringify(response.data, null, 2)}`
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: List labels
  server.tool(
    'list_labels',
    'List all labels in your organization',
    {},
    async () => {
      try {
        const response = await api.get('/v1/labels');
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: Create label
  server.tool(
    'create_label',
    'Create a new label for organizing contacts',
    {
      name: z.string().describe('Name of the label to create')
    },
    async ({ name }) => {
      try {
        const response = await api.post('/v1/labels', { name });
        
        return {
          content: [{
            type: 'text',
            text: `Label created: ${JSON.stringify(response.data, null, 2)}`
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: Export broadcasts
  server.tool(
    'export_broadcasts',
    'Export broadcast data. Returns a signed URL for downloading the export.',
    {},
    async () => {
      try {
        const response = await api.post('/v1/broadcasts/export', {});
        
        return {
          content: [{
            type: 'text',
            text: `Export created. Download URL: ${response.data.url}\nExpires at: ${response.data.expires_at}`
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: Who am I
  server.tool(
    'whoami',
    'Get information about the current API credentials and permissions',
    {},
    async () => {
      try {
        const response = await api.get('/v1/whoami');
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: List phone contacts
  server.tool(
    'list_phone_contacts',
    'List all phone contacts in your organization',
    {
      cursor: z.string().optional().describe('Pagination cursor from previous response')
    },
    async ({ cursor }) => {
      try {
        const response = await api.get('/v1/phones', {
          params: cursor ? { cursor } : {}
        });
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: Update phone labels
  server.tool(
    'update_phone_labels',
    'Add or remove labels from a phone contact',
    {
      phone_number: z.string().describe('Phone number in E.164 format'),
      action: z.enum(['add', 'remove']).describe('Whether to add or remove labels'),
      label_names: z.array(z.string()).optional().describe('Label names to add/remove'),
      label_ids: z.array(z.string()).optional().describe('Label IDs to add/remove')
    },
    async ({ phone_number, action, label_names, label_ids }) => {
      try {
        const response = await api.post('/v1/phones/update_labels', {
          phone_number,
          action,
          label_names,
          label_ids
        });
        
        return {
          content: [{
            type: 'text',
            text: `Labels ${action}ed successfully: ${JSON.stringify(response.data, null, 2)}`
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: Create email contact
  server.tool(
    'create_email_contact',
    'Create a new email contact',
    {
      email_address: z.string().email().describe('Email address'),
      phone_number: z.string().optional().describe('Associated phone number'),
      first_name: z.string().optional().describe('Contact first name'),
      last_name: z.string().optional().describe('Contact last name'),
      full_name: z.string().optional().describe('Contact full name'),
      zip_code: z.string().optional().describe('US zip code'),
      state_abbr: z.string().optional().describe('US state abbreviation'),
      label_names: z.array(z.string()).optional().describe('Label names to assign'),
      custom_source: z.string().optional().describe('Custom source identifier'),
      custom_id: z.string().optional().describe('Custom ID')
    },
    async (params) => {
      try {
        const response = await api.post('/v1/emails', params);
        
        return {
          content: [{
            type: 'text',
            text: `Email contact created: ${JSON.stringify(response.data, null, 2)}`
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: List email contacts  
  server.tool(
    'list_email_contacts',
    'List all email contacts in your organization',
    {
      cursor: z.string().optional().describe('Pagination cursor')
    },
    async ({ cursor }) => {
      try {
        const response = await api.get('/v1/emails', {
          params: cursor ? { cursor } : {}
        });
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: List email blasts
  server.tool(
    'list_email_blasts',
    'List all email blasts/campaigns',
    {
      cursor: z.string().optional().describe('Pagination cursor')
    },
    async ({ cursor }) => {
      try {
        const response = await api.get('/v1/email_blasts', {
          params: cursor ? { cursor } : {}
        });
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: Get email blast details
  server.tool(
    'get_email_blast',
    'Get details of a specific email blast',
    {
      blast_id: z.string().describe('The ID of the email blast')
    },
    async ({ blast_id }) => {
      try {
        const response = await api.get(`/v1/email_blasts/${blast_id}`);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: Get broadcast messages
  server.tool(
    'get_broadcast_messages',
    'List all messages sent in a specific broadcast',
    {
      broadcast_id: z.string().describe('The ID of the broadcast'),
      cursor: z.string().optional().describe('Pagination cursor')
    },
    async ({ broadcast_id, cursor }) => {
      try {
        const response = await api.get(`/v1/broadcasts/${broadcast_id}/phone_messages`, {
          params: cursor ? { cursor } : {}
        });
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: Create phone list
  server.tool(
    'create_phone_list',
    'Create a phone list from a CSV file URL',
    {
      resource_url: z.string().url().describe('URL of CSV file to import'),
      name: z.string().optional().describe('Name for the phone list'),
      description: z.string().optional().describe('Description of the list'),
      fields_to_headers: z.object({
        phone_number: z.string().describe('CSV header for phone numbers'),
        email_address: z.string().optional(),
        first_name: z.string().optional(),
        last_name: z.string().optional(),
        zip_code: z.string().optional()
      }).describe('Map CSV headers to contact fields'),
      label_names: z.array(z.string()).optional().describe('Labels to apply to all contacts')
    },
    async ({ resource_url, name, description, fields_to_headers, label_names }) => {
      try {
        const response = await api.post('/v1/phone_lists', {
          resource_url,
          name,
          description,
          fields_to_headers,
          label_names
        });
        
        return {
          content: [{
            type: 'text',
            text: `Phone list created: ${JSON.stringify(response.data, null, 2)}`
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: Export phone contacts
  server.tool(
    'export_phone_contacts',
    'Export all phone contacts. Returns a signed URL for downloading the export.',
    {},
    async () => {
      try {
        const response = await api.post('/v1/phones/export', {});
        
        return {
          content: [{
            type: 'text',
            text: `Export created. Download URL: ${response.data.url}\nExpires at: ${response.data.expires_at}`
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: Export email contacts
  server.tool(
    'export_email_contacts',
    'Export all email contacts. Returns a signed URL for downloading the export.',
    {},
    async () => {
      try {
        const response = await api.post('/v1/emails/export', {});
        
        return {
          content: [{
            type: 'text',
            text: `Export created. Download URL: ${response.data.url}\nExpires at: ${response.data.expires_at}`
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: List phone lists
  server.tool(
    'list_phone_lists',
    'List all phone lists in your organization',
    {
      cursor: z.string().optional().describe('Pagination cursor')
    },
    async ({ cursor }) => {
      try {
        const response = await api.get('/v1/phone_lists', {
          params: cursor ? { cursor } : {}
        });
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: Export email blasts
  server.tool(
    'export_email_blasts',
    'Export all email blast data. Returns a signed URL for downloading.',
    {},
    async () => {
      try {
        const response = await api.post('/v1/email_blasts/export', {});
        
        return {
          content: [{
            type: 'text',
            text: `Export created. Download URL: ${response.data.url}\nExpires at: ${response.data.expires_at}`
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: Export inbox messages
  server.tool(
    'export_inbox',
    'Export inbox messages with various filtering options',
    {
      has_replied: z.boolean().optional().default(true).describe('Filter to messages where user has replied'),
      include_outgoing: z.boolean().optional().default(false).describe('Include outgoing messages'),
      is_reply_needed: z.boolean().optional().default(true).describe('Only messages awaiting response')
    },
    async ({ has_replied, include_outgoing, is_reply_needed }) => {
      try {
        const response = await api.post('/v1/inbox/export', {
          has_replied,
          include_outgoing,
          is_reply_needed
        });
        
        return {
          content: [{
            type: 'text',
            text: `Export created. Download URL: ${response.data.url}\nExpires at: ${response.data.expires_at}`
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: Update email labels
  server.tool(
    'update_email_labels',
    'Add or remove labels from an email contact',
    {
      email_address: z.string().email().describe('Email address to update'),
      action: z.enum(['add', 'remove']).describe('Whether to add or remove labels'),
      label_names: z.array(z.string()).optional().describe('Label names to add/remove'),
      label_ids: z.array(z.string()).optional().describe('Label IDs to add/remove')
    },
    async ({ email_address, action, label_names, label_ids }) => {
      try {
        const response = await api.post('/v1/emails/update_labels', {
          email_address,
          action,
          label_names,
          label_ids
        });
        
        return {
          content: [{
            type: 'text',
            text: `Labels ${action}ed successfully: ${JSON.stringify(response.data, null, 2)}`
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: Create email list
  server.tool(
    'create_email_list',
    'Create an email list from a CSV file URL',
    {
      resource_url: z.string().url().describe('URL of CSV file to import'),
      name: z.string().optional().describe('Name for the email list'),
      description: z.string().optional().describe('Description of the list'),
      fields_to_headers: z.object({
        email_address: z.string().describe('CSV header for email addresses'),
        phone_number: z.string().optional(),
        first_name: z.string().optional(),
        last_name: z.string().optional(),
        zip_code: z.string().optional()
      }).describe('Map CSV headers to contact fields'),
      label_names: z.array(z.string()).optional().describe('Labels to apply to all contacts')
    },
    async ({ resource_url, name, description, fields_to_headers, label_names }) => {
      try {
        const response = await api.post('/v1/email_lists', {
          resource_url,
          name,
          description,
          fields_to_headers,
          label_names
        });
        
        return {
          content: [{
            type: 'text',
            text: `Email list created: ${JSON.stringify(response.data, null, 2)}`
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: Export broadcast messages
  server.tool(
    'export_broadcast_messages',
    'Export all messages for a specific broadcast',
    {
      broadcast_id: z.string().describe('The ID of the broadcast')
    },
    async ({ broadcast_id }) => {
      try {
        const response = await api.post(`/v1/broadcasts/${broadcast_id}/phone_messages/export`, {});
        
        return {
          content: [{
            type: 'text',
            text: `Export created. Download URL: ${response.data.url}\nExpires at: ${response.data.expires_at}`
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: Get label details
  server.tool(
    'get_label',
    'Get details of a specific label',
    {
      label_id: z.string().describe('The ID of the label')
    },
    async ({ label_id }) => {
      try {
        const response = await api.get(`/v1/labels/${label_id}`);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: Edit label
  server.tool(
    'edit_label',
    'Edit/rename an existing label',
    {
      label_id: z.string().describe('The ID of the label to edit'),
      name: z.string().describe('New name for the label')
    },
    async ({ label_id, name }) => {
      try {
        const response = await api.patch(`/v1/labels/${label_id}`, { name });
        
        return {
          content: [{
            type: 'text',
            text: `Label updated: ${JSON.stringify(response.data, null, 2)}`
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: Get email blast messages
  server.tool(
    'get_email_blast_messages',
    'List all messages sent in a specific email blast',
    {
      blast_id: z.string().describe('The ID of the email blast'),
      cursor: z.string().optional().describe('Pagination cursor')
    },
    async ({ blast_id, cursor }) => {
      try {
        const response = await api.get(`/v1/email_blasts/${blast_id}/email_messages`, {
          params: cursor ? { cursor } : {}
        });
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: Export email blast messages
  server.tool(
    'export_email_blast_messages',
    'Export all messages for a specific email blast',
    {
      blast_id: z.string().describe('The ID of the email blast')
    },
    async ({ blast_id }) => {
      try {
        const response = await api.post(`/v1/email_blasts/${blast_id}/email_messages/export`, {});
        
        return {
          content: [{
            type: 'text',
            text: `Export created. Download URL: ${response.data.url}\nExpires at: ${response.data.expires_at}`
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: Get email list
  server.tool(
    'get_email_list',
    'Get details of a specific email list',
    {
      email_list_id: z.string().describe('The ID of the email list')
    },
    async ({ email_list_id }) => {
      try {
        const response = await api.get(`/v1/email_lists/${email_list_id}`);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: Export email list
  server.tool(
    'export_email_list',
    'Export a specific email list',
    {
      email_list_id: z.string().describe('The ID of the email list')
    },
    async ({ email_list_id }) => {
      try {
        const response = await api.post(`/v1/email_lists/${email_list_id}/export`, {});
        
        return {
          content: [{
            type: 'text',
            text: `Export created. Download URL: ${response.data.url}\nExpires at: ${response.data.expires_at}`
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: Update email list labels
  server.tool(
    'update_email_list_labels',
    'Add or remove labels from all contacts in an email list',
    {
      email_list_id: z.string().describe('The ID of the email list'),
      action: z.enum(['add', 'remove']).describe('Whether to add or remove labels'),
      label_names: z.array(z.string()).optional().describe('Label names to add/remove'),
      label_ids: z.array(z.string()).optional().describe('Label IDs to add/remove')
    },
    async ({ email_list_id, action, label_names, label_ids }) => {
      try {
        const response = await api.post(`/v1/email_lists/${email_list_id}/update_labels`, {
          action,
          label_names,
          label_ids
        });
        
        return {
          content: [{
            type: 'text',
            text: `Labels ${action}ed for email list: ${JSON.stringify(response.data, null, 2)}`
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: Get phone list
  server.tool(
    'get_phone_list',
    'Get details of a specific phone list',
    {
      phone_list_id: z.string().describe('The ID of the phone list')
    },
    async ({ phone_list_id }) => {
      try {
        const response = await api.get(`/v1/phone_lists/${phone_list_id}`);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: Export phone list
  server.tool(
    'export_phone_list',
    'Export a specific phone list',
    {
      phone_list_id: z.string().describe('The ID of the phone list')
    },
    async ({ phone_list_id }) => {
      try {
        const response = await api.post(`/v1/phone_lists/${phone_list_id}/export`, {});
        
        return {
          content: [{
            type: 'text',
            text: `Export created. Download URL: ${response.data.url}\nExpires at: ${response.data.expires_at}`
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: Update phone list labels
  server.tool(
    'update_phone_list_labels',
    'Add or remove labels from all contacts in a phone list',
    {
      phone_list_id: z.string().describe('The ID of the phone list'),
      action: z.enum(['add', 'remove']).describe('Whether to add or remove labels'),
      label_names: z.array(z.string()).optional().describe('Label names to add/remove'),
      label_ids: z.array(z.string()).optional().describe('Label IDs to add/remove')
    },
    async ({ phone_list_id, action, label_names, label_ids }) => {
      try {
        const response = await api.post(`/v1/phone_lists/${phone_list_id}/update_labels`, {
          action,
          label_names,
          label_ids
        });
        
        return {
          content: [{
            type: 'text',
            text: `Labels ${action}ed for phone list: ${JSON.stringify(response.data, null, 2)}`
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: List jobs
  server.tool(
    'list_jobs',
    'List async jobs (imports, exports, etc.)',
    {
      type: z.string().optional().describe('Filter by job type'),
      cursor: z.string().optional().describe('Pagination cursor')
    },
    async ({ type, cursor }) => {
      try {
        const params: any = {};
        if (type) params.type = type;
        if (cursor) params.cursor = cursor;
        
        const response = await api.get('/v1/jobs/', { params });
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  // Tool: Get job status
  server.tool(
    'get_job',
    'Get status of a specific async job',
    {
      job_id: z.string().describe('The ID of the job')
    },
    async ({ job_id }) => {
      try {
        const response = await api.get(`/v1/jobs/${job_id}`);
        
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(response.data, null, 2)
          }]
        };
      } catch (error: any) {
        return {
          content: [{
            type: 'text',
            text: `Error: ${error.response?.data?.detail || error.message}`
          }]
        };
      }
    }
  );

  return server.server;
} 