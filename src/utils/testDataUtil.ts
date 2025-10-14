import * as testData from '../testdata/testdata.json';

/**
 * Utility function to get test data for a specific test case
 * @param testCaseId - The test case ID (e.g., 'TC03')
 * @returns Test data object for the specified test case
 */
export function getTestData(testCaseId: string): any {
  const data = testData[testCaseId as keyof typeof testData];
  if (!data) {
    throw new Error(`Test data not found for test case: ${testCaseId}`);
  }
  return data;
}

/**
 * Generate timestamp for unique data
 * @returns Current timestamp string
 */
export function generateTimestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

/**
 * Generate random string
 * @param length - Length of random string
 * @returns Random alphanumeric string
 */
export function generateRandomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate UUID v4
 * @returns UUID string
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
