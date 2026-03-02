import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import companies from "../data/companies.json";
import faqs from "../data/faq.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <main className="flex flex-col gap-24 py-16">

      {/* HERO SECTION */}
      <section className="text-center relative px-6">
        <div className="max-w-5xl mx-auto">

          <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-tight">
            Build Your Future
          </h1>

          <h2 className="mt-6 text-2xl sm:text-3xl text-white font-semibold">
            Find Your Dream Job with <span className="text-blue-400">CarrerRise</span>
          </h2>

          <p className="text-gray-400 mt-6 text-lg sm:text-xl max-w-2xl mx-auto">
            Search. Apply. Succeed. Unlock endless high-growth career opportunities.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-10">
            <Link to="/jobs">
              <Button
                size="xl"
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 h-14 text-lg rounded-xl shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
              >
                Find Jobs
              </Button>
            </Link>

            <Link to="/post-job">
              <Button
                size="xl"
                variant="outline"
                className="border-gray-500 text-white px-10 h-14 text-lg rounded-xl hover:bg-white hover:text-black transition-all duration-300"
              >
                Post a Job
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* COMPANY CAROUSEL */}
      <section>
        <h2 className="text-center text-gray-400 mb-8 text-sm uppercase tracking-wider">
          Trusted by top companies
        </h2>

        <Carousel
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="flex gap-10 items-center">
            {companies.map(({ name, id, path }) => (
              <CarouselItem key={id} className="basis-1/3 lg:basis-1/6">
                <img
                  src={path}
                  alt={name}
                  className="h-10 sm:h-14 object-contain opacity-70 hover:opacity-100 transition"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      {/* FEATURE SECTION */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <Card className="bg-white/5 backdrop-blur border border-gray-700 text-white hover:scale-105 transition">
            <CardHeader>
              <CardTitle className="font-bold text-xl">
                For Job Seekers
              </CardTitle>
            </CardHeader>
            <CardContent>
              Search and apply for jobs, track applications, and discover
              opportunities tailored to your skills.
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur border border-gray-700 text-white hover:scale-105 transition">
            <CardHeader>
              <CardTitle className="font-bold text-xl">
                For Employers
              </CardTitle>
            </CardHeader>
            <CardContent>
              Post jobs, manage applications, and find top talent with ease.
              Simplify your hiring process.
            </CardContent>
          </Card>

        </div>
      </section>

      {/* BANNER IMAGE */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-cyan-400">
          Connect. Apply. Get Hired.
        </h2>

        <p className="text-gray-400 mt-6 text-lg max-w-2xl mx-auto">
          Explore top career opportunities and build your professional network today.
        </p>

        <div className="mt-12">
          <img
            src="/banner.png"
            alt="Career Network"
            className="mx-auto max-w-3xl opacity-90"
          />
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Frequently Asked Questions
        </h2>

        <Accordion type="multiple" className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

    </main>
  );
};

export default LandingPage;