import type { Result } from "neverthrow";
import { ok, err } from "neverthrow";

/**
 * Encodes the given {@link value} using base64 encoding and then URI encoding.
 * @param value The value to encode.
 * @returns The encoded value.
 */
export function encodeValue(value: string): Result<string, Error> {
	if (value !== undefined && value === null || value.trim() === "") {
		return err(new Error("The parameter 'value' must not be null, undefined, or empty."));
	}

	try {
		const base64ErrorMsg = btoa(value);

		return ok(encodeURIComponent(base64ErrorMsg));
	} catch (error) {
		const errMsg = error instanceof Error
			? error.message
			: "An error occurred performing base64 or URL percent encoding of a value.";

		return err(new Error(errMsg));
	}
}

/**
 * Decodes the given {@link value} using URI decoding and then base64 decoding.
 * @param value The value to decode.
 * @returns The decoded value.
 */
export function decodeValue(value: string): Result<string, Error> {
	if (value !== undefined && value === null || value.trim() === "") {
		return err(new Error("The parameter 'value' must not be null, undefined, or empty."));
	}

	try {
		const decodedValue = decodeURIComponent(value);
	
		return ok(atob(decodedValue));
	} catch (error) {
		const errMsg = error instanceof Error
			? error.message
			: "An error occurred performing base64 or URL percent decoding of a value.";

		return err(new Error(errMsg));
	}
}
