import { Integration, OAuth2Credentials, AuthType } from '../base';

/**
 * Google Sheets integration class
 * Provides methods for interacting with Google Sheets API
 */
export class GoogleSheetsIntegration extends Integration<OAuth2Credentials> {
  readonly name = 'google-sheet';
  readonly providerConfigKey = 'google-sheet';

  /**
   * Get Google Sheets access token directly with type safety
   * No need for manual type checking!
   */
  public async getAccessToken(): Promise<string> {
    return this.getAuthToken(); // TypeScript knows this returns a string
  }

  /**
   * Write values to a single range in a Google Sheet
   * @param spreadsheetId - The ID of the spreadsheet
   * @param range - A1 notation range (e.g., 'Sheet1!A1:D5')
   * @param values - 2D array of values to write
   * @param valueInputOption - How the input data should be interpreted ('RAW' or 'USER_ENTERED')
   * @param majorDimension - Whether values are organized by ROWS or COLUMNS
   */
  public async writeRange(
    spreadsheetId: string,
    range: string,
    values: any[][],
    valueInputOption: 'RAW' | 'USER_ENTERED' = 'USER_ENTERED',
    majorDimension: 'ROWS' | 'COLUMNS' = 'ROWS'
  ) {
    const response = await this.proxyRequest({
      baseUrlOverride: 'https://sheets.googleapis.com/',
      method: 'PUT',
      endpoint: `/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=${valueInputOption}`,
      data: {
        range,
        majorDimension,
        values
      }
    });

    return {
      success: true,
      data: response.data,
      message: 'Range updated successfully'
    };
  }

  /**
   * Write values selectively to a range (allows null values to skip cells)
   * @param spreadsheetId - The ID of the spreadsheet
   * @param range - A1 notation range (e.g., 'Sheet1!B1')
   * @param values - 2D array of values to write (use null to skip cells, "" to clear)
   * @param valueInputOption - How the input data should be interpreted
   * @param majorDimension - Whether values are organized by ROWS or COLUMNS
   */
  public async writeSelectively(
    spreadsheetId: string,
    range: string,
    values: (any | null)[][],
    valueInputOption: 'RAW' | 'USER_ENTERED' = 'USER_ENTERED',
    majorDimension: 'ROWS' | 'COLUMNS' = 'COLUMNS'
  ) {
    const response = await this.proxyRequest({
      baseUrlOverride: 'https://sheets.googleapis.com/',
      method: 'PUT',
      endpoint: `/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=${valueInputOption}`,
      data: {
        range,
        majorDimension,
        values
      }
    });

    return {
      success: true,
      data: response.data,
      message: 'Range updated selectively'
    };
  }

  /**
   * Write values to multiple ranges in a single request
   * @param spreadsheetId - The ID of the spreadsheet
   * @param data - Array of range data objects
   * @param valueInputOption - How the input data should be interpreted
   */
  public async batchUpdate(
    spreadsheetId: string,
    data: Array<{
      range: string;
      majorDimension: 'ROWS' | 'COLUMNS';
      values: any[][];
    }>,
    valueInputOption: 'RAW' | 'USER_ENTERED' = 'USER_ENTERED'
  ) {
    const response = await this.proxyRequest({
      baseUrlOverride: 'https://sheets.googleapis.com/',
      method: 'POST',
      endpoint: `/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
      data: {
        valueInputOption,
        data
      }
    });

    return {
      success: true,
      data: response.data,
      message: 'Batch update completed successfully'
    };
  }

  /**
   * Append values to a sheet (adds new rows)
   * @param spreadsheetId - The ID of the spreadsheet
   * @param range - A1 notation range indicating where to append
   * @param values - 2D array of values to append
   * @param valueInputOption - How the input data should be interpreted
   * @param majorDimension - Whether values are organized by ROWS or COLUMNS
   */
  public async appendValues(
    spreadsheetId: string,
    range: string,
    values: any[][],
    valueInputOption: 'RAW' | 'USER_ENTERED' = 'USER_ENTERED',
    majorDimension: 'ROWS' | 'COLUMNS' = 'ROWS'
  ) {
    const response = await this.proxyRequest({
      baseUrlOverride: 'https://sheets.googleapis.com/',
      method: 'POST',
      endpoint: `/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=${valueInputOption}`,
      data: {
        range,
        majorDimension,
        values
      }
    });

    return {
      success: true,
      data: response.data,
      message: 'Values appended successfully'
    };
  }

  /**
   * Read values from a range in a Google Sheet
   * @param spreadsheetId - The ID of the spreadsheet
   * @param range - A1 notation range to read from
   * @param majorDimension - Whether values should be organized by ROWS or COLUMNS
   */
  public async readRange(
    spreadsheetId: string,
    range: string,
    majorDimension: 'ROWS' | 'COLUMNS' = 'ROWS'
  ) {
    const response = await this.proxyRequest({
      baseUrlOverride: 'https://sheets.googleapis.com/',
      method: 'GET',
      endpoint: `/v4/spreadsheets/${spreadsheetId}/values/${range}?majorDimension=${majorDimension}`,
    });

    return {
      success: true,
      data: response.data,
      message: 'Range read successfully'
    };
  }
} 