import ActiveLink from "@components/ui/common/link";

const navigation = [
  { name: "Arxiu", href: "/sitemap", current: false },
];
export default function Footer() {
  return (
    <footer className="bg-whiteCorp h-min pt-10 pb-24 absolute bottom-0 w-full">
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
            <div>Segueix-nos a:&nbsp;</div>
            <div className="flex space-x-2">
              <div>
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  className="hover:text-primary"
                  href="https://www.instagram.com/esdevenimentscat/"
                >
                  Instagram
                </a>
              </div>
              <div>
                |&nbsp;&nbsp;
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  className="hover:text-primary"
                  href="https://x.com/esdeveniments_"
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
                  href="https://facebook.com/esdeveniments.cat"
                >
                  Facebook
                </a>
              </div>
            </div>
            <div className="pt-4">
              {navigation.map((item) => (
                    <ActiveLink href={item.href} key={item.name}>
                      <a className="text-secundari font-medium px-4">
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
