import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | NXT",
  description: "Learn how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background pt-32 md:pt-40 pb-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <article className="w-full max-w-4xl mx-auto px-6 md:px-8 relative z-10">
        <header className="mb-16 md:mb-24">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-fraunces font-bold leading-tight tracking-tight mb-8 text-foreground">
            Privacy Policy.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Effective Date:{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </header>

        <div
          className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground
          [&>h2]:text-3xl [&>h2]:font-fraunces [&>h2]:font-semibold [&>h2]:text-foreground [&>h2]:mt-16 [&>h2]:mb-6
          [&>h3]:text-2xl [&>h3]:font-semibold [&>h3]:text-foreground [&>h3]:mt-10 [&>h3]:mb-4
          [&>p]:mb-6 [&>p]:leading-relaxed
          [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:mb-2
        "
        >
          <p>
            At NXT Studio ("we," "our," or "us"), we are committed to protecting
            your privacy. This Privacy Policy explains how we collect, use,
            disclose, and safeguard your information when you visit our website
            or engage with our services. Please read this privacy policy
            carefully. If you do not agree with the terms of this privacy
            policy, please do not access the site.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            We may collect information about you in a variety of ways. The
            information we may collect on the Site includes:
          </p>
          <h3>Personal Data</h3>
          <p>
            Personally identifiable information, such as your name, email
            address, and company name, that you voluntarily give to us when you
            submit an inquiry through our contact form or subscribe to our
            newsletter.
          </p>
          <h3>Derivative Data</h3>
          <p>
            Information our servers automatically collect when you access the
            Site, such as your IP address, your browser type, your operating
            system, your access times, and the pages you have viewed directly
            before and after accessing the Site.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            Having accurate information about you permits us to provide you with
            a smooth, efficient, and customized experience. Specifically, we may
            use information collected about you via the Site to:
          </p>
          <ul>
            <li>
              Respond to your project inquiries and provide customer service.
            </li>
            <li>
              Compile anonymous statistical data and analysis for use internally
              or with third parties.
            </li>
            <li>
              Deliver targeted advertising, newsletters, and other information
              regarding promotions and the Site to you.
            </li>
            <li>Increase the efficiency and operation of the Site.</li>
            <li>
              Monitor and analyze usage and trends to improve your experience
              with the Site.
            </li>
          </ul>

          <h2>3. Disclosure of Your Information</h2>
          <p>
            We may share information we have collected about you in certain
            situations. Your information may be disclosed as follows:
          </p>
          <h3>By Law or to Protect Rights</h3>
          <p>
            If we believe the release of information about you is necessary to
            respond to legal process, to investigate or remedy potential
            violations of our policies, or to protect the rights, property, and
            safety of others, we may share your information as permitted or
            required by any applicable law, rule, or regulation.
          </p>
          <h3>Third-Party Service Providers</h3>
          <p>
            We may share your information with third parties that perform
            services for us or on our behalf, including payment processing, data
            analysis, email delivery, hosting services, customer service, and
            marketing assistance.
          </p>

          <h2>4. Security of Your Information</h2>
          <p>
            We use administrative, technical, and physical security measures to
            help protect your personal information. While we have taken
            reasonable steps to secure the personal information you provide to
            us, please be aware that despite our efforts, no security measures
            are perfect or impenetrable, and no method of data transmission can
            be guaranteed against any interception or other type of misuse.
          </p>

          <h2>5. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please
            contact us at:
          </p>
          <p className="font-semibold text-foreground">
            NXT Studio <br />
            Email:{" "}
            <a
              href="mailto:pharezoyelade@gmail.com"
              className="text-primary hover:underline transition-colors"
            >
              pharezoyelade@gmail.com
            </a>
          </p>
        </div>
      </article>
    </main>
  );
}
