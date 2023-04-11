import { useRouter } from "next/router";

export default function Town() {
  const router = useRouter();
  return null;
}

export const getServerSideProps = async ({ params, res }) => {
  const { region, town } = params;

  res.writeHead(302, { Location: `/${region}/${town}/agenda` });
  res.end();

  return { props: {} };
};
