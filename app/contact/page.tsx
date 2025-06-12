import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <main>
      {/* Page Header */}
      <section className="bg-muted/30 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Contact Us
              </h1>
              <p className="text-muted-foreground mx-auto max-w-[700px] md:text-lg">
                We're here to help you with any questions about our African
                clothing collection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Phone */}
            <div className="bg-card flex flex-col items-center space-y-4 rounded-lg border p-6 text-center">
              <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full">
                <Phone className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Phone</h3>
                <div className="text-muted-foreground space-y-1 text-sm">
                  <p>Main: +1 (555) 123-4567</p>
                  <p>Orders: +1 (555) 123-4568</p>
                  <p>WhatsApp: +1 (555) 123-4569</p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-card flex flex-col items-center space-y-4 rounded-lg border p-6 text-center">
              <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full">
                <Mail className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Email</h3>
                <div className="text-muted-foreground space-y-1 text-sm">
                  <p>info@afriquestyle.com</p>
                  <p>orders@afriquestyle.com</p>
                  <p>support@afriquestyle.com</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-card flex flex-col items-center space-y-4 rounded-lg border p-6 text-center">
              <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Address</h3>
                <div className="text-muted-foreground space-y-1 text-sm">
                  <p>123 Fashion Street</p>
                  <p>Cultural District</p>
                  <p>New York, NY 10001</p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-card flex flex-col items-center space-y-4 rounded-lg border p-6 text-center">
              <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full">
                <Clock className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Business Hours</h3>
                <div className="text-muted-foreground space-y-1 text-sm">
                  <p>Mon - Fri: 9:00 AM - 7:00 PM</p>
                  <p>Saturday: 10:00 AM - 6:00 PM</p>
                  <p>Sunday: 12:00 PM - 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Service */}
      <section className="bg-muted/30 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Customer Service
                </h2>
                <p className="text-muted-foreground md:text-lg">
                  Our dedicated team is here to assist you with any questions or
                  concerns about our African clothing collection.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">Quick Response</h3>
                    <p className="text-muted-foreground text-sm">
                      We respond to all inquiries within 24 hours during
                      business days.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold">Expert Guidance</h3>
                    <p className="text-muted-foreground text-sm">
                      Our team has extensive knowledge about African fashion and
                      cultural significance.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold">Personalized Service</h3>
                    <p className="text-muted-foreground text-sm">
                      We provide tailored recommendations based on your style
                      preferences and needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="mb-2 font-semibold">Need Immediate Help?</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  For urgent inquiries, call our customer service hotline or
                  reach out via WhatsApp.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button className="flex-1">Call Now</Button>
                  <Button variant="outline" className="flex-1">
                    WhatsApp
                  </Button>
                </div>
              </div>
              <div className="bg-card rounded-lg border p-6">
                <h3 className="mb-2 font-semibold">Visit Our Showroom</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Experience our collection in person at our flagship store in
                  the Cultural District.
                </p>
                <Button variant="outline" className="w-full">
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground mx-auto max-w-[700px] md:text-lg">
                Find answers to common questions about our products, shipping,
                and services.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  What materials are used in your African clothing?
                </AccordionTrigger>
                <AccordionContent>
                  We use authentic African fabrics including Ankara, Kente,
                  Dashiki, and other traditional textiles. All our materials are
                  sourced directly from African artisans and are made from
                  high-quality cotton, silk, and other natural fibers. Each
                  piece comes with information about its origin and cultural
                  significance.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  How do I determine the right size for African clothing?
                </AccordionTrigger>
                <AccordionContent>
                  African clothing often has different sizing compared to
                  Western garments. We provide detailed size charts for each
                  product category. Many of our traditional pieces are designed
                  to be loose-fitting for comfort. If you're unsure, we
                  recommend contacting our customer service team for
                  personalized sizing advice.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  Do you offer custom tailoring services?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, we offer custom tailoring for many of our garments. You
                  can request specific measurements, color combinations, or
                  design modifications. Custom orders typically take 2-4 weeks
                  to complete. Please contact us with your requirements, and
                  we'll provide a quote and timeline.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  What is your shipping and return policy?
                </AccordionTrigger>
                <AccordionContent>
                  We offer free shipping on orders over $100 within the
                  continental US. International shipping is available. We accept
                  returns within 30 days of purchase for unworn items in
                  original condition. Custom-made items are non-returnable
                  unless there's a manufacturing defect. Please see our full
                  shipping and returns policy for details.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>
                  How should I care for my African clothing?
                </AccordionTrigger>
                <AccordionContent>
                  Care instructions vary by fabric type. Generally, we recommend
                  hand washing or gentle machine wash in cold water for most
                  items. Avoid bleach and harsh detergents. Air dry when
                  possible to preserve colors and fabric integrity. Each garment
                  comes with specific care instructions. For delicate items like
                  Kente cloth, dry cleaning is recommended.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger>
                  Can you tell me about the cultural significance of the
                  patterns?
                </AccordionTrigger>
                <AccordionContent>
                  Each pattern and design in our collection has cultural meaning
                  and history. We provide detailed information about the origin,
                  symbolism, and traditional use of each design. Our team
                  includes cultural consultants who ensure authenticity and
                  respect for African heritage. Feel free to ask about any
                  specific pattern.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7">
                <AccordionTrigger>
                  Do you have a physical store I can visit?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, we have a flagship showroom located at 123 Fashion Street
                  in the Cultural District of New York. You can view our full
                  collection, try on garments, and speak with our knowledgeable
                  staff. We recommend calling ahead to schedule an appointment
                  for personalized service, especially for custom fittings.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-8">
                <AccordionTrigger>
                  Do you offer wholesale or bulk ordering?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, we work with retailers, cultural organizations, and event
                  planners for bulk orders. We offer wholesale pricing for
                  orders of 20+ pieces. Please contact our wholesale department
                  at wholesale@afriquestyle.com with your requirements, and
                  we'll provide a custom quote and terms.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-primary text-primary-foreground py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Still Have Questions?
              </h2>
              <p className="text-primary-foreground/90 mx-auto max-w-[600px] md:text-lg">
                Our team is ready to help you find the perfect African clothing
                for any occasion.
              </p>
            </div>
            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <Button size="lg" variant="secondary">
                Call Us Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
              >
                Send Email
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
