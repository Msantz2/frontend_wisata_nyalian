"use client";

import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

interface SocialShareProps {
  title: string;
  description: string;
  url?: string;
}

export default function SocialShare({ title, description, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          toast.error("Unable to share. Please try copying the link instead.");
        }
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} - ${shareUrl}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${shareUrl}`)}`,
  };

  const canNativeShare =
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2">
          <Share2 className="w-5 h-5" />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Share this page</h4>
          {canNativeShare && (
            <Button
              onClick={handleNativeShare}
              className="w-full mb-3"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share using device
            </Button>
          )}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-background-light transition-colors min-h-[44px]"
              aria-label="Share on WhatsApp"
            >
              <span className="truncate">WhatsApp</span>
            </a>
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-background-light transition-colors min-h-[44px]"
              aria-label="Share on Facebook"
            >
              <span className="truncate">Facebook</span>
            </a>
            <a
              href={shareLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-background-light transition-colors min-h-[44px]"
              aria-label="Share on X (Twitter)"
            >
              <span className="truncate">X (Twitter)</span>
            </a>
            <a
              href={shareLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-background-light transition-colors min-h-[44px]"
              aria-label="Share on Telegram"
            >
              <span className="truncate">Telegram</span>
            </a>
            <a
              href={shareLinks.email}
              className="flex items-center justify-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-background-light transition-colors min-h-[44px]"
              aria-label="Share via Email"
            >
              <span className="truncate">Email</span>
            </a>
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-background-light transition-colors min-h-[44px]"
              aria-label="Copy link to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
