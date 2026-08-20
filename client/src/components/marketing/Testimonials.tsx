import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "NXT didn't just build us a product; they built our entire digital strategy. The execution was flawless.",
    name: "David Oladele",
    role: "CEO at FintechFlow",
  },
  {
    quote:
      "Direct and incredibly fast. They converted our messy idea into a sleek, functional app.",
    name: "Emeka Ugo",
    role: "Founder, Zenith Health",
  },
  {
    quote:
      "Just results. The brand identity they built for us completely shifted how our market perceives us.",
    name: "Elena Rodriguez",
    role: "Marketing Director, Vesper",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="w-full py-24 md:py-32 px-4 flex justify-center bg-background relative overflow-hidden"
    >
      {/* Decorative gradient */}
      <div className="absolute top-0 inset-x-0 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl w-full">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-6xl font-fraunces font-semibold mb-6">
            Don't just take our word for it.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We let our work and our partners speak for us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="bg-sidebar p-8 md:p-10 rounded-2xl border border-border flex flex-col justify-between group hover:border-primary/50 transition-colors duration-500"
            >
              <div>
                <div className="flex gap-1 mb-8 text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-lg leading-relaxed mb-8 text-foreground/90 font-medium">
                  "{testimonial.quote}"
                </p>
              </div>
              <div className="border-t border-border pt-6 mt-auto">
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
