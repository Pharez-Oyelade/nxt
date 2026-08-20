import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black text-white dark:bg-background pt-16 md:pt-20 pb-4 px-6 md:px-10 lg:px-20">
      <div className="text-5xl md:text-7xl lg:text-9xl text-center font-fraunces pb-10 break-words">
        WHAT NXT.
      </div>
      <hr className="text-white/20 border-white/20" />

      <div className="flex flex-col md:flex-row justify-between pt-12 md:pt-20 pb-12 md:pb-20 gap-12 md:gap-8 lg:gap-0">
        <div className="space-y-6 md:max-w-xs">
          <h4 className="text-white/40 text-sm font-medium tracking-wider">
            A BRAND & DIGITAL PRODUCT STUDIO
          </h4>
          <p className="text-lg md:text-base leading-relaxed">
            BASED IN NIGERIA. <br /> WORKING GLOBALLY.
          </p>
          {/* <div className="text-accent hover:text-white transition-colors cursor-pointer">support@nxt.studio</div> */}
          <div className="text-accent hover:text-white transition-colors cursor-pointer">
            pharezoyelade@gmail.com
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <h4 className="text-white/40 text-sm font-medium tracking-wider mb-2 md:mb-0">
            LINKS
          </h4>
          <Link href="/work" className="hover:text-accent transition-colors">
            WORK
          </Link>
          <Link
            href="/services"
            className="hover:text-accent transition-colors"
          >
            SERVICES
          </Link>
          <Link href="/about" className="hover:text-accent transition-colors">
            ABOUT
          </Link>
          <Link href="/blogs" className="hover:text-accent transition-colors">
            BLOG
          </Link>
        </div>

        <div className="flex flex-col gap-5">
          <h4 className="text-white/40 text-sm font-medium tracking-wider mb-2 md:mb-0">
            LEGAL & MORE
          </h4>
          <Link href="/privacy" className="hover:text-accent transition-colors">
            PRIVACY POLICY
          </Link>
          <Link href="/faq" className="hover:text-accent transition-colors">
            FAQS
          </Link>
        </div>

        <div className="flex flex-row md:flex-col gap-4 md:gap-5 md:pr-10 lg:pr-20">
          <Link
            href="https://x.com/Pharez_Oye"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent px-4 py-4 md:px-3 md:py-3 rounded-full hover:bg-white hover:text-black transition-colors group"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 fill-white group-hover:fill-black transition-colors"
            >
              <title>X/Twitter</title>
              <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
            </svg>
          </Link>

          <Link
            href="https://www.linkedin.com/in/pharez-oyelade-b90263312"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent px-4 py-4 md:px-3 md:py-3 rounded-full hover:bg-white hover:text-black transition-colors group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="w-5 h-5 fill-white group-hover:fill-black transition-colors"
            >
              <path
                d="M26.111,3H5.889c-1.595,0-2.889,1.293-2.889,2.889V26.111c0,1.595,1.293,2.889,2.889,2.889H26.111c1.595,0,2.889-1.293,2.889-2.889V5.889c0-1.595-1.293-2.889-2.889-2.889ZM10.861,25.389h-3.877V12.87h3.877v12.519Zm-1.957-14.158c-1.267,0-2.293-1.034-2.293-2.31s1.026-2.31,2.293-2.31,2.292,1.034,2.292,2.31-1.026,2.31-2.292,2.31Zm16.485,14.158h-3.858v-6.571c0-1.802-.685-2.809-2.111-2.809-1.551,0-2.362,1.048-2.362,2.809v6.571h-3.718V12.87h3.718v1.686s1.118-2.069,3.775-2.069,4.556,1.621,4.556,4.975v7.926Z"
                fillRule="evenodd"
              ></path>
            </svg>
          </Link>

          <Link
            href="https://github.com/Pharez-Oyelade"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent px-4 py-4 md:px-3 md:py-3 rounded-full hover:bg-white hover:text-black transition-colors group"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 fill-white group-hover:fill-black transition-colors"
            >
              <title>GitHub</title>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="flex justify-center md:justify-start">
        <span className="text-xs md:text-sm text-white/30 text-center md:text-left mt-8 md:mt-0">
          &copy; {new Date().getFullYear()} NXT Studio. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
