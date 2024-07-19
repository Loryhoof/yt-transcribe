import fetch from "node-fetch"; // To make HTTP requests
import { DOMParser } from "xmldom"; // To parse XML data

/**
 * Transcribes the captions from a YouTube video.
 * @param {string} videoUrl - The URL of the YouTube video.
 * @returns {Promise<object>} - The transcribed text in a JSON object.
 */
async function transcribe(videoUrl) {
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
      playerResponseStart
    );

    // Extract the JSON string and parse it
    const playerResponseJson = videoPageText.slice(
      playerResponseStart,
      playerResponseEnd
    );
    const playerResponse = JSON.parse(playerResponseJson);

    // Get the URL for the captions
    const captionsUrl =
      playerResponse.captions.playerCaptionsTracklistRenderer.captionTracks[0]
        .baseUrl;

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

    // Return the transcript as a JSON object
    return { transcript: transcript.trim() };
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Error:", error.message);
    return { error: error.message };
  }
}

// Export the transcribe function for use in other modules
export { transcribe };
