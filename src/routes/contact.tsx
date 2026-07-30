import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact FurTools" },
      { name: "description", content: "Get in touch with the FurTools team — feedback, tool requests, and press inquiries." },
      { property: "og:title", content: "Contact FurTools" },
      { property: "og:description", content: "Send us feedback or a tool request." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sending, setSending] = useState(false);
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs items={[{ label: "Contact" }]} />
      <h1 className="mt-6 font-display text-4xl font-semibold">Say hello</h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Have a tool idea, feedback, or a question? Drop a message.
      </p>
      <form
        className="mt-8 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          setSending(true);
          setTimeout(() => {
            setSending(false);
            toast.success("Thanks — we'll get back to you soon.");
            (e.target as HTMLFormElement).reset();
          }, 400);
        }}
      >
        <div>
          <Label htmlFor="name">Your name</Label>
          <Input id="name" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" required rows={5} className="mt-1.5" />
        </div>
        <Button type="submit" disabled={sending} className="rounded-full">
          {sending ? "Sending…" : "Send message"}
        </Button>
      </form>
    </div>
  );
}
