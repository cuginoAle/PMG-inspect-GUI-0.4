const getVideoId = ({
  videoUrl,
  projectName,
}: {
  videoUrl: string;
  projectName: string;
}): string => {
  return `${projectName}-${videoUrl}`;
};
export { getVideoId };
