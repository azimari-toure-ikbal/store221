"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CUSTOMER_SERVICE_PHONE } from "@/config";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

const QUESTIONS = [
  {
    question: "Quels sont les matériaux utilisés pour nos tenues ?",
    answer:
      "Nos tenues sont confectionnées avec des tissus de qualité premium, sélectionnés pour leur confort et leur élégance. Nous utilisons principalement du coton, du lin et de la laine, garantissant un rendu raffiné et durable.",
  },
  {
    question: "Comment déterminer la bonne taille pour passer commande ?",
    answer:
      "Nous mettons à votre disposition un guide des tailles adapté à chaque catégorie de produits pour vous aider à choisir la coupe parfaite. Si vous avez un doute, vous pouvez également nous contacter via WhatsApp, et nous vous accompagnerons dans la prise des bonnes mesures pour une tenue ajustée à votre morphologie.",
  },
  {
    question: "Proposez-vous des services de confection sur mesure ?",
    answer:
      "Oui, nous proposons la confection sur mesure pour de nombreux vêtements. Vous pouvez demander des mesures spécifiques, des combinaisons de couleurs ou des modifications de design. Les commandes personnalisées prennent généralement 2 à 3 semaines pour être réalisées. Veuillez nous contacter avec vos exigences, et nous vous fournirons un devis ainsi qu'un délai de livraison.",
  },
  {
    question: "Quelle est votre politique d’expédition et de retour ?",
    answer:
      "Nous livrons partout dans le monde via DHL Express, avec les frais à la charge du client. Pour les commandes au Sénégal, la livraison est gratuite. Pour les retours, vous pouvez renvoyer une tenue sous 30 jours après expédition, à vos frais. Si elle n’a jamais été portée, nous vous remboursons intégralement via PayPal, virement bancaire, Wave ou Orange Money. À noter : pour les commandes internationales, il peut arriver que des taxes douanières soient appliquées à la réception du colis, selon les réglementations du pays de destination. Le client peut consulter le site de DHL pour plus d’informations.",
  },
  {
    question: "Comment dois-je prendre soin de mes vêtements ?",
    answer:
      "Les instructions d'entretien varient selon le type de tissu. En général, nous recommandons un lavage doux en machine à l'eau froide pour la plupart des articles. Évitez l'eau de Javel et les détergents agressifs. Séchez à l'air libre lorsque c'est possible afin de préserver les couleurs et l'intégrité du tissu. Chaque vêtement est accompagné d'instructions spécifiques. Pour les articles délicats, comme les costumes africains, le nettoyage à sec est recommandé.",
  },
  {
    question: "Avez-vous un magasin physique que je peux visiter ?",
    answer:
      "Oui, nous avons un showroom principal situé au 1394 Sicap Liberté 2, Dakar, Sénégal. Vous pouvez y découvrir notre collection complète, essayer des vêtements et échanger avec notre équipe compétente. Nous recommandons d'appeler à l'avance pour prendre rendez-vous et bénéficier d'un service personnalisé, notamment pour les ajustements sur mesure.",
  },
  {
    question: "Proposez-vous des commandes en gros ou en grande quantité ?",
    answer:
      "Oui, nous collaborons avec des détaillants, des organisations culturelles et des planificateurs d'événements pour les commandes en grande quantité. Nous offrons des tarifs de gros pour les commandes de 20 pièces ou plus. Veuillez contacter notre département de vente en gros via WhatsApp au +221-76-572-4620 avec vos exigences, et nous vous fournirons un devis personnalisé ainsi que les conditions.",
  },
  {
    question: "Avez-vous des boutiques à l’international ?",
    answer:
      "Pas encore, mais nous travaillons activement à insérer nos produits dans des concept stores à travers le monde. En attendant, nous organisons parfois des ventes privées à l’étranger, offrant ainsi l’opportunité aux clients internationaux de découvrir et d’acquérir nos créations.",
  },
];

export default function ContactPage() {
  return (
    <main>
      {/* Page Header */}
      <section className="bg-muted/30 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Contactez Nous
              </h1>
              <p className="text-muted-foreground mx-auto max-w-[700px] md:text-lg">
                Nous sommes à votre disposition pour répondre à toutes vos
                questions sur nos produits et services.
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
                <h3 className="text-lg font-semibold">Téléphone</h3>
                <div className="text-muted-foreground space-y-1 text-sm">
                  <p>Principal: {CUSTOMER_SERVICE_PHONE}</p>
                  <p>WhatsApp: {CUSTOMER_SERVICE_PHONE}</p>
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
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-card flex flex-col items-center space-y-4 rounded-lg border p-6 text-center">
              <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Adresse</h3>
                <div className="text-muted-foreground space-y-1 text-sm">
                  <p>1394 Sicap Liberté 2</p>
                  <p>Dakar, Sénégal</p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-card flex flex-col items-center space-y-4 rounded-lg border p-6 text-center">
              <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full">
                <Clock className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Horaires</h3>
                <div className="text-muted-foreground space-y-1 text-sm">
                  <p>Lundi - Vendredi: 9:00 - 19:00</p>
                  <p>Samedi: 10:00 - 16:00</p>
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
                  Service client
                </h2>
                <p className="text-muted-foreground md:text-lg">
                  Notre équipe est là pour vous aider à répondre à toutes vos
                  demandes.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold">Réponse rapide</h3>
                    <p className="text-muted-foreground text-sm">
                      Nous répondons à toutes vos demandes dans les 24 heures.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold">Conseil expert</h3>
                    <p className="text-muted-foreground text-sm">
                      Notre équipe a une expertise approfondie sur la mode
                      africaine.
                    </p>
                  </div>
                </div>
                {/* <div className="flex items-start space-x-3">
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
                </div> */}
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-card rounded-lg border p-6">
                <h3 className="mb-2 font-semibold">
                  Besoin d&apos;aide immédiate ?
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Pour des demandes urgentes, appelez notre numéro de téléphone
                  de service client ou contactez-nous via WhatsApp.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button className="flex-1" asChild>
                    <Link href={`tel:${CUSTOMER_SERVICE_PHONE}`}>
                      Appeler maintenant
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link
                      href={`whatsapp://send?phone=221769019494`}
                      data-action="share/whatsapp/share"
                      target="_blank"
                    >
                      WhatsApp
                    </Link>
                  </Button>
                </div>
              </div>
              {/* <div className="bg-card rounded-lg border p-6">
                <h3 className="mb-2 font-semibold">Visit Our Showroom</h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Experience our collection in person at our flagship store in
                  the Cultural District.
                </p>
                <Button variant="outline" className="w-full">
                  Get Directions
                </Button>
              </div> */}
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
                Foire aux questions
              </h2>
              <p className="text-muted-foreground mx-auto max-w-[700px] md:text-lg">
                Trouvez les réponses aux questions les plus courantes sur nos
                produits, nos expéditions et nos services.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {QUESTIONS.map((item, index) => (
                <AccordionItem key={index} value={`question-${index}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      {/* <section className="bg-primary text-primary-foreground py-12 md:py-16 lg:py-20">
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
      </section> */}
    </main>
  );
}
