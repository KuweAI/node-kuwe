import { Integration, OAuth2Credentials, AuthType } from '../base';
import { google } from 'googleapis';
/**
 * Gmail integration class
 * Provides methods for interacting with Gmail API using the official Google APIs library
 */
export class GmailIntegration extends Integration<OAuth2Credentials> {
  readonly name = 'google-mail';
  readonly providerConfigKey = 'google-mail';

  /**
   * Get Gmail access token directly with type safety
   * No need for manual type checking!
   */
  public async getAccessToken(): Promise<string> {
    return this.getAuthToken(); // TypeScript knows this returns a string
  }

  /**
   * Create an authenticated Gmail client
   */
  private async getGmailClient() {
    const accessToken = await this.getAccessToken();
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    return google.gmail({ version: 'v1', auth });
  }

  /**
   * Send an email
   * @param to - Recipient email address(es) (string or array)
   * @param subject - Email subject
   * @param body - Email body (can be HTML or plain text)
   * @param from - Sender email (optional, defaults to authenticated user)
   * @param cc - CC recipients (optional)
   * @param bcc - BCC recipients (optional)
   * @param isHtml - Whether the body is HTML (default: false)
   */
  public async sendEmail(
    to: string | string[],
    subject: string,
    body: string,
    from?: string,
    cc?: string | string[],
    bcc?: string | string[],
    isHtml: boolean = false
  ) {
    const gmail = await this.getGmailClient();

    const toAddresses = Array.isArray(to) ? to.join(', ') : to;
    const ccAddresses = cc ? (Array.isArray(cc) ? cc.join(', ') : cc) : '';
    const bccAddresses = bcc ? (Array.isArray(bcc) ? bcc.join(', ') : bcc) : '';

    let emailContent = `To: ${toAddresses}\r\n`;
    if (ccAddresses) emailContent += `Cc: ${ccAddresses}\r\n`;
    if (bccAddresses) emailContent += `Bcc: ${bccAddresses}\r\n`;
    emailContent += `Subject: ${subject}\r\n`;
    emailContent += `Content-Type: ${isHtml ? 'text/html' : 'text/plain'}; charset=utf-8\r\n\r\n`;
    emailContent += body;

    const encodedMessage = Buffer.from(emailContent)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    });

    return {
      success: true,
      data: response.data,
      message: 'Email sent successfully'
    };
  }

  /**
   * Get emails from a specific label/folder
   * @param labelIds - Array of label IDs to filter by (default: ['INBOX'])
   * @param maxResults - Maximum number of emails to return (default: 10)
   * @param pageToken - Token for pagination
   * @param q - Search query string (Gmail search syntax)
   */
  public async getEmails(
    labelIds: string[] = ['INBOX'],
    maxResults: number = 10,
    pageToken?: string,
    q?: string
  ) {
    const gmail = await this.getGmailClient();

    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults,
      labelIds: labelIds.length > 0 ? labelIds : undefined,
      pageToken,
      q
    });

    return {
      success: true,
      data: response.data,
      message: 'Emails retrieved successfully'
    };
  }

  /**
   * Get detailed information about a specific email
   * @param messageId - The ID of the message to retrieve
   * @param format - The format to return the message in (default: 'full')
   */
  public async getEmailDetails(
    messageId: string,
    format: 'minimal' | 'full' | 'raw' | 'metadata' = 'full'
  ) {
    const gmail = await this.getGmailClient();

    const response = await gmail.users.messages.get({
      userId: 'me',
      id: messageId,
      format
    });

    return {
      success: true,
      data: response.data,
      message: 'Email details retrieved successfully'
    };
  }

  /**
   * Search emails using Gmail search syntax
   * @param query - Gmail search query (e.g., 'from:example@gmail.com', 'subject:important')
   * @param maxResults - Maximum number of results (default: 10)
   * @param pageToken - Token for pagination
   */
  public async searchEmails(
    query: string,
    maxResults: number = 10,
    pageToken?: string
  ) {
    const gmail = await this.getGmailClient();

    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults,
      q: query,
      pageToken
    });

    return {
      success: true,
      data: response.data,
      message: 'Email search completed successfully'
    };
  }

  /**
   * Mark emails as read or unread
   * @param messageIds - Array of message IDs to modify
   * @param markAsRead - Whether to mark as read (true) or unread (false)
   */
  public async markEmailsAsRead(messageIds: string[], markAsRead: boolean = true) {
    const gmail = await this.getGmailClient();

    const labelModifications = markAsRead 
      ? { removeLabelIds: ['UNREAD'] }
      : { addLabelIds: ['UNREAD'] };

    const response = await gmail.users.messages.batchModify({
      userId: 'me',
      requestBody: {
        ids: messageIds,
        ...labelModifications
      }
    });

    return {
      success: true,
      data: response.data,
      message: `Emails marked as ${markAsRead ? 'read' : 'unread'} successfully`
    };
  }

  /**
   * Delete emails (move to trash)
   * @param messageIds - Array of message IDs to delete
   */
  public async deleteEmails(messageIds: string[]) {
    const gmail = await this.getGmailClient();

    const response = await gmail.users.messages.batchDelete({
      userId: 'me',
      requestBody: {
        ids: messageIds
      }
    });

    return {
      success: true,
      data: response.data,
      message: 'Emails deleted successfully'
    };
  }

  /**
   * Create a draft email
   * @param to - Recipient email address(es)
   * @param subject - Email subject
   * @param body - Email body
   * @param from - Sender email (optional)
   * @param cc - CC recipients (optional)
   * @param bcc - BCC recipients (optional)
   * @param isHtml - Whether the body is HTML (default: false)
   */
  public async createDraft(
    to: string | string[],
    subject: string,
    body: string,
    from?: string,
    cc?: string | string[],
    bcc?: string | string[],
    isHtml: boolean = false
  ) {
    const gmail = await this.getGmailClient();

    const toAddresses = Array.isArray(to) ? to.join(', ') : to;
    const ccAddresses = cc ? (Array.isArray(cc) ? cc.join(', ') : cc) : '';
    const bccAddresses = bcc ? (Array.isArray(bcc) ? bcc.join(', ') : bcc) : '';

    let emailContent = `To: ${toAddresses}\r\n`;
    if (from) emailContent += `From: ${from}\r\n`;
    if (ccAddresses) emailContent += `Cc: ${ccAddresses}\r\n`;
    if (bccAddresses) emailContent += `Bcc: ${bccAddresses}\r\n`;
    emailContent += `Subject: ${subject}\r\n`;
    emailContent += `Content-Type: ${isHtml ? 'text/html' : 'text/plain'}; charset=utf-8\r\n\r\n`;
    emailContent += body;

    const encodedMessage = Buffer.from(emailContent)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await gmail.users.drafts.create({
      userId: 'me',
      requestBody: {
        message: {
          raw: encodedMessage
        }
      }
    });

    return {
      success: true,
      data: response.data,
      message: 'Draft created successfully'
    };
  }
  /**
   * Get all labels
   */
  public async getLabels() {
    const gmail = await this.getGmailClient();

    const response = await gmail.users.labels.list({
      userId: 'me'
    });

    return {
      success: true,
      data: response.data,
      message: 'Labels retrieved successfully'
    };
  }

  /**
   * Get user profile information
   */
  public async getProfile() {
    const gmail = await this.getGmailClient();

    const response = await gmail.users.getProfile({
      userId: 'me'
    });

    return {
      success: true,
      data: response.data,
      message: 'Profile retrieved successfully'
    };
  }

  /**
   * Add labels to emails
   * @param messageIds - Array of message IDs
   * @param labelIds - Array of label IDs to add
   */
  public async addLabelsToEmails(messageIds: string[], labelIds: string[]) {
    const gmail = await this.getGmailClient();

    const response = await gmail.users.messages.batchModify({
      userId: 'me',
      requestBody: {
        ids: messageIds,
        addLabelIds: labelIds
      }
    });

    return {
      success: true,
      data: response.data,
      message: 'Labels added to emails successfully'
    };
  }

  /**
   * Remove labels from emails
   * @param messageIds - Array of message IDs
   * @param labelIds - Array of label IDs to remove
   */
  public async removeLabelsFromEmails(messageIds: string[], labelIds: string[]) {
    const gmail = await this.getGmailClient();

    const response = await gmail.users.messages.batchModify({
      userId: 'me',
      requestBody: {
        ids: messageIds,
        removeLabelIds: labelIds
      }
    });

    return {
      success: true,
      data: response.data,
      message: 'Labels removed from emails successfully'
    };
  }
}