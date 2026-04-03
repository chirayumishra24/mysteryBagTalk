import { useState } from "react";
import { IMAGE_PREFIX } from "../../data/gameContent";

/**
 * MediaRenderer - renders images with the correct URL prefix and videos responsively.
 * Handles missing/optional content gracefully.
 */
export default function MediaRenderer({ type = "image", src, title, className = "" }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!src) return null;

  // IMAGE rendering
  if (type === "image") {
    const isLocalImage = src.startsWith("/images/");
    const fullUrl = src.startsWith("http") || isLocalImage ? src : `${IMAGE_PREFIX}${src}`;

    if (imageError) {
      return (
        <div
          className={`flex items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-950/40 p-8 ${className}`}
        >
          <div className="text-center text-cyan-500/50">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v14.25a1.5 1.5 0 001.5 1.5z" />
            </svg>
            <p className="text-sm">Treasure hidden</p>
          </div>
        </div>
      );
    }

    return (
      <div className={`relative overflow-hidden rounded-xl ${className}`}>
        {!imageLoaded && (
          <div className="absolute inset-0 rounded-xl bg-cyan-950/50 animate-pulse" />
        )}
        <img
          src={fullUrl}
          alt={title || "Activity image"}
          className={`w-full h-auto rounded-xl object-cover transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // VIDEO rendering (YouTube)
  if (type === "video") {
    // Convert YouTube URLs to embed format
    let embedUrl = src;
    if (src.includes("youtu.be/")) {
      const videoId = src.split("youtu.be/")[1]?.split("?")[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (src.includes("youtube.com/watch")) {
      const url = new URL(src);
      const videoId = url.searchParams.get("v");
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    return (
      <div className={`relative w-full rounded-xl overflow-hidden ${className}`}>
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={embedUrl}
            title={title || "Video"}
            className="absolute inset-0 w-full h-full rounded-xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ border: "none" }}
          />
        </div>
        {title && (
          <p className="mt-3 text-center text-sm font-semibold text-cyan-200/70">
            {title}
          </p>
        )}
      </div>
    );
  }

  return null;
}
