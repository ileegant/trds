export const calculateUserSeed = (
  username: string,
  contentIdentifier: number | string
): number => {
  const textSeed =
    typeof contentIdentifier === "number"
      ? contentIdentifier
      : contentIdentifier.length;

  const nameSeed = username
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return nameSeed + textSeed;
};
