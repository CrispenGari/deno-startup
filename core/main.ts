import { serve } from "std/http/server.ts";

const PORT = 3001;
const handler = (): Response => {
  return new Response(
    JSON.stringify({
      message: "Hello There",
    }),
    {
      status: 200,
      statusText: "ok",
      headers: {
        "content-type": "application/json",
      },
    }
  );
};

serve(handler, {
  port: PORT,
  hostname: "localhost",
  onListen: ({ hostname, port }) => {
    console.log(`The server is running on port: http://${hostname}:${port}`);
  },
});
