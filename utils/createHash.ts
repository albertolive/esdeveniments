import { createHash as createHashFn } from "crypto";

export default function createHash(title, url, location, date) {
  const hash = createHashFn("md5")
    .update(title + url + location + date)
    .digest("hex");

  return hash;
}
