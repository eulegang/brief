# Brief

A small Hono/Node.js app with a vanilla JavaScript dictation interface.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:3000, allow microphone access, then hold the button (or focus it and hold Space or Enter) while speaking.
Release to stop.
You can edit the transcript between recordings.

Speech recognition uses the browser's Web Speech API, so availability varies by browser; some browsers send audio to a speech service.
Microphone access requires localhost or HTTPS.
No audio is uploaded to the Hono server.

Run `npm run build` and `npm start` to serve the compiled app.
