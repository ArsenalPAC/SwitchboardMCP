#!/usr/bin/env node
/**
 * MCP Server generated from OpenAPI spec for switchboard vv1
 * Generated on: 2025-07-09T19:42:18.991Z
 */

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
  type CallToolResult,
  type CallToolRequest,
  InitializeRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import { setupStreamableHttpServer } from "./streamable-http.js";

import { z, ZodError } from 'zod';
import { jsonSchemaToZod } from 'json-schema-to-zod';
import axios, { type AxiosRequestConfig, type AxiosError } from 'axios';

/**
 * Type definition for JSON objects
 */
type JsonObject = Record<string, any>;

/**
 * Interface for MCP Tool Definition
 */
interface McpToolDefinition {
    name: string;
    description: string;
    inputSchema: any;
    method: string;
    pathTemplate: string;
    executionParameters: { name: string, in: string }[];
    requestBodyContentType?: string;
    securityRequirements: any[];
}

/**
 * Server configuration
 */
export const SERVER_NAME = "switchboard";
export const SERVER_VERSION = "v1";
export const API_BASE_URL = "https://api.oneswitchboard.com";

/**
 * Configuration schema for the server
 */
const configSchema = {
    type: "object",
    properties: {
        account_id: {
            type: "string",
            description: "Your Switchboard API Account ID (from https://oneswitchboard.com/organization/settings?tab=api)",
            examples: ["ac_your_account_id_here"]
        },
        secret_key: {
            type: "string",
            description: "Your Switchboard API Secret Key (from https://oneswitchboard.com/organization/settings?tab=api)",
            examples: ["sk_your_secret_key_here"]
        }
    },
    required: ["account_id", "secret_key"],
    additionalProperties: false
};

/**
 * MCP Server instance
 */
const server = new Server(
    { 
        name: SERVER_NAME, 
        version: SERVER_VERSION 
    },
    { 
        capabilities: { 
            tools: {}
        } 
    }
);

/**
 * Map of tool definitions by name
 */
