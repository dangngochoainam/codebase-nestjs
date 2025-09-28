/**
 * Simple utility functions for common transformations
 */

/**
 * Converts string values to boolean
 * Handles various string representations of boolean values
 * @param value - The value to convert
 * @returns boolean value
 */
export function stringToBoolean(value: any): boolean {
    if (typeof value === 'string') {
        return value.toLowerCase() === 'true';
    }
    return Boolean(value);
}
