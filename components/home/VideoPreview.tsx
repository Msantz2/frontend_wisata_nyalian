"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import SectionContainer from "@/components/shared/SectionContainer";
import SectionTitle from "@/components/shared/SectionTitle";
import VideoGallery from "@/components/gallery/VideoGallery";
import type { Video } from "@/types/video";

const VideoModal = dynamic(() => import("@/components/gallery/VideoModal"), { ssr: false });

interface VideoPreviewProps {
  videos: Video[];
}

export default function VideoPreview({ videos }: VideoPreviewProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedVideo(null), 300);
  };

  if (videos.length === 0) {
    return null;
  }

  const displayVideos = videos.slice(0, 4);

  return (
    <SectionContainer background="section">
      <SectionTitle
        title="Galeri Video"
        subtitle="Saksikan dan rasakan Desa Nyalian melalui video kami"
      />
      
      <VideoGallery videos={displayVideos} onVideoClick={handleVideoClick} />
      
      <VideoModal
        video={selectedVideo}
        isOpen={modalOpen}
        onClose={handleClose}
      />
    </SectionContainer>
  );
}
