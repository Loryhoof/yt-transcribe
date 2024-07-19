import fetch from "node-fetch"; // To make HTTP requests
import { DOMParser } from "xmldom"; // To parse XML data
import he from "he"; // To decode HTML entities

/**
 * Checks if an object has a property for the key.
 * @param object - The object to check.
 * @param key - The key to look for.
 * @returns - Whether the key's in the object.
 */
const is_in_object = <A extends string>(
  object: object,
  key: A,
): object is { [B in A]: unknown } => key in object;

/**
 * Transcribes the captions from a YouTube video.
 * @param videoUrl - The URL of the YouTube video.
 * @returns - The transcribed text in a JSON object.
 */
async function transcribe(videoUrl: string) {
  try {
    // Fetch the HTML content of the YouTube video page
    const videoPageResponse = await fetch(videoUrl);
    const videoPageText = await videoPageResponse.text();

    // Locate the JSON data containing the player response
    const playerResponseStart =
      videoPageText.indexOf("ytInitialPlayerResponse = ") +
      "ytInitialPlayerResponse = ".length;
    const playerResponseEnd = videoPageText.indexOf(
      ";</script>",
      playerResponseStart,
    );

    // Extract the JSON string and parse it
    const playerResponseJson = videoPageText.slice(
      playerResponseStart,
      playerResponseEnd,
    );
    const playerResponse = <unknown> JSON.parse(playerResponseJson);

    // Get the URL for the captions
    const captionsUrl = ([
      "captions",
      "playerCaptionsTracklistRenderer",
      "captionTracks",
      "0",
      "baseUrl",
    ] as const).reduce((object, key) => {
      if (typeof object !== "object" || object === null) throw Error("json :(");
      if (!is_in_object(object, key)) throw Error("json :(");
      return object[key];
    }, playerResponse);
    if (typeof captionsUrl !== "string") throw Error("json :(");

    // Fetch the captions in XML format
    const captionsResponse = await fetch(captionsUrl);
    const captionsXml = await captionsResponse.text();

    // Parse the XML captions
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(captionsXml, "text/xml");

    // Extract and concatenate the text from the captions
    const texts = xmlDoc.getElementsByTagName("text");
    let transcript = "";
    for (let i = 0; i < texts.length; i++) {
      transcript += texts[i].textContent + " ";
    }

    // Decode HTML entities in the transcript
    const decodedTranscript = he.decode(transcript.trim());

    // Return the transcript as a JSON object
    return { transcript: decodedTranscript };
  } catch (error) {
    if (error instanceof Error) {
      // Log any errors that occur during the process
      console.error("Error:", error.message);
      return { error: error.message };
    }
    throw error;
  }
}

// Export the transcribe function for use in other modules
export { transcribe };
