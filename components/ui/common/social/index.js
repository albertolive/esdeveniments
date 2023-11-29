import Link from "next/link";

const renderFacebook = (link) => (
  (<Link
    href={link}
    className="no-underline"
    rel="noopener noreferrer"
    target="_blank">

    <button className="px-2 py-2 bg-whiteCorp rounded-full">
      <svg
        className="w-4 h-4 fill-primary"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    </button>

  </Link>)
);

const renderTwitter = (link) => (
  (<Link
    href={link}
    className="no-underline"
    rel="noopener noreferrer"
    target="_blank">

    <button className="px-2 py-2 bg-whiteCorp rounded-full">
      <svg
        className="w-4 h-4 fill-primary"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/>
      </svg>
    </button>

  </Link>)
);

const renderInstagram = (link) => (
  (<Link
    href={link}
    className="no-underline"
    rel="noopener noreferrer"
    target="_blank">

    <button className="px-2 py-2 bg-whiteCorp rounded-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 fill-primary"
        role="img"
        viewBox="0 0 24 24"
      >
        <path d="M8 3C5.243 3 3 5.243 3 8v8c0 2.757 2.243 5 5 5h8c2.757 0 5-2.243 5-5V8c0-2.757-2.243-5-5-5H8zm0 2h8c1.654 0 3 1.346 3 3v8c0 1.654-1.346 3-3 3H8c-1.654 0-3-1.346-3-3V8c0-1.654 1.346-3 3-3zm9 1a1 1 0 0 0-1 1 1 1 0 0 0 1 1 1 1 0 0 0 1-1 1 1 0 0 0-1-1zm-5 1c-2.757 0-5 2.243-5 5s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3z" />
      </svg>
    </button>

  </Link>)
);

const renderTelegram = (link) => (
  (<Link
    href={link}
    className="no-underline"
    rel="noopener noreferrer"
    target="_blank">

    <button className="px-2 py-2 bg-whiteCorp rounded-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 fill-primary"
        role="img"
        viewBox="0 0 24 24"
      >
        <path d="M18.384 22.779a1.19 1.19 0 0 0 1.107.145 1.16 1.16 0 0 0 .724-.84C21.084 18 23.192 7.663 23.983 3.948a.78.78 0 0 0-.26-.758.8.8 0 0 0-.797-.14C18.733 4.602 5.82 9.447.542 11.4a.827.827 0 0 0-.542.799c.012.354.25.661.593.764 2.367.708 5.474 1.693 5.474 1.693s1.452 4.385 2.209 6.615c.095.28.314.5.603.576a.866.866 0 0 0 .811-.207l3.096-2.923s3.572 2.619 5.598 4.062Zm-11.01-8.677 1.679 5.538.373-3.507 10.185-9.186a.277.277 0 0 0 .033-.377.284.284 0 0 0-.376-.064L7.374 14.102Z" />
      </svg>
    </button>

  </Link>)
);

const renderWhatsapp = (link) => (
  (<Link
    href={link}
    className="no-underline"
    rel="noopener noreferrer"
    target="_blank">

    <button className="px-2 py-2 bg-whiteCorp rounded-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 fill-primary"
        role="img"
        viewBox="0 0 24 24"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    </button>

  </Link>)
);

export default function Social({ links }) {
  return (
    <div className="mt-2">
      <div className="flex flex-nowrap justify-center items-center gap-6">
        {links.twitter && renderTwitter(links.twitter)}
        {links.instagram && renderInstagram(links.instagram)}
        {links.telegram && renderTelegram(links.telegram)}
        {links.facebook && renderFacebook(links.facebook)}
      </div>
    </div>
  );
}
