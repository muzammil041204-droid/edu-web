// YouTube links for video stories. Accepts the usual link shapes:
//   https://www.youtube.com/watch?v=ID   https://youtu.be/ID
//   https://www.youtube.com/shorts/ID    https://www.youtube.com/embed/ID
//   https://www.youtube.com/live/ID
// and returns the 11-character video id, or null.

const ID = /^[A-Za-z0-9_-]{11}$/;

export function youtubeId(url = '') {
  const text = url.trim();
  if (!text) return null;
  if (ID.test(text)) return text;
  let parsed;
  try {
    parsed = new URL(text.startsWith('http') ? text : `https://${text}`);
  } catch {
    return null;
  }
  const host = parsed.hostname.replace(/^(www\.|m\.|music\.)/, '');
  let id = null;
  if (host === 'youtu.be') id = parsed.pathname.slice(1).split('/')[0];
  else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    if (parsed.pathname === '/watch') id = parsed.searchParams.get('v');
    else {
      const [, kind, value] = parsed.pathname.split('/');
      if (['shorts', 'embed', 'live', 'v'].includes(kind)) id = value;
    }
  }
  return id && ID.test(id) ? id : null;
}

export const isShort = (url = '') => /youtube\.com\/shorts\//i.test(url);

export const youtubeThumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

// Privacy-enhanced embed: YouTube sets no cookies until the video plays.
export const youtubeEmbed = (id) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
