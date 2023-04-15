import { useRouter } from "next/router";

export default function Town() {
  const router = useRouter();
  return null;
}

function getTextAfterLastSlash(url) {
  if (typeof url !== "string") {
    return "agenda";
  }
  const lastSlashIndex = url.lastIndexOf("/");
  if (lastSlashIndex < 0 || lastSlashIndex === url.length - 1) {
    return "agenda";
  }
  return url.substring(lastSlashIndex + 1);
}

export const getServerSideProps = async ({ params, res, req }) => {
  const { region, town } = params;
  const previousUrl = req.headers.referer || "/";
  let byDate = getTextAfterLastSlash(previousUrl);

  if (byDate === region) byDate = "agenda";

  res.writeHead(302, { Location: `/${region}/${town}/${byDate}` });
  res.end();

  return { props: {} };
};
