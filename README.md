# yt-transcribe

A simple Node.js library to transcribe YouTube video captions.

## Description

`yt-transcribe` allows you to fetch and transcribe captions from YouTube videos programmatically. It uses `node-fetch` to make HTTP requests, `xmldom` to parse XML data and `he` to decode special characters.

## Installation

You can install the library using npm:

```bash
npm install yt-transcribe
```
## Usage

Here's an example of how to use \`yt-transcribe\` to get the transcript of a YouTube video:

```javascript
import { transcribe } from 'yt-transcribe';

const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Replace with a real video URL

transcribe(videoUrl).then(result => {
  if (result.error) {
    console.error('Error transcribing video:', result.error);
  } else {
    console.log('Transcript:', result.transcript);
  }
});
```

Another simplified example:

```javascript
import { transcribe } from 'yt-transcribe';

const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'; // Replace with a real video URL

const { transcript } = await transcribe(videoUrl);

console.log('Transcript:', transcript);
```

## API

### transcribe(videoUrl)

Fetches and transcribes the captions from a YouTube video.

#### Parameters

`videoUrl` (string): The URL of the YouTube video.

#### Returns

- A `Promise` that resolves to an object containing the transcript or an error message.

```json
{
  "transcript": "The transcribed text"
}
```

If an error occurs, the object will contain an `error` field with the error message.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

### Steps to Contribute

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes.
4. Commit your changes with a meaningful commit message.
5. Push your changes to your fork.
6. Open a pull request to the main repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

Kevin Klatt - [klattkev@gmail.com](mailto:klattkev@gmail.com)
