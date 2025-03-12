import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 z-10 bg-black/40" />
        <div className="relative h-[600px]">
          <Image
            src="/placeholder.svg?height=600&width=1200"
            alt="African clothing collection"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center md:px-6">
            <div className="space-y-4 text-white">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Timeless African Elegance
              </h1>
              <p className="mx-auto max-w-[700px] text-lg md:text-xl">
                Discover our collection of authentic African costumes, shirts,
                and pants crafted with tradition and style.
              </p>
              <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-white/90"
                >
                  Shop Collection
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="bg-muted/30 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Our Collections
              </h2>
              <p className="text-muted-foreground mx-auto max-w-[700px] md:text-lg">
                Explore our carefully curated categories of authentic African
                attire.
              </p>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="group relative overflow-hidden rounded-lg">
              <div className="absolute inset-0 z-10 bg-black/30 transition-colors group-hover:bg-black/40" />
              <Image
                src="/placeholder.svg?height=400&width=300"
                alt="Traditional Costumes"
                width={300}
                height={400}
                className="h-[400px] w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 z-20 flex items-end p-6">
                <div className="space-y-2 text-white">
                  <h3 className="text-xl font-bold">Traditional Costumes</h3>
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                  >
                    Explore
                  </Button>
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-lg">
              <div className="absolute inset-0 z-10 bg-black/30 transition-colors group-hover:bg-black/40" />
              <Image
                src="/placeholder.svg?height=400&width=300"
                alt="Modern Shirts"
                width={300}
                height={400}
                className="h-[400px] w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 z-20 flex items-end p-6">
                <div className="space-y-2 text-white">
                  <h3 className="text-xl font-bold">Modern Shirts</h3>
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                  >
                    Explore
                  </Button>
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-lg">
              <div className="absolute inset-0 z-10 bg-black/30 transition-colors group-hover:bg-black/40" />
              <Image
                src="/placeholder.svg?height=400&width=300"
                alt="Designer Pants"
                width={300}
                height={400}
                className="h-[400px] w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 z-20 flex items-end p-6">
                <div className="space-y-2 text-white">
                  <h3 className="text-xl font-bold">Designer Pants</h3>
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white/10"
                  >
                    Explore
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Products */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                New Arrivals
              </h2>
              <p className="text-muted-foreground mx-auto max-w-[700px] md:text-lg">
                Our latest collection of authentic African attire, crafted with
                precision and care.
              </p>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="group bg-background relative overflow-hidden rounded-lg border p-2"
              >
                <div className="bg-muted aspect-square overflow-hidden rounded-md">
                  <Image
                    src={`/placeholder.svg?height=300&width=300&text=Product+${item}`}
                    alt={`Product ${item}`}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="pt-3 pb-2">
                  <h3 className="text-sm font-medium">African Print Shirt</h3>
                  <p className="text-muted-foreground text-sm">
                    Traditional Design
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-base font-bold">$89.99</p>
                    <Button size="sm" variant="ghost">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Button className="gap-1">
              View All Products
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* First CTA Section */}
      <section className="bg-primary text-primary-foreground py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Handcrafted Excellence
              </h2>
              <p className="text-primary-foreground/90 md:text-lg">
                Each piece in our collection is meticulously crafted by skilled
                artisans, preserving traditional techniques while embracing
                modern designs.
              </p>
              <Button size="lg" variant="secondary" className="mt-2">
                Discover Our Process
              </Button>
            </div>
            <div className="relative h-[300px] overflow-hidden rounded-lg md:h-[400px]">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Artisan crafting"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16 lg:py-20">
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
                  src="/placeholder.svg?height=400&width=600"
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
                  src="/placeholder.svg?height=400&width=600"
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
      </section>

      {/* Second CTA Section */}
      <section className="bg-muted py-12 md:py-16 lg:py-20">
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
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                What Our Customers Say
              </h2>
              <p className="text-muted-foreground mx-auto max-w-[700px] md:text-lg">
                Hear from our satisfied customers about their experience with
                our products.
              </p>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-background rounded-lg border p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-muted h-10 w-10 overflow-hidden rounded-full">
                    <Image
                      src={`/placeholder.svg?height=40&width=40&text=User`}
                      alt="User"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">Customer Name</h3>
                    <p className="text-muted-foreground text-sm">
                      Verified Buyer
                    </p>
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
            src="/placeholder.svg?height=400&width=1200"
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
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-white/90"
                >
                  Shop Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Our Story
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
                Follow Our Journey
              </h2>
              <p className="text-muted-foreground mx-auto max-w-[700px] md:text-lg">
                Join us on Instagram for styling inspiration and
                behind-the-scenes content.
              </p>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="aspect-square overflow-hidden">
                <Image
                  src={`/placeholder.svg?height=200&width=200&text=Instagram+${item}`}
                  alt={`Instagram post ${item}`}
                  width={200}
                  height={200}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Button variant="outline" className="gap-1">
              Follow Us @AfriqueStyle
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
