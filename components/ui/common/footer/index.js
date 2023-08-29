import ActiveLink from "@components/ui/common/link";

const navigation = [
  { name: "Qui som", href: "/qui-som", current: false },
  { name: "Arxiu", href: "/sitemap", current: false },
];
export default function Footer() {
  return (
    <footer className="bg-whiteCorp h-min py-10 absolute bottom-0 w-full">
      <div className="container mx-auto h-full">
        <div className="flex flex-col justify-center items-center h-full">
          <div className="text-white text-sm text-primary-2 text-center">
            © {new Date().getFullYear()} Esdeveniments.cat <br />
            Contacte:&nbsp;
            <a
              className="hover:text-primary"
              href="mailto:hola@esdeveniments.cat"
            >
              hola@esdeveniments.cat
            </a>
            <div className="flex space-x-2">
              Segueix-nos a:&nbsp;
              <div>
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  className="hover:text-primary"
                  href="https://twitter.com/esdeveniments"
                >
                  Twitter
                </a>
              </div>
              <div>
                |&nbsp;&nbsp;
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  className="hover:text-primary"
                  href="https://t.me/esdeveniments"
                >
                  Telegram
                </a>
              </div>
              <div>
                |&nbsp;&nbsp;
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  className="hover:text-primary"
                  href="https://www.facebook.com/esdeveniments"
                >
                  Facebook
                </a>
              </div>
            </div>
            <div>
              {navigation.map((item) => (
                    <ActiveLink href={item.href} key={item.name}>
                      <a className="text-secundari font-medium mr-4 hover:text-secondarySoft">
                        {item.name}
                      </a>
                    </ActiveLink>
                  ))}
              </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
