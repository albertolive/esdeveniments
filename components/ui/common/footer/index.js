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
            <div className="flex space-x-2">
              Segueix-nos a:&nbsp;
              <div>
                <a
                  rel="noopener noreferrer"
                  target="_blank"
                  className="hover:text-[#ECB84A]"
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
                  href="https://www.facebook.com/esdeveniments"
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
