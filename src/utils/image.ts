export function getImageFallbackSrc(size = 320): string {
  return (
    'data:image/svg+xml,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect fill="#f3f3f3" width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#888888" font-family="sans-serif" font-size="12">No image</text></svg>`,
    )
  )
}

export function handleImageError(
  event: { currentTarget: HTMLImageElement },
  size = 320,
) {
  const img = event.currentTarget
  if (img.dataset.fallbackApplied === 'true') return
  img.dataset.fallbackApplied = 'true'
  img.src = getImageFallbackSrc(size)
}
