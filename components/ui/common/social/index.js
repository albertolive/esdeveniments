import Link from "next/link";

const renderFacebook = (link) => (
  <Link href={link}>
    <a className="no-underline" rel="noopener noreferrer" target="_blank">
      <button className="px-2 py-2 bg-whiteCorp rounded-full">
        <svg
          className="w-6 h-6 fill-primary"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </button>
    </a>
  </Link>
);

const renderTwitter = (link) => (
  <Link href={link}>
    <a className="no-underline" rel="noopener noreferrer" target="_blank">
      <button className="px-2 py-2 bg-whiteCorp rounded-full">
        <svg
          className="w-6 h-6 fill-primary"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      </button>
    </a>
  </Link>
);

const renderInstagram = (link) => (
  <Link href={link}>
    <a className="no-underline" rel="noopener noreferrer" target="_blank">
      <button className="px-2 py-2 bg-whiteCorp rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 fill-primary"
          role="img"
          viewBox="0 0 24 24"
        >
          <path d="M8 3C5.243 3 3 5.243 3 8v8c0 2.757 2.243 5 5 5h8c2.757 0 5-2.243 5-5V8c0-2.757-2.243-5-5-5H8zm0 2h8c1.654 0 3 1.346 3 3v8c0 1.654-1.346 3-3 3H8c-1.654 0-3-1.346-3-3V8c0-1.654 1.346-3 3-3zm9 1a1 1 0 0 0-1 1 1 1 0 0 0 1 1 1 1 0 0 0 1-1 1 1 0 0 0-1-1zm-5 1c-2.757 0-5 2.243-5 5s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3z" />
        </svg>
      </button>
    </a>
  </Link>
);

const renderTelegram = (link) => (
  <Link href={link}>
    <a className="no-underline" rel="noopener noreferrer" target="_blank">
      <button className="px-2 py-2 bg-whiteCorp rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 fill-primary"
          role="img"
          viewBox="0 0 24 24"
        >
          <path d="M18.384 22.779a1.19 1.19 0 0 0 1.107.145 1.16 1.16 0 0 0 .724-.84C21.084 18 23.192 7.663 23.983 3.948a.78.78 0 0 0-.26-.758.8.8 0 0 0-.797-.14C18.733 4.602 5.82 9.447.542 11.4a.827.827 0 0 0-.542.799c.012.354.25.661.593.764 2.367.708 5.474 1.693 5.474 1.693s1.452 4.385 2.209 6.615c.095.28.314.5.603.576a.866.866 0 0 0 .811-.207l3.096-2.923s3.572 2.619 5.598 4.062Zm-11.01-8.677 1.679 5.538.373-3.507 10.185-9.186a.277.277 0 0 0 .033-.377.284.284 0 0 0-.376-.064L7.374 14.102Z" />
        </svg>
      </button>
    </a>
  </Link>
);

export default function Social({ links }) {
  return (
    <div className="mt-2">
      <div className="flex flex-nowrap justify-center items-center gap-4">
        {links.twitter && renderTwitter(links.twitter)}
        {links.instagram && renderInstagram(links.instagram)}
        {links.telegram && renderTelegram(links.telegram)}
        {links.facebook && renderFacebook(links.facebook)}
      </div>
    </div>
  );
}
