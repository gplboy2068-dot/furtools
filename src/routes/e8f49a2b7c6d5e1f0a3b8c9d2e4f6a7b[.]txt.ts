import { createFileRoute } from "@tanstack/react-router";

const INDEXNOW_KEY = "e8f49a2b7c6d5e1f0a3b8c9d2e4f6a7b";

export const Route = createFileRoute("/e8f49a2b7c6d5e1f0a3b8c9d2e4f6a7b.txt")({
  server: {
    handlers: {
      GET: async () => {
        return new Response(INDEXNOW_KEY, {
          status: 200,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=86400",
          },
        });
      },
    },
  },
});
