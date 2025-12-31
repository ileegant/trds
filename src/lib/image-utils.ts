export async function fetchImageToBase64(
  url: string | undefined
): Promise<string | null> {
  if (!url) return null;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    return `data:image/jpeg;base64,${Buffer.from(arrayBuffer).toString(
      "base64"
    )}`;
  } catch (e) {
    console.error("Image conversion failed:", e);
    return null;
  }
}
