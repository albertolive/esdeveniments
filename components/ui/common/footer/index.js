export default function Footer() {
  return (
    <footer className="bg-gray-900 h-[85px] absolute bottom-0 w-full">
      <div className="container mx-auto h-full">
        <div className="flex flex-col justify-center items-center h-full">
          <div className="text-white text-sm text-primary-2 font-bold text-center">
            © {new Date().getFullYear()} Esdeveniments.cat <br />
            Contacte:&nbsp;
            <a
              className="hover:text-[#ECB84A]"
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
                  className="hover:text-[#ECB84A]"
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
                  className="hover:text-[#ECB84A]"
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
                  className="hover:text-[#ECB84A]"
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
                  className="hover:text-[#ECB84A]"
                  href="https://facebook.com/esdeveniments.cat"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
