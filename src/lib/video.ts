/**
 * Helper to extract YouTube Video ID from any input format:
 * - Full URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * - Short URL: https://youtu.be/dQw4w9WgXcQ
 * - Embed URL: https://www.youtube.com/embed/dQw4w9WgXcQ
 * - Raw Video ID: dQw4w9WgXcQ
 */
export function extractYouTubeVideoId(input: string): string {
  if (!input) return 'L_LUpnjgPso';
  const trimmed = input.trim();

  // If local uploaded file path or raw HTTP video file, preserve as is
  if (trimmed.startsWith('/uploads/') || trimmed.endsWith('.mp4') || trimmed.endsWith('.webm') || trimmed.endsWith('.mov')) {
    return trimmed;
  }

  // Standard v= query parameter
  const watchMatch = trimmed.match(/[?&]v=([^&]+)/);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }

  // Short URL format (youtu.be/xxx)
  const shortMatch = trimmed.match(/youtu\.be\/([^?&/]+)/);
  if (shortMatch && shortMatch[1]) {
    return shortMatch[1];
  }

  // Embed format (youtube.com/embed/xxx)
  const embedMatch = trimmed.match(/youtube\.com\/embed\/([^?&/]+)/);
  if (embedMatch && embedMatch[1]) {
    return embedMatch[1];
  }

  // Clean raw ID if passed directly
  const rawClean = trimmed.replace(/^[^a-zA-Z0-9_.-]+|[^a-zA-Z0-9_.-]+$/g, '');
  return rawClean || 'L_LUpnjgPso';
}
