/**
 * Converts a base64 string to a data URL that can be displayed in the frontend
 * @param base64String - The base64 encoded image string (with or without the data: prefix)
 * @param mimeType - The MIME type of the image (default: 'image/png')
 * @returns A data URL string that can be used as an image src
 */
export function base64ToImageUrl(base64String: string, mimeType: string = 'image/png'): string {
	// If it's already a data URL, return as is
	if (base64String.startsWith('data:')) {
		return base64String;
	}

	// Otherwise, create a data URL from the base64 string
	return `data:${mimeType};base64,${base64String}`;
}

/**
 * Validates if a string is a valid base64 encoded image
 * @param base64String - The string to validate
 * @returns true if valid base64, false otherwise
 */
export function isValidBase64(base64String: string): boolean {
	try {
		const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
		const cleanBase64 = base64String.replace(/^data:[^;]+;base64,/, '');
		return base64Regex.test(cleanBase64);
	} catch {
		return false;
	}
}
