"use client";

import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Video } from "@/types/video";

interface VideoModalProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ video, isOpen, onClose }: VideoModalProps) {
  if (!video) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full p-0">
        <div className="relative bg-black">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-50 text-white hover:bg-white/20"
            onClick={onClose}
            aria-label="Close video"
          >
            <X className="w-6 h-6" />
          </Button>

          <div className="relative w-full aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          <div className="p-6 bg-card">
            <h3 className="font-heading text-2xl font-bold text-text-primary mb-2">
              {video.title}
            </h3>
            <p className="text-text-secondary">
              {video.description}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
