const removeFileExtension = (fileName?: string | null): string => {
  if (!fileName) return ''; // No filename provided
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1) return fileName; // No extension found
  return fileName.substring(0, lastDotIndex);
};

export { removeFileExtension };
