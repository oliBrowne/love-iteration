// Saves text as a file on this device. Nothing is uploaded: the browser makes
// a temporary local link to the text and "clicks" it.
export function downloadTextFile(
  fileName: string,
  text: string,
  type = 'application/json',
): void {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
