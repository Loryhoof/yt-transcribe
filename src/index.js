"use strict";
import fetch from "node-fetch";
import { DOMParser } from "xmldom";
import he from "he";
const is_in_object = (object, key) => key in object;
async function transcribe(videoUrl) {
  try {
    const videoPageResponse = await fetch(videoUrl);
    const videoPageText = await videoPageResponse.text();
    const playerResponseStart = videoPageText.indexOf("ytInitialPlayerResponse = ") + "ytInitialPlayerResponse = ".length;
    const playerResponseEnd = videoPageText.indexOf(
      ";<\/script>",
      playerResponseStart
    );
    const playerResponseJson = videoPageText.slice(
      playerResponseStart,
      playerResponseEnd
    );
    const playerResponse = JSON.parse(playerResponseJson);
    const captionsUrl = [
      "captions",
      "playerCaptionsTracklistRenderer",
      "captionTracks",
      "0",
      "baseUrl"
    ].reduce((object, key) => {
      if (typeof object !== "object" || object === null) throw Error("json :(");
      if (!is_in_object(object, key)) throw Error("json :(");
      return object[key];
    }, playerResponse);
    if (typeof captionsUrl !== "string") throw Error("json :(");
    const captionsResponse = await fetch(captionsUrl);
    const captionsXml = await captionsResponse.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(captionsXml, "text/xml");
    const texts = xmlDoc.getElementsByTagName("text");
    let transcript = "";
    for (let i = 0; i < texts.length; i++) {
      transcript += texts[i].textContent + " ";
    }
    const decodedTranscript = he.decode(transcript.trim());
    return { transcript: decodedTranscript };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
      return { error: error.message };
    }
    throw error;
  }
}
export { transcribe };
