import africanShirt from "@/assets/img/african-shirt.jpg";
import classicShirt from "@/assets/img/classic-shirt.jpg";
import pants from "@/assets/img/pants.jpg";
import suit from "@/assets/img/suit.jpg";

import banner from "@/assets/img/banner.png";

import gal1 from "@/assets/img/gal/1.jpg";
import gal2 from "@/assets/img/gal/2.jpg";
import gal3 from "@/assets/img/gal/3.jpg";
import gal4 from "@/assets/img/gal/4.jpg";
import gal5 from "@/assets/img/gal/5.jpg";
import gal6 from "@/assets/img/gal/6.jpg";

import CollectionCard from "@/components/collection-card";
import NewArrivals from "@/components/home/new-arrivals";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const phototeque = [gal1, gal2, gal3, gal4, gal5, gal6];

export default function HomePage() {
  return (
    <main className="">
      {/* Hero Section */}
      <section className="relative">
        {/* <div className="absolute inset-0 z-10" /> */}
        <Link href={"/shop"}>
          <div className="relative h-[600px]">
            <Image
              src={banner.src}
              alt="African clothing collection"
              fill
              className="object-cover"
              priority
            />
          </div>
        </Link>
        {/* <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center md:px-6">
            <div className="space-y-4 text-white">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                L'élégance africaine intemporelle
              </h1>
              <p className="mx-auto max-w-[700px] text-lg md:text-xl">
                Découvrez notre collection de costumes, chemises et pantalons
                africains authentiques fabriqués dans le respect de la tradition
                et du style.
              </p>
              <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-white/90"
                >
                  <Link href={"/shop"}>Voir la boutique</Link>
                </Button>
              </div>
            </div>
          </div>
        </div> */}
      </section>

      {/* Featured Categories */}
      <section className="bg-muted/30 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Nos collections
              </h2>
              <p className="text-muted-foreground mx-auto max-w-[700px] md:text-lg">
                Explorez nos catégories soigneusement sélectionnées de vêtements
                made in Sénégal authentiques.
              </p>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <CollectionCard
              title="Chemises Classiques"
              image={classicShirt.src}
              type="CLASSIC_SHIRTS"
            />
            <CollectionCard
              title="Chemises Africaines"
              image={africanShirt.src}
              type="AFRICAN_SHIRTS"
            />
            <CollectionCard
              title="Costumes"
              image={suit.src}
              type="MEN_SUITS"
            />
            <CollectionCard title="Pantalons" image={pants.src} type="PANTS" />
          </div>
        </div>
      </section>

      {/* Recent Products */}
      <NewArrivals />

      {/* First CTA Section */}
      <section className="bg-primary/5 text-primary-foreground py-12 lg:py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            <div className="space-y-6">
              <p className="text-3xl font-bold tracking-tighter text-black sm:text-4xl md:text-5xl">
                Le costume africain.
              </p>
              <p className="text-primary text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Authentique.
              </p>
              <p className="text-primary text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Moderne.
              </p>
              <p className="text-primary text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Inoubliable.
              </p>

              <div className="space-y-4">
                {/* <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Excellence artisanale
                </h2> */}
                {/* <p className="text-white md:text-lg">
                  Chaque pièce est méticuleusement fabriquée par des artisans
                  qualifiés, qui préservent les techniques traditionnelles tout
                  en adoptant des designs modernes.
                </p> */}
              </div>
            </div>
            <div className="relative h-[300px] overflow-hidden rounded-lg md:h-[650px]">
              <Image
                src="/home/head2.jpg"
                alt="Artisan crafting"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {/* <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Featured Collection
              </h2>
              <p className="text-muted-foreground mx-auto max-w-[700px] md:text-lg">
                Our most popular designs, showcasing the rich heritage of
                African fashion.
              </p>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="group relative overflow-hidden rounded-lg border">
              <div className="aspect-[4/3] overflow-hidden">
                <Image
                  src="/placeholder.svg"
                  alt="Featured product 1"
                  width={600}
                  height={400}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold">Royal Ankara Set</h3>
                <p className="text-muted-foreground mt-2">
                  A stunning ensemble featuring traditional patterns with a
                  modern twist.
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-lg font-bold">$149.99</p>
                  <Button>Shop Now</Button>
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-lg border">
              <div className="aspect-[4/3] overflow-hidden">
                <Image
                  src="/placeholder.svg"
                  alt="Featured product 2"
                  width={600}
                  height={400}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold">Kente Collection</h3>
                <p className="text-muted-foreground mt-2">
                  Luxurious garments crafted from authentic Kente cloth,
                  symbolizing royalty and prestige.
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-lg font-bold">$199.99</p>
                  <Button>Shop Now</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Second CTA Section */}
      {/* <section className="bg-muted py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 text-center md:px-6">
          <div className="mx-auto max-w-[800px] space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Join Our Exclusive Collection
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Subscribe to receive updates on new arrivals, special promotions,
              and cultural insights.
            </p>
            <div className="mx-auto max-w-md space-y-2">
              <form className="flex space-x-2">
                <Input
                  className="flex-1"
                  placeholder="Enter your email"
                  type="email"
                />
                <Button type="submit">Subscribe</Button>
              </form>
              <p className="text-muted-foreground text-xs">
                By subscribing, you agree to our terms and privacy policy.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Testimonials */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ce que disent nos clients
              </h2>
              <p className="text-muted-foreground mx-auto max-w-[700px] md:text-lg">
                Lisez les témoignages de nos clients satisfaits sur leur
                expérience avec nos produits.
              </p>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-background rounded-lg border p-6">
                <div className="flex items-start space-x-4">
                  {/* <div className="bg-muted h-10 w-10 overflow-hidden rounded-full">
                    <Image
                      src={`/placeholder.svg`}
                      alt="User"
                      width={40}
                      height={40}
                    />
                  </div> */}
                  <div>
                    <h3 className="font-medium">Customer Name</h3>
                    <Badge>Achat vérifié</Badge>
                  </div>
                </div>
                <p className="text-muted-foreground mt-4">
                  "The quality and craftsmanship of my African shirt exceeded my
                  expectations. The fabric is beautiful and the fit is perfect.
                  I've received so many compliments!"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Third CTA Section */}
      <section className="relative py-12 md:py-16 lg:py-20">
        <div className="absolute inset-0 z-10 bg-black/60" />
        <div className="relative h-[400px]">
          <Image
            src={banner.src}
            alt="African fashion"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center md:px-6">
            <div className="mx-auto max-w-[800px] space-y-4 text-white">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Experience the Heritage
              </h2>
              <p className="md:text-lg">
                Our collection tells a story of culture, tradition, and
                artistry. Each garment is a piece of history.
              </p>
              <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href={"/shop"}>Boutique</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Photothèque
              </h2>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {phototeque.map((item, index) => (
              <div
                key={index}
                className="aspect-square overflow-hidden rounded-lg"
              >
                <Image
                  src={item.src || `/placeholder.svg`}
                  alt={`Galerie ${index}`}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
            ))}
          </div>
          {/* <div className="mt-6 flex justify-center">
            <Button variant="outline" className="gap-1">
              Follow Us @AfriqueStyle
            </Button>
          </div> */}
        </div>
      </section>
    </main>
  );
}
