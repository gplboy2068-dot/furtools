import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/author/")({
  loader: () => {
    throw redirect({
      to: "/author/$slug",
      params: { slug: "firoz-khan" },
    });
  },
  component: () => null,
});
