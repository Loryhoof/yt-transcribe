/**
 * Transcribes the captions from a YouTube video.
 * @param {string} videoUrl - The URL of the YouTube video.
 * @returns {Promise<{ transcript: string } | { error: string }>} - A promise that resolves to an object containing the transcribed text or an error message.
 */
export function transcribe(
  videoUrl: string
): Promise<{ transcript: string } | { error: string }>;
