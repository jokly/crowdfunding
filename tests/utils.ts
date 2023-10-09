export function getUnixTimestampNow(): number {
  return Math.floor(Date.now() / 1000);
}