const toolDefinitionMap: Map<string, McpToolDefinition> = new Map([

  ["list_broadcasts_v1_broadcasts_get", {
    name: "list_broadcasts_v1_broadcasts_get",
    description: `List Broadcasts`,
    inputSchema: {"type":"object","properties":{"cursor":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Cursor"},"requestBody":{"type":"string","description":"Request body (content type: application/json)"}}},
    method: "get",
    pathTemplate: "/v1/broadcasts",
    executionParameters: [{"name":"cursor","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["export_broadcasts_v1_broadcasts_export_post", {
    name: "export_broadcasts_v1_broadcasts_export_post",
    description: `Export the details of every broadcast your organization has created. See more information on export endpoints by reading [export endpoints](https://api.oneswitchboard.com/v1/docs#section/Export-Endpoints)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"string","description":"Request body (content type: application/json)"}}},
    method: "post",
    pathTemplate: "/v1/broadcasts/export",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["get_broadcast_v1_broadcasts__broadcast_id__get", {
    name: "get_broadcast_v1_broadcasts__broadcast_id__get",
    description: `Get Broadcast`,
    inputSchema: {"type":"object","properties":{"broadcast_id":{"type":"string","title":"The ID of the broadcast to operate on"},"requestBody":{"type":"string","description":"Request body (content type: application/json)"}},"required":["broadcast_id"]},
    method: "get",
    pathTemplate: "/v1/broadcasts/{broadcast_id}",
    executionParameters: [{"name":"broadcast_id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["get_broadcast_phone_messages_v1_broadcasts__broadcast_id__phone_messages_get", {
    name: "get_broadcast_phone_messages_v1_broadcasts__broadcast_id__phone_messages_get",
    description: `List Broadcast Phone Messages`,
    inputSchema: {"type":"object","properties":{"broadcast_id":{"type":"string","title":"The ID of the broadcast to operate on"},"cursor":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Cursor"},"requestBody":{"type":"string","description":"Request body (content type: application/json)"}},"required":["broadcast_id"]},
    method: "get",
    pathTemplate: "/v1/broadcasts/{broadcast_id}/phone_messages",
    executionParameters: [{"name":"broadcast_id","in":"path"},{"name":"cursor","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["export_messages_v1_broadcasts__broadcast_id__phone_messages_export_post", {
    name: "export_messages_v1_broadcasts__broadcast_id__phone_messages_export_post",
    description: `Export the details of each message for a given broadcast.See more information on export endpoints by reading [export endpoints](https://api.oneswitchboard.com/v1/docs#section/Export-Endpoints)`,
    inputSchema: {"type":"object","properties":{"broadcast_id":{"type":"string","title":"The ID of the broadcast to operate on"},"requestBody":{"type":"string","description":"Request body (content type: application/json)"}},"required":["broadcast_id"]},
    method: "post",
    pathTemplate: "/v1/broadcasts/{broadcast_id}/phone_messages/export",
    executionParameters: [{"name":"broadcast_id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["list_labels_v1_labels_get", {
    name: "list_labels_v1_labels_get",
    description: `List Labels`,
    inputSchema: {"type":"object","properties":{"cursor":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Cursor"},"requestBody":{"type":"string","description":"Request body (content type: application/json)"}}},
    method: "get",
    pathTemplate: "/v1/labels",
    executionParameters: [{"name":"cursor","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["create_label_v1_labels_post", {
    name: "create_label_v1_labels_post",
    description: `Create a new label for the organization. If the label already exists, it will return the existing label.`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"name":{"type":"string","title":"Name","description":"Label name (case-insensitive)","examples":["VIP","Reliable Donor"]}},"type":"object","required":["name"],"title":"LabelCreationModel","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v1/labels",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["get_label_v1_labels__label_id__get", {
    name: "get_label_v1_labels__label_id__get",
    description: `Get Label`,
    inputSchema: {"type":"object","properties":{"label_id":{"type":"string","title":"Label Id"},"requestBody":{"type":"string","description":"Request body (content type: application/json)"}},"required":["label_id"]},
    method: "get",
    pathTemplate: "/v1/labels/{label_id}",
    executionParameters: [{"name":"label_id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["edit_label_v1_labels__label_id__patch", {
    name: "edit_label_v1_labels__label_id__patch",
    description: `Edit Label`,
    inputSchema: {"type":"object","properties":{"label_id":{"type":"string","title":"Label Id"},"requestBody":{"properties":{"name":{"type":"string","title":"Name","description":"Label name (case-insensitive)","examples":["VIP","Reliable Donor"]}},"type":"object","required":["name"],"title":"LabelEditModel","description":"The JSON request body."}},"required":["label_id","requestBody"]},
    method: "patch",
    pathTemplate: "/v1/labels/{label_id}",
    executionParameters: [{"name":"label_id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["list_email_blasts_v1_email_blasts_get", {
    name: "list_email_blasts_v1_email_blasts_get",
    description: `List Email Blasts`,
    inputSchema: {"type":"object","properties":{"cursor":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Cursor"},"requestBody":{"type":"string","description":"Request body (content type: application/json)"}}},
    method: "get",
    pathTemplate: "/v1/email_blasts",
    executionParameters: [{"name":"cursor","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["export_blasts_v1_email_blasts_export_post", {
    name: "export_blasts_v1_email_blasts_export_post",
    description: `Export the details of every email blast your organization has created. See more information on export endpoints by reading [export endpoints](https://api.oneswitchboard.com/v1/docs#section/Export-Endpoints)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"string","description":"Request body (content type: application/json)"}}},
    method: "post",
    pathTemplate: "/v1/email_blasts/export",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["get_email_blast_v1_email_blasts__blast_id__get", {
    name: "get_email_blast_v1_email_blasts__blast_id__get",
    description: `Get Email Blast`,
    inputSchema: {"type":"object","properties":{"blast_id":{"type":"string","title":"The ID of the email_blast to operate on"},"requestBody":{"type":"string","description":"Request body (content type: application/json)"}},"required":["blast_id"]},
    method: "get",
    pathTemplate: "/v1/email_blasts/{blast_id}",
    executionParameters: [{"name":"blast_id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["get_email_blast_messages_v1_email_blasts__blast_id__email_messages_get", {
    name: "get_email_blast_messages_v1_email_blasts__blast_id__email_messages_get",
    description: `List Email Blast Messages`,
    inputSchema: {"type":"object","properties":{"blast_id":{"type":"string","title":"The ID of the email_blast to operate on"},"cursor":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Cursor"},"requestBody":{"type":"string","description":"Request body (content type: application/json)"}},"required":["blast_id"]},
    method: "get",
    pathTemplate: "/v1/email_blasts/{blast_id}/email_messages",
    executionParameters: [{"name":"blast_id","in":"path"},{"name":"cursor","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["Export_Email_Blast_Messages_v1_email_blasts__blast_id__email_messages_export_post", {
    name: "Export_Email_Blast_Messages_v1_email_blasts__blast_id__email_messages_export_post",
    description: `Export the details of each message for a given email blast. See more information on export endpoints by reading [export endpoints](https://api.oneswitchboard.com/v1/docs#section/Export-Endpoints)`,
    inputSchema: {"type":"object","properties":{"blast_id":{"type":"string","title":"The ID of the email_blast to operate on"},"requestBody":{"type":"string","description":"Request body (content type: application/json)"}},"required":["blast_id"]},
    method: "post",
    pathTemplate: "/v1/email_blasts/{blast_id}/email_messages/export",
    executionParameters: [{"name":"blast_id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["list_email_lists_v1_email_lists_get", {
    name: "list_email_lists_v1_email_lists_get",
    description: `List Email Lists`,
    inputSchema: {"type":"object","properties":{"cursor":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Cursor"},"requestBody":{"type":"string","description":"Request body (content type: application/json)"}}},
    method: "get",
    pathTemplate: "/v1/email_lists",
    executionParameters: [{"name":"cursor","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["create_email_list_v1_email_lists_post", {
    name: "create_email_list_v1_email_lists_post",
    description: `Create Email List`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"resource_url":{"type":"string","minLength":1,"format":"uri","title":"Resource Url"},"fields_to_headers":{"properties":{"email_address":{"type":"string","title":"Email Address"},"phone_number":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Phone Number"},"first_name":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"First Name"},"middle_name":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Middle Name"},"last_name":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Last Name"},"full_name":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Full Name"},"preferred_name":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Preferred Name"},"zip_code":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Zip Code"},"state_abbr":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"State Abbr"},"custom_source":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Custom Source"},"custom_id":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Custom Id"},"custom_score":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Custom Score"}},"type":"object","required":["email_address"],"title":"EmailListFieldsToHeadersInput"},"name":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Name"},"description":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Description","default":""},"label_names":{"anyOf":[{"items":{"type":"string"},"type":"array"},{"type":"null"}],"title":"Label Names","description":"List of label names (case insensitive) to add to emails in the list. Labels will be created if they do not exist. This will not remove any labels that were previously attached to the email addresses.","examples":["VIP","Customer"]},"label_ids":{"anyOf":[{"items":{"type":"string"},"type":"array"},{"type":"null"}],"title":"Label Ids","description":"List of label IDs to add to the email addresses in the list.","examples":["lb_01js07n5jweh80zz4wzt0j60m5","lb_01jsyxs2d7qt41vmewcypmhkbx"]}},"type":"object","required":["resource_url","fields_to_headers"],"title":"EmailListCreationModel","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v1/email_lists",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["get_email_list_v1_email_lists__email_list_id__get", {
    name: "get_email_list_v1_email_lists__email_list_id__get",
    description: `Get Email List`,
    inputSchema: {"type":"object","properties":{"email_list_id":{"type":"string","title":"The ID of the email_list to operate on"},"requestBody":{"type":"string","description":"Request body (content type: application/json)"}},"required":["email_list_id"]},
    method: "get",
    pathTemplate: "/v1/email_lists/{email_list_id}",
    executionParameters: [{"name":"email_list_id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["export_email_list_v1_email_lists__email_list_id__export_post", {
    name: "export_email_list_v1_email_lists__email_list_id__export_post",
    description: `Export Email List`,
    inputSchema: {"type":"object","properties":{"email_list_id":{"type":"string","title":"The ID of the email_list to operate on"},"requestBody":{"type":"string","description":"Request body (content type: application/json)"}},"required":["email_list_id"]},
    method: "post",
    pathTemplate: "/v1/email_lists/{email_list_id}/export",
    executionParameters: [{"name":"email_list_id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["update_labels_v1_email_lists__email_list_id__update_labels_post", {
    name: "update_labels_v1_email_lists__email_list_id__update_labels_post",
    description: `Update Labels`,
    inputSchema: {"type":"object","properties":{"email_list_id":{"type":"string","title":"The ID of the email_list to operate on"},"requestBody":{"properties":{"action":{"anyOf":[{"type":"string","enum":["add"],"const":"add"},{"type":"string","enum":["remove"],"const":"remove"}],"title":"Action","description":"Action to perform on the labels for this resource. Can be 'add' or 'remove'.","examples":["add","remove"]},"label_ids":{"anyOf":[{"items":{"type":"string"},"type":"array"},{"type":"null"}],"title":"Label Ids","description":"List of label IDs to add/remove.","examples":["lb_01js07n5jweh80zz4wzt0j60m5","lb_01jsyxs2d7qt41vmewcypmhkbx"]},"label_names":{"anyOf":[{"items":{"type":"string"},"type":"array"},{"type":"null"}],"title":"Label Names","description":"List of label names (case insensitive) to add or remove. When adding, labels will be created if they do not exist.","examples":["VIP","Customer"]}},"type":"object","required":["action"],"title":"UpdateLabelsInputModel","description":"The JSON request body."}},"required":["email_list_id","requestBody"]},
    method: "post",
    pathTemplate: "/v1/email_lists/{email_list_id}/update_labels",
    executionParameters: [{"name":"email_list_id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["list_emails_v1_emails_get", {
    name: "list_emails_v1_emails_get",
    description: `List Emails`,
    inputSchema: {"type":"object","properties":{"cursor":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Cursor"},"requestBody":{"type":"string","description":"Request body (content type: application/json)"}}},
    method: "get",
    pathTemplate: "/v1/emails",
    executionParameters: [{"name":"cursor","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["create_email_v1_emails_post", {
    name: "create_email_v1_emails_post",
    description: `Create Email`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"email_address":{"type":"string","title":"Email Address","description":"An email address","examples":["jdoe@example.com"]},"phone_number":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Phone Number","description":"A phone number known to be connected to this email","examples":["+12345552368"]},"first_name":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"First Name","description":"The first name associated with the email address","examples":["Ada"]},"middle_name":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Middle Name","description":"The middle name associated with the email address","examples":[null]},"last_name":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Last Name","description":"The last name associated with the email address","examples":["Gordon"]},"full_name":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Full Name","description":"Combination of primary, middle and surname(s)","examples":["Jane Kate Does"]},"preferred_name":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Preferred Name","description":"The preferred name associated with the email address","examples":["Ada Lovelace"]},"zip_code":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Zip Code","description":"US Zip Code","examples":["12345"]},"state_abbr":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"State Abbr","description":"US 2 letter state abbreviation","examples":["MD"]},"custom_source":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Custom Source","description":"The custom source associated with the email address","examples":["SOME_LIST_SOURCE"]},"custom_id":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Custom Id","description":"The custom id associated with the email address","examples":["123456"]},"custom_score":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Custom Score","description":"The custom score associated with the email address","examples":[20]},"created_at":{"anyOf":[{"type":"string","format":"date-time"},{"type":"null"}],"title":"Created At","description":"The datetime when the email was created"},"label_names":{"anyOf":[{"items":{"type":"string"},"type":"array"},{"type":"null"}],"title":"Label Names","description":"List of label names (case insensitive) to add to the email address. Labels will be created if they do not exist. This will not remove any labels that were previously attached to the phone number.","examples":["VIP","Customer"]},"label_ids":{"anyOf":[{"items":{"type":"string"},"type":"array"},{"type":"null"}],"title":"Label Ids","description":"List of label IDs to add to the email address.","examples":["lb_01js07n5jweh80zz4wzt0j60m5","lb_01jsyxs2d7qt41vmewcypmhkbx"]}},"type":"object","required":["email_address"],"title":"EmailCreationModel","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v1/emails",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["update_labels_v1_emails_update_labels_post", {
    name: "update_labels_v1_emails_update_labels_post",
    description: `Update Labels`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"action":{"anyOf":[{"type":"string","enum":["add"],"const":"add"},{"type":"string","enum":["remove"],"const":"remove"}],"title":"Action","description":"Action to perform on the labels for this resource. Can be 'add' or 'remove'.","examples":["add","remove"]},"label_ids":{"anyOf":[{"items":{"type":"string"},"type":"array"},{"type":"null"}],"title":"Label Ids","description":"List of label IDs to add/remove.","examples":["lb_01js07n5jweh80zz4wzt0j60m5","lb_01jsyxs2d7qt41vmewcypmhkbx"]},"label_names":{"anyOf":[{"items":{"type":"string"},"type":"array"},{"type":"null"}],"title":"Label Names","description":"List of label names (case insensitive) to add or remove. When adding, labels will be created if they do not exist.","examples":["VIP","Customer"]},"email_address":{"type":"string","title":"Email Address","description":"An email address","examples":["jdoe@example.com"]}},"type":"object","required":["action","email_address"],"title":"UpdateEmailLabelsInputModel","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v1/emails/update_labels",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["export_emails_v1_emails_export_post", {
    name: "export_emails_v1_emails_export_post",
    description: `Export the details of every email address your organization has created. See more information on export endpoints by reading [export endpoints](https://api.oneswitchboard.com/v1/docs#section/Export-Endpoints)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"string","description":"Request body (content type: application/json)"}}},
    method: "post",
    pathTemplate: "/v1/emails/export",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["export_inbox_v1_inbox_export_post", {
    name: "export_inbox_v1_inbox_export_post",
    description: `Export the details of every inbox message your organization has received. See more information on export endpoints by reading [export endpoints](https://api.oneswitchboard.com/v1/docs#section/Export-Endpoints)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"has_replied":{"type":"boolean","title":"","description":"Filter to responses where user has replied","default":true},"include_outgoing":{"type":"boolean","title":"","description":"Include messages sent to customer","default":false},"is_reply_needed":{"type":"boolean","title":"","description":"Only include messages where customer is awaiting response","default":true},"config":{"allOf":[{"properties":{"include_reply_needed":{"type":"boolean","title":"","description":"Include a column stating whether a reply is needed","default":true},"include_time":{"type":"boolean","title":"","description":"Include a column with the time the text was received","default":true},"include_opted_out":{"type":"boolean","title":"","description":"Include a column stating whether the contact opted out","default":true},"include_phone_type":{"type":"boolean","title":"","description":"Include a column with the contact's phone type","default":true},"include_van_id":{"type":"boolean","title":"","description":"Include columns with the contact's NGPVAN IDs","default":true},"include_contact_labels":{"type":"boolean","title":"","description":"Include columns with the contact's associated labels","default":false},"include_carrier_info":{"type":"boolean","title":"","description":"Include a columns with the contact's carrier info","default":false},"reusable_fields_to_include":{"items":{"type":"string"},"type":"array","title":"","description":"A list of reusable fields to include as columns","default":[]},"include_list_fields":{"type":"boolean","title":"","description":"Include columns for list fields","default":false},"list_fields_start_date":{"anyOf":[{"type":"string","format":"date"},{"type":"null"}],"title":"","description":"Include list field columns only starting with the provided date"},"list_fields_end_date":{"anyOf":[{"type":"string","format":"date"},{"type":"null"}],"title":"","description":"Include list field columns ending at the provided date"}},"type":"object","title":"InboxExportConfigModel"}],"title":"config","description":"Defines which columns to include in the export","default":{"include_reply_needed":true,"include_time":true,"include_opted_out":true,"include_phone_type":true,"include_van_id":true,"include_contact_labels":false,"include_carrier_info":false,"reusable_fields_to_include":[],"include_list_fields":false}}},"type":"object","title":"InboxExportParametersModel","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v1/inbox/export",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["get_jobs_v1_jobs__get", {
    name: "get_jobs_v1_jobs__get",
    description: `List Jobs`,
    inputSchema: {"type":"object","properties":{"type":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Type"},"cursor":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Cursor"},"requestBody":{"type":"string","description":"Request body (content type: application/json)"}}},
    method: "get",
    pathTemplate: "/v1/jobs/",
    executionParameters: [{"name":"type","in":"query"},{"name":"cursor","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["get_job_v1_jobs__job_id__get", {
    name: "get_job_v1_jobs__job_id__get",
    description: `Get Job`,
    inputSchema: {"type":"object","properties":{"job_id":{"type":"string","title":"The ID of the async job to operate on"},"requestBody":{"type":"string","description":"Request body (content type: application/json)"}},"required":["job_id"]},
    method: "get",
    pathTemplate: "/v1/jobs/{job_id}",
    executionParameters: [{"name":"job_id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["list_phone_lists_v1_phone_lists_get", {
    name: "list_phone_lists_v1_phone_lists_get",
    description: `List Phone Lists`,
    inputSchema: {"type":"object","properties":{"cursor":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Cursor"},"requestBody":{"type":"string","description":"Request body (content type: application/json)"}}},
    method: "get",
    pathTemplate: "/v1/phone_lists",
    executionParameters: [{"name":"cursor","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["create_phone_list_v1_phone_lists_post", {
    name: "create_phone_list_v1_phone_lists_post",
    description: `Create Phone List`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"resource_url":{"type":"string","minLength":1,"format":"uri","title":"Resource Url"},"fields_to_headers":{"properties":{"phone_number":{"type":"string","title":"Phone Number"},"email_address":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Email Address"},"first_name":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"First Name"},"middle_name":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Middle Name"},"last_name":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Last Name"},"full_name":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Full Name"},"preferred_name":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Preferred Name"},"zip_code":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Zip Code"},"state_abbr":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"State Abbr"},"custom_source":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Custom Source"},"custom_id":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Custom Id"},"custom_score":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Custom Score"}},"type":"object","required":["phone_number"],"title":"FieldsToHeadersInput"},"name":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Name"},"description":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Description","default":""},"label_names":{"anyOf":[{"items":{"type":"string"},"type":"array"},{"type":"null"}],"title":"Label Names","description":"List of label names (case insensitive) to add to phones in the list. Labels will be created if they do not exist. This will not remove any labels that were previously attached to the phone numbers.","examples":["VIP","Customer"]},"label_ids":{"anyOf":[{"items":{"type":"string"},"type":"array"},{"type":"null"}],"title":"Label Ids","description":"List of label IDs to add to the phone numbers in the list.","examples":["lb_01js07n5jweh80zz4wzt0j60m5","lb_01jsyxs2d7qt41vmewcypmhkbx"]}},"type":"object","required":["resource_url","fields_to_headers"],"title":"PhoneListCreationModel","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v1/phone_lists",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["get_phone_list_v1_phone_lists__phone_list_id__get", {
    name: "get_phone_list_v1_phone_lists__phone_list_id__get",
    description: `Get Phone List`,
    inputSchema: {"type":"object","properties":{"phone_list_id":{"type":"string","title":"The ID of the phone_list to operate on"},"requestBody":{"type":"string","description":"Request body (content type: application/json)"}},"required":["phone_list_id"]},
    method: "get",
    pathTemplate: "/v1/phone_lists/{phone_list_id}",
    executionParameters: [{"name":"phone_list_id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["export_phone_list_v1_phone_lists__phone_list_id__export_post", {
    name: "export_phone_list_v1_phone_lists__phone_list_id__export_post",
    description: `Export Phone List`,
    inputSchema: {"type":"object","properties":{"phone_list_id":{"type":"string","title":"The ID of the phone_list to operate on"},"requestBody":{"type":"string","description":"Request body (content type: application/json)"}},"required":["phone_list_id"]},
    method: "post",
    pathTemplate: "/v1/phone_lists/{phone_list_id}/export",
    executionParameters: [{"name":"phone_list_id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["update_labels_v1_phone_lists__phone_list_id__update_labels_post", {
    name: "update_labels_v1_phone_lists__phone_list_id__update_labels_post",
    description: `Update Labels`,
    inputSchema: {"type":"object","properties":{"phone_list_id":{"type":"string","title":"The ID of the phone_list to operate on"},"requestBody":{"properties":{"action":{"anyOf":[{"type":"string","enum":["add"],"const":"add"},{"type":"string","enum":["remove"],"const":"remove"}],"title":"Action","description":"Action to perform on the labels for this resource. Can be 'add' or 'remove'.","examples":["add","remove"]},"label_ids":{"anyOf":[{"items":{"type":"string"},"type":"array"},{"type":"null"}],"title":"Label Ids","description":"List of label IDs to add/remove.","examples":["lb_01js07n5jweh80zz4wzt0j60m5","lb_01jsyxs2d7qt41vmewcypmhkbx"]},"label_names":{"anyOf":[{"items":{"type":"string"},"type":"array"},{"type":"null"}],"title":"Label Names","description":"List of label names (case insensitive) to add or remove. When adding, labels will be created if they do not exist.","examples":["VIP","Customer"]}},"type":"object","required":["action"],"title":"UpdateLabelsInputModel","description":"The JSON request body."}},"required":["phone_list_id","requestBody"]},
    method: "post",
    pathTemplate: "/v1/phone_lists/{phone_list_id}/update_labels",
    executionParameters: [{"name":"phone_list_id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["list_phones_v1_phones_get", {
    name: "list_phones_v1_phones_get",
    description: `List Phones`,
    inputSchema: {"type":"object","properties":{"cursor":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Cursor"},"requestBody":{"type":"string","description":"Request body (content type: application/json)"}}},
    method: "get",
    pathTemplate: "/v1/phones",
    executionParameters: [{"name":"cursor","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["create_phone_v1_phones_post", {
    name: "create_phone_v1_phones_post",
    description: `Create Phone`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"phone_number":{"type":"string","title":"Phone Number","description":"E.164 Formatted number","examples":["+12345552368"]},"email_address":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Email Address","description":"An email address known to be connected to this phone","examples":["jdoe@example.com"]},"first_name":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"First Name","description":"The first name associated with the phone","examples":["Jane"]},"middle_name":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Middle Name","description":"The middle name associated with the phone","examples":["Kate"]},"last_name":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Last Name","description":"The last name associated with the phone","examples":["Doe"]},"full_name":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Full Name","description":"Combination of primary, middle and surname(s)","examples":["Jane Kate Does"]},"preferred_name":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Preferred Name","description":"The preferred name associated with the phone","examples":["Janey"]},"zip_code":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Zip Code","description":"US Zip Code","examples":["12345"]},"state_abbr":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"State Abbr","description":"US 2 letter state abbreviation","examples":["MD"]},"custom_source":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Custom Source","description":"A custom source associated with the phone","examples":["donation-form-a"]},"custom_id":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Custom Id","description":"A unique identifier associated with the phone","examples":["US_12_AB_34"]},"custom_score":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Custom Score","description":"A custom score associated with the phone","examples":["190"]},"label_names":{"anyOf":[{"items":{"type":"string"},"type":"array"},{"type":"null"}],"title":"Label Names","description":"List of label names (case insensitive) to add to the phone number. Labels will be created if they do not exist. This will not remove any labels that were previously attached to the phone number.","examples":["VIP","Customer"]},"label_ids":{"anyOf":[{"items":{"type":"string"},"type":"array"},{"type":"null"}],"title":"Label Ids","description":"List of label IDs to add to the phone number.","examples":["lb_01js07n5jweh80zz4wzt0j60m5","lb_01jsyxs2d7qt41vmewcypmhkbx"]}},"type":"object","required":["phone_number"],"title":"PhoneCreationModel","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v1/phones",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["update_labels_v1_phones_update_labels_post", {
    name: "update_labels_v1_phones_update_labels_post",
    description: `Update Labels`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"action":{"anyOf":[{"type":"string","enum":["add"],"const":"add"},{"type":"string","enum":["remove"],"const":"remove"}],"title":"Action","description":"Action to perform on the labels for this resource. Can be 'add' or 'remove'.","examples":["add","remove"]},"label_ids":{"anyOf":[{"items":{"type":"string"},"type":"array"},{"type":"null"}],"title":"Label Ids","description":"List of label IDs to add/remove.","examples":["lb_01js07n5jweh80zz4wzt0j60m5","lb_01jsyxs2d7qt41vmewcypmhkbx"]},"label_names":{"anyOf":[{"items":{"type":"string"},"type":"array"},{"type":"null"}],"title":"Label Names","description":"List of label names (case insensitive) to add or remove. When adding, labels will be created if they do not exist.","examples":["VIP","Customer"]},"phone_number":{"type":"string","title":"Phone Number","description":"E.164 Formatted number. Phone number must already exist in the system.","examples":["+12345552368"]}},"type":"object","required":["action","phone_number"],"title":"UpdatePhoneLabelsInputModel","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v1/phones/update_labels",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["export_phones_v1_phones_export_post", {
    name: "export_phones_v1_phones_export_post",
    description: `Export the details of each phone number your organization has created. See more information on export endpoints by reading [export endpoints](https://api.oneswitchboard.com/v1/docs#section/Export-Endpoints)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"string","description":"Request body (content type: application/json)"}}},
    method: "post",
    pathTemplate: "/v1/phones/export",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
  ["whoami_v1_whoami_get", {
    name: "whoami_v1_whoami_get",
    description: `This endpoint returns data on the current credential. Use it to validate you have the correct permissions.`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"string","description":"Request body (content type: application/json)"}}},
    method: "get",
    pathTemplate: "/v1/whoami",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"HTTPBasic":[]}]
  }],
]);

/**
 * Security schemes from the OpenAPI spec
 */
const securitySchemes =   {
    "HTTPBasic": {
      "type": "http",
      "scheme": "basic"
    }
  };

// Add handler for configuration requests
server.setRequestHandler(ListToolsRequestSchema, async () => {
  // Return tools without requiring authentication
  // This allows Smithery to scan tools during deployment
  const toolsForClient: Tool[] = Array.from(toolDefinitionMap.values()).map(def => ({
    name: def.name,
    description: def.description,
    inputSchema: def.inputSchema
  }));
  return { tools: toolsForClient };
});

// Add initialization handler
server.setRequestHandler(InitializeRequestSchema, async (request) => {
  console.error('Initialize request received:', JSON.stringify(request.params));
  
  // Check if required configuration is present
  const hasConfig = process.env['BASIC_USERNAME_HTTPBASIC'] && process.env['BASIC_PASSWORD_HTTPBASIC'];
  if (!hasConfig) {
    console.error('Warning: No authentication credentials configured. API calls will fail.');
  }
  
  return {
    protocolVersion: "2024-11-05",
    capabilities: { 
      tools: {}
    },
    serverInfo: {
      name: SERVER_NAME,
      version: SERVER_VERSION
    }
  };
});


server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest): Promise<CallToolResult> => {
  const { name: toolName, arguments: toolArgs } = request.params;
  const toolDefinition = toolDefinitionMap.get(toolName);
  if (!toolDefinition) {
    console.error(`Error: Unknown tool requested: ${toolName}`);
    return { content: [{ type: "text", text: `Error: Unknown tool requested: ${toolName}` }] };
  }
  return await executeApiTool(toolName, toolDefinition, toolArgs ?? {}, securitySchemes);
});


/**
 * Type definition for cached OAuth tokens
 */
interface TokenCacheEntry {
    token: string;
    expiresAt: number;
}

/**
 * Declare global __oauthTokenCache property for TypeScript
 */
declare global {
    var __oauthTokenCache: Record<string, TokenCacheEntry> | undefined;
}

/**
 * Acquires an OAuth2 token using client credentials flow
 * 
 * @param schemeName Name of the security scheme
 * @param scheme OAuth2 security scheme
 * @returns Acquired token or null if unable to acquire
 */
async function acquireOAuth2Token(schemeName: string, scheme: any): Promise<string | null | undefined> {
    try {
        // Check if we have the necessary credentials
        const clientId = process.env[`OAUTH_CLIENT_ID_SCHEMENAME`];
        const clientSecret = process.env[`OAUTH_CLIENT_SECRET_SCHEMENAME`];
        const scopes = process.env[`OAUTH_SCOPES_SCHEMENAME`];
        
        if (!clientId || !clientSecret) {
            console.error(`Missing client credentials for OAuth2 scheme '${schemeName}'`);
            return null;
        }
        
        // Initialize token cache if needed
        if (typeof global.__oauthTokenCache === 'undefined') {
            global.__oauthTokenCache = {};
        }
        
        // Check if we have a cached token
        const cacheKey = `${schemeName}_${clientId}`;
        const cachedToken = global.__oauthTokenCache[cacheKey];
        const now = Date.now();
        
        if (cachedToken && cachedToken.expiresAt > now) {
            console.error(`Using cached OAuth2 token for '${schemeName}' (expires in ${Math.floor((cachedToken.expiresAt - now) / 1000)} seconds)`);
            return cachedToken.token;
        }
        
        // Determine token URL based on flow type
        let tokenUrl = '';
        if (scheme.flows?.clientCredentials?.tokenUrl) {
            tokenUrl = scheme.flows.clientCredentials.tokenUrl;
            console.error(`Using client credentials flow for '${schemeName}'`);
        } else if (scheme.flows?.password?.tokenUrl) {
            tokenUrl = scheme.flows.password.tokenUrl;
            console.error(`Using password flow for '${schemeName}'`);
        } else {
            console.error(`No supported OAuth2 flow found for '${schemeName}'`);
            return null;
        }
        
        // Prepare the token request
        let formData = new URLSearchParams();
        formData.append('grant_type', 'client_credentials');
        
        // Add scopes if specified
        if (scopes) {
            formData.append('scope', scopes);
        }
        
        console.error(`Requesting OAuth2 token from ${tokenUrl}`);
        
        // Make the token request
        const response = await axios({
            method: 'POST',
            url: tokenUrl,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
            },
            data: formData.toString()
        });
        
        // Process the response
        if (response.data?.access_token) {
            const token = response.data.access_token;
            const expiresIn = response.data.expires_in || 3600; // Default to 1 hour
            
            // Cache the token
            global.__oauthTokenCache[cacheKey] = {
                token,
                expiresAt: now + (expiresIn * 1000) - 60000 // Expire 1 minute early
            };
            
            console.error(`Successfully acquired OAuth2 token for '${schemeName}' (expires in ${expiresIn} seconds)`);
            return token;
        } else {
            console.error(`Failed to acquire OAuth2 token for '${schemeName}': No access_token in response`);
            return null;
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error acquiring OAuth2 token for '${schemeName}':`, errorMessage);
        return null;
    }
}


/**
 * Executes an API tool with the provided arguments
 * 
 * @param toolName Name of the tool to execute
 * @param definition Tool definition
 * @param toolArgs Arguments provided by the user
 * @param allSecuritySchemes Security schemes from the OpenAPI spec
 * @returns Call tool result
 */
async function executeApiTool(
    toolName: string,
    definition: McpToolDefinition,
    toolArgs: JsonObject,
    allSecuritySchemes: Record<string, any>
): Promise<CallToolResult> {
  try {
    // Validate arguments against the input schema
    let validatedArgs: JsonObject;
    try {
        const zodSchema = getZodSchemaFromJsonSchema(definition.inputSchema, toolName);
        const argsToParse = (typeof toolArgs === 'object' && toolArgs !== null) ? toolArgs : {};
        validatedArgs = zodSchema.parse(argsToParse);
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            const validationErrorMessage = `Invalid arguments for tool '${toolName}': ${error.errors.map(e => `${e.path.join('.')} (${e.code}): ${e.message}`).join(', ')}`;
            return { content: [{ type: 'text', text: validationErrorMessage }] };
        } else {
             const errorMessage = error instanceof Error ? error.message : String(error);
             return { content: [{ type: 'text', text: `Internal error during validation setup: ${errorMessage}` }] };
        }
    }

    // Prepare URL, query parameters, headers, and request body
    let urlPath = definition.pathTemplate;
    const queryParams: Record<string, any> = {};
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    let requestBodyData: any = undefined;

    // Apply parameters to the URL path, query, or headers
    definition.executionParameters.forEach((param) => {
        const value = validatedArgs[param.name];
        if (typeof value !== 'undefined' && value !== null) {
            if (param.in === 'path') {
                urlPath = urlPath.replace(`{${param.name}}`, encodeURIComponent(String(value)));
            }
            else if (param.in === 'query') {
                queryParams[param.name] = value;
            }
            else if (param.in === 'header') {
                headers[param.name.toLowerCase()] = String(value);
            }
        }
    });

    // Ensure all path parameters are resolved
    if (urlPath.includes('{')) {
        throw new Error(`Failed to resolve path parameters: ${urlPath}`);
    }
    
    // Construct the full URL
    const requestUrl = API_BASE_URL ? `${API_BASE_URL}${urlPath}` : urlPath;

    // Handle request body if needed
    if (definition.requestBodyContentType && typeof validatedArgs['requestBody'] !== 'undefined') {
        requestBodyData = validatedArgs['requestBody'];
        headers['content-type'] = definition.requestBodyContentType;
    }


    // Apply security requirements if available
    // Security requirements use OR between array items and AND within each object
    const appliedSecurity = definition.securityRequirements?.find(req => {
        // Try each security requirement (combined with OR)
        return Object.entries(req).every(([schemeName, scopesArray]) => {
            const scheme = allSecuritySchemes[schemeName];
            if (!scheme) return false;
            
            // API Key security (header, query, cookie)
            if (scheme.type === 'apiKey') {
                return !!process.env[`API_KEY_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
            }
            
            // HTTP security (basic, bearer)
            if (scheme.type === 'http') {
                if (scheme.scheme?.toLowerCase() === 'bearer') {
                    return !!process.env[`BEARER_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                }
                else if (scheme.scheme?.toLowerCase() === 'basic') {
                    // Check for Smithery-mapped environment variables first
                    if (process.env['BASIC_USERNAME_HTTPBASIC'] && process.env['BASIC_PASSWORD_HTTPBASIC']) {
                        return true;
                    }
                    // Fall back to standard environment variables
                    return !!process.env[`BASIC_USERNAME_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`] && 
                           !!process.env[`BASIC_PASSWORD_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                }
            }
            
            // OAuth2 security
            if (scheme.type === 'oauth2') {
                // Check for pre-existing token
                if (process.env[`OAUTH_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`]) {
                    return true;
                }
                
                // Check for client credentials for auto-acquisition
                if (process.env[`OAUTH_CLIENT_ID_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`] &&
                    process.env[`OAUTH_CLIENT_SECRET_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`]) {
                    // Verify we have a supported flow
                    if (scheme.flows?.clientCredentials || scheme.flows?.password) {
                        return true;
                    }
                }
                
                return false;
            }
            
            // OpenID Connect
            if (scheme.type === 'openIdConnect') {
                return !!process.env[`OPENID_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
            }
            
            return false;
        });
    });

    // If we found matching security scheme(s), apply them
    if (appliedSecurity) {
        // Apply each security scheme from this requirement (combined with AND)
        for (const [schemeName, scopesArray] of Object.entries(appliedSecurity)) {
            const scheme = allSecuritySchemes[schemeName];
            
            // API Key security
            if (scheme?.type === 'apiKey') {
                const apiKey = process.env[`API_KEY_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                if (apiKey) {
                    if (scheme.in === 'header') {
                        headers[scheme.name.toLowerCase()] = apiKey;
                        console.error(`Applied API key '${schemeName}' in header '${scheme.name}'`);
                    }
                    else if (scheme.in === 'query') {
                        queryParams[scheme.name] = apiKey;
                        console.error(`Applied API key '${schemeName}' in query parameter '${scheme.name}'`);
                    }
                    else if (scheme.in === 'cookie') {
                        // Add the cookie, preserving other cookies if they exist
                        headers['cookie'] = `${scheme.name}=${apiKey}${headers['cookie'] ? `; ${headers['cookie']}` : ''}`;
                        console.error(`Applied API key '${schemeName}' in cookie '${scheme.name}'`);
                    }
                }
            } 
            // HTTP security (Bearer or Basic)
            else if (scheme?.type === 'http') {
                if (scheme.scheme?.toLowerCase() === 'bearer') {
                    const token = process.env[`BEARER_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                    if (token) {
                        headers['authorization'] = `Bearer ${token}`;
                        console.error(`Applied Bearer token for '${schemeName}'`);
                    }
                } 
                else if (scheme.scheme?.toLowerCase() === 'basic') {
                    let username = process.env['BASIC_USERNAME_HTTPBASIC'];
                    let password = process.env['BASIC_PASSWORD_HTTPBASIC'];
                    
                    // Fall back to standard environment variables if not configured
                    if (!username || !password) {
                        username = process.env[`BASIC_USERNAME_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                        password = process.env[`BASIC_PASSWORD_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                    }
                    
                    if (username && password) {
                        headers['authorization'] = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
                        console.error(`Applied Basic authentication for '${schemeName}'`);
                    }
                }
            }
            // OAuth2 security
            else if (scheme?.type === 'oauth2') {
                // First try to use a pre-provided token
                let token = process.env[`OAUTH_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                
                // If no token but we have client credentials, try to acquire a token
                if (!token && (scheme.flows?.clientCredentials || scheme.flows?.password)) {
                    console.error(`Attempting to acquire OAuth token for '${schemeName}'`);
                    token = (await acquireOAuth2Token(schemeName, scheme)) ?? '';
                }
                
                // Apply token if available
                if (token) {
                    headers['authorization'] = `Bearer ${token}`;
                    console.error(`Applied OAuth2 token for '${schemeName}'`);
                    
                    // List the scopes that were requested, if any
                    const scopes = scopesArray as string[];
                    if (scopes && scopes.length > 0) {
                        console.error(`Requested scopes: ${scopes.join(', ')}`);
                    }
                }
            }
            // OpenID Connect
            else if (scheme?.type === 'openIdConnect') {
                const token = process.env[`OPENID_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                if (token) {
                    headers['authorization'] = `Bearer ${token}`;
                    console.error(`Applied OpenID Connect token for '${schemeName}'`);
                    
                    // List the scopes that were requested, if any
                    const scopes = scopesArray as string[];
                    if (scopes && scopes.length > 0) {
                        console.error(`Requested scopes: ${scopes.join(', ')}`);
                    }
                }
            }
        }
    } 
    // Log warning if security is required but not available
    else if (definition.securityRequirements?.length > 0) {
        // First generate a more readable representation of the security requirements
        const securityRequirementsString = definition.securityRequirements
            .map(req => {
                const parts = Object.entries(req)
                    .map(([name, scopesArray]) => {
                        const scopes = scopesArray as string[];
                        if (scopes.length === 0) return name;
                        return `${name} (scopes: ${scopes.join(', ')})`;
                    })
                    .join(' AND ');
                return `[${parts}]`;
            })
            .join(' OR ');
            
        console.warn(`Tool '${toolName}' requires security: ${securityRequirementsString}, but no suitable credentials found.`);
    }
    

    // Prepare the axios request configuration
    const config: AxiosRequestConfig = {
      method: definition.method.toUpperCase(), 
      url: requestUrl, 
      params: queryParams, 
      headers: headers,
      ...(requestBodyData !== undefined && { data: requestBodyData }),
    };

    // Log request info to stderr (doesn't affect MCP output)
    console.error(`Executing tool "${toolName}": ${config.method} ${config.url}`);
    
    // Execute the request
    const response = await axios(config);

    // Process and format the response
    let responseText = '';
    const contentType = response.headers['content-type']?.toLowerCase() || '';
    
    // Handle JSON responses
    if (contentType.includes('application/json') && typeof response.data === 'object' && response.data !== null) {
         try { 
             responseText = JSON.stringify(response.data, null, 2); 
         } catch (e) { 
             responseText = "[Stringify Error]"; 
         }
    } 
    // Handle string responses
    else if (typeof response.data === 'string') { 
         responseText = response.data; 
    }
    // Handle other response types
    else if (response.data !== undefined && response.data !== null) { 
         responseText = String(response.data); 
    }
    // Handle empty responses
    else { 
         responseText = `(Status: ${response.status} - No body content)`; 
    }
    
    // Return formatted response
    return { 
        content: [ 
            { 
                type: "text", 
                text: `API Response (Status: ${response.status}):\n${responseText}` 
            } 
        ], 
    };

  } catch (error: unknown) {
    // Handle errors during execution
    let errorMessage: string;
    
    // Format Axios errors specially
    if (axios.isAxiosError(error)) { 
        errorMessage = formatApiError(error); 
    }
    // Handle standard errors
    else if (error instanceof Error) { 
        errorMessage = error.message; 
    }
    // Handle unexpected error types
    else { 
        errorMessage = 'Unexpected error: ' + String(error); 
    }
    
    // Log error to stderr
    console.error(`Error during execution of tool '${toolName}':`, errorMessage);
    
    // Return error message to client
    return { content: [{ type: "text", text: errorMessage }] };
  }
}

/**
 * Main function to start the server
 */
async function main() {
  // Check command line arguments to determine transport
  const args = process.argv.slice(2);
  const transportIndex = args.findIndex(arg => arg === '--transport' || arg === '-t');
  const transport = transportIndex !== -1 && args[transportIndex + 1] ? args[transportIndex + 1] : 'stdio';

  if (transport === 'streamable-http') {
    // Set up StreamableHTTP transport
    try {
      await setupStreamableHttpServer(server, 3000);
    } catch (error) {
      console.error("Error setting up StreamableHTTP server:", error);
      process.exit(1);
    }
  } else {
    // Default to stdio transport (for Smithery and standard MCP usage)
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(`MCP server running on stdio transport`);
  }
}

/**
 * Cleanup function for graceful shutdown
 */
async function cleanup() {
    console.error("Shutting down MCP server...");
    process.exit(0);
}

// Register signal handlers
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Start the server
main().catch((error) => {
  console.error("Fatal error in main execution:", error);
  process.exit(1);
});

/**
 * Formats API errors for better readability
 * 
 * @param error Axios error
 * @returns Formatted error message
 */
function formatApiError(error: AxiosError): string {
    let message = 'API request failed.';
    if (error.response) {
        message = `API Error: Status ${error.response.status} (${error.response.statusText || 'Status text not available'}). `;
        const responseData = error.response.data;
        const MAX_LEN = 200;
        if (typeof responseData === 'string') { 
            message += `Response: ${responseData.substring(0, MAX_LEN)}${responseData.length > MAX_LEN ? '...' : ''}`; 
        }
        else if (responseData) { 
            try { 
                const jsonString = JSON.stringify(responseData); 
                message += `Response: ${jsonString.substring(0, MAX_LEN)}${jsonString.length > MAX_LEN ? '...' : ''}`; 
            } catch { 
                message += 'Response: [Could not serialize data]'; 
            } 
        }
        else { 
            message += 'No response body received.'; 
        }
    } else if (error.request) {
        message = 'API Network Error: No response received from server.';
        if (error.code) message += ` (Code: ${error.code})`;
    } else { 
        message += `API Request Setup Error: ${error.message}`; 
    }
    return message;
}

/**
 * Converts a JSON Schema to a Zod schema for runtime validation
 * 
 * @param jsonSchema JSON Schema
 * @param toolName Tool name for error reporting
 * @returns Zod schema
 */
function getZodSchemaFromJsonSchema(jsonSchema: any, toolName: string): z.ZodTypeAny {
    if (typeof jsonSchema !== 'object' || jsonSchema === null) { 
        return z.object({}).passthrough(); 
    }
    try {
        const zodSchemaString = jsonSchemaToZod(jsonSchema);
        // Use a safer approach for Smithery deployment
        try {
            const zodSchema = eval(zodSchemaString);
            if (typeof zodSchema?.parse !== 'function') { 
                throw new Error('Eval did not produce a valid Zod schema.'); 
            }
            return zodSchema as z.ZodTypeAny;
        } catch (evalError) {
            console.error(`Failed to evaluate Zod schema for '${toolName}', using passthrough:`, evalError);
            // Return a permissive schema that allows any object
            return z.object({}).passthrough();
        }
    } catch (err: any) {
        console.error(`Failed to generate Zod schema for '${toolName}', using passthrough:`, err);
        return z.object({}).passthrough();
    }
}
