import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const servicesData = [
  {
    name: "Strategy",
    description: "We figure out what you're building and why it should exist",
    href: "/",
    image: "/images/services/strategy_bg_1786802101253.jpg",
  },
  {
    name: "Identity",
    description: "We give you a clear identity that sets your brand apart",
    href: "/",
    image: "/images/services/identity_bg_1786802112521.jpg",
  },
  {
    name: "Design",
    description:
      "We turn ideas into clear, useful experiences that look as good as they work",
    href: "/",
    image: "/images/services/design_bg_1786802123606.jpg",
  },
  {
    name: "Engineering",
    description: "We build the products that bring everything to life.",
    href: "/",
    image: "/images/services/engineering_bg_1786802134054.jpg",
  },
];

export default function Services() {
  return (
    <section id="services" className=" w-full py-5">
      <div className="px-8 md:px-30 pb-20">
        <h3 className="text-2xl md:text-4xl font-bold font-fraunces">
          What NXT does
        </h3>
        <p className="text-lg w-full md:w-[30%] pt-5">
          We help you take your brand to the next level. From branding to design
          and development.
        </p>
      </div>

      <hr />

      <div className="flex flex-col">
        {servicesData.map((service, index) => (
          <div key={index}>
            <div className="h-[200px] md:h-[300px] w-full relative overflow-hidden group px-8 md:px-30">
              <Image
                src={service.image}
                fill
                alt={service.name}
                priority={false}
                loading="lazy"
                className="object-cover"
              />
              <Link href={service.href}>
                <div className="bg-background/75 dark:bg-background/50 absolute h-full w-full top-0 inset-0 z-0" />
                <div className="hidden md:block bg-background absolute h-full w-full top-0 inset-0 z-10 md:group-hover:-translate-y-full transition-transform duration-500 ease-in-out will-change-transform transform-translate-y-0" />
                <div className="flex flex-col md:flex-row justify-between md:px-10 items-center z-50 relative h-full py-8 md:py-6">
                  <div className="font-semibold w-full md:w-[35%] text-md md:text-xl">
                    {service.description}
                  </div>

                  <div className="flex items-center text-6xl md:text-8xl relative text-center md:text-left">
                    <div className="w-full">
                      {service.name}
                      <div className="absolute w-[90%] bottom-1 h-1 bg-primary md:group-hover:translate-x-0 transition-transform duration-500 md:duration-700 ease-in-out opacity-0 md:group-hover:opacity-100 will-change-transform" />
                    </div>
                    <div className="w-full md:w-[25%] text-2xl md:text-3xl lg:text-5xl flex justify-center md:justify-end">
                      <ArrowUpRight
                        width={40}
                        height={40}
                        className="md:w-[60px] md:h-[60px] lg:w-[80px] lg:h-[80px] md:group-hover:translate-x-3 transition-all duration-500 md:duration-700 ease-in-out md:opacity-0 md:group-hover:opacity-100 will-change-transform"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </section>
  );
}
