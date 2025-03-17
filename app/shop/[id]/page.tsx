"use client";

import parse from "html-react-parser";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useRef, useState } from "react";

import IsLoading from "@/components/is-loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { currencyAtom } from "@/lib/atoms";
import {
  collarTypes,
  CollarTypes,
  PantFits,
  PantLegs,
  sizes,
  Sizes,
  sleevesLengths,
  SleevesLengths,
  wristsTypes,
  WristsTypes,
} from "@/lib/db/schema";
import {
  cn,
  createProductOptionsParams,
  formatCollarType,
  formatPrice,
  formatSleevesLength,
  formatType,
  formatWristsType,
} from "@/lib/utils";
import { trpc } from "@/server/trpc/client";
import { useAtomValue } from "jotai";
import React from "react";

type ProductType = "SUITS" | "SHIRTS" | "PANTS";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

type Props = {
  params: Params;
  searchParams: SearchParams;
};

type SelectedOptions = {
  [key: string]: string;
};

export default function ProductDetailPage({ params, searchParams }: Props) {
  const { id } = use(params);
  const sParams = use(searchParams);

  const initialized = useRef(false);

  const currency = useAtomValue(currencyAtom);

  const [selectedOptions, setSelectedOptions] = useState<{
    size: Sizes | "sur-mesure";
    sleevesLength?: SleevesLengths;
    collarType?: CollarTypes;
    wristsType?: WristsTypes;
    pantFit?: PantFits;
    pantLeg?: PantLegs;
  }>({
    size: "XS",
  });

  const { addProductToCart, addingProduct } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [showInitials, setShowInitials] = useState(false);
  const [initials, setInitials] = useState("");

  const { data: product, isLoading } = trpc.products.getProductDetails.useQuery(
    {
      id,
    },
  );

  React.useEffect(() => {
    // This call now creates the query parameters and updates the URL automatically.
    createProductOptionsParams(selectedOptions);
  }, [selectedOptions]);

  React.useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initialOptions = {
      size: (sParams.size as Sizes | "sur-mesure") || "XS",
      collarType: sParams.collarType as CollarTypes | undefined,
      sleevesLength: sParams.sleevesLength as SleevesLengths | undefined,
      wristsType: sParams.wristsType as WristsTypes | undefined,
      pantFit: sParams.pantFit as PantFits | undefined,
      pantLeg: sParams.pantLeg as PantLegs | undefined,
    };

    setSelectedOptions(initialOptions);
  }, [sParams]);

  const relatedProducts = [
    {
      id: 1,
      name: "Ankara Print Shirt",
      price: "$89.99",
      image: "/placeholder.svg?height=300&width=250",
    },
    {
      id: 2,
      name: "Kente Fabric Suit",
      price: "$169.99",
      image: "/placeholder.svg?height=300&width=250",
    },
    {
      id: 3,
      name: "Dashiki Top",
      price: "$59.99",
      image: "/placeholder.svg?height=300&width=250",
    },
    {
      id: 4,
      name: "Mud Cloth Pants",
      price: "$79.99",
      image: "/placeholder.svg?height=300&width=250",
    },
  ];

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const toggleInitials = () => {
    setShowInitials((prev) => !prev);
    if (showInitials) setInitials("");
  };

  const nextImage = () => {
    if (!product) return;
    setCurrentImage((prev) => (prev + 1) % product.gallery.length);
  };

  const prevImage = () => {
    if (!product) return;
    setCurrentImage(
      (prev) => (prev - 1 + product?.gallery.length) % product?.gallery.length,
    );
  };

  // Render options based on product type
  const renderProductOptions = () => {
    if (!product) return;
    switch (product.type) {
      case "SHIRTS":
        return (
          <>
            <div className="space-y-3">
              <h3 className="font-medium">Longeur des manches</h3>
              <RadioGroup
                defaultValue={selectedOptions.sleevesLength}
                className="flex flex-wrap gap-2"
                onValueChange={(val) => {
                  setSelectedOptions({
                    ...selectedOptions,
                    sleevesLength: val as SleevesLengths,
                  });
                }}
              >
                {sleevesLengths.map((sleeve, index) => (
                  <div key={index}>
                    <RadioGroupItem
                      id={sleeve}
                      value={sleeve}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={sleeve}
                      className="border-border bg-background peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 flex h-10 cursor-pointer items-center justify-center rounded-md border px-4"
                    >
                      {formatSleevesLength(sleeve)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Type de col</h3>
              <RadioGroup
                defaultValue={selectedOptions.collarType}
                className="flex flex-wrap gap-4"
                onValueChange={(val) => {
                  setSelectedOptions({
                    ...selectedOptions,
                    collarType: val as CollarTypes,
                  });
                }}
              >
                {collarTypes.map((col, index) => (
                  <div key={index}>
                    <RadioGroupItem
                      id={col}
                      value={col}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={col}
                      className="border-border bg-background peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 relative flex h-10 cursor-pointer items-center justify-center rounded-md border px-4"
                    >
                      {formatCollarType(col)}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"secondary"}
                            size={"icon"}
                            className="absolute -top-2 -right-2 size-5 rounded-full p-3"
                          >
                            <Info />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent side="right">
                          {col === "MINIMALISTIC" ? (
                            <p className="text-justify text-xs">
                              Le col minimaliste, également connu sous le nom de
                              col officier, se distingue par son style épuré et
                              moderne. Il s'adapte aussi bien à une chemise
                              formelle pour un look sophistiqué qu'à une chemise
                              d'été en lin pour un style décontracté. La
                              rigidité du col varie en fonction du tissu :
                              souple pour les matières casual et plus rigide
                              pour les tissus formels.
                            </p>
                          ) : (
                            <p className="text-justify text-xs">
                              Le col standard, aussi appelé col italien, est un
                              choix business polyvalent. Adaptable, il peut se
                              porter avec ou sans cravate. De taille moyenne,
                              avec des pointes plutôt évasées, il offre une
                              tenue parfaite et est équipé de baleines
                              amovibles.
                            </p>
                          )}
                        </PopoverContent>
                      </Popover>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Type de poignets</h3>
              <RadioGroup
                defaultValue={selectedOptions.wristsType}
                className="flex flex-wrap gap-2"
                onValueChange={(val) => {
                  setSelectedOptions({
                    ...selectedOptions,
                    wristsType: val as WristsTypes,
                  });
                }}
              >
                {wristsTypes.map((wrist, index) => (
                  <div key={index}>
                    <RadioGroupItem
                      id={wrist}
                      value={wrist}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={wrist}
                      className="border-border bg-background peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 relative flex h-10 cursor-pointer items-center justify-center rounded-md border px-4"
                    >
                      {formatWristsType(wrist)}

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"secondary"}
                            size={"icon"}
                            className="absolute -top-2 -right-2 size-5 rounded-full p-3"
                          >
                            <Info />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent side="right">
                          {wrist === "SIMPLE" ? (
                            <p className="text-justify text-xs">
                              Les poignets simples sont adaptés à tous les
                              styles quotidiens, qu'ils soient casual ou
                              business. Leurs angles biseautés leur confèrent
                              une allure contemporaine et ils se ferment par un
                              bouton. leur rigidité et leur hauteur sont
                              adjustés en fonction du type de tissu choisi : des
                              poignets plus souples pour les tissus casual et
                              plus rigides pour les tissus formels.
                            </p>
                          ) : (
                            <p className="text-justify text-xs">
                              Les poignets mousquetaires sont parfaits pour des
                              chemises cérémonie ou pour créer un look business
                              sophistiqué. Ces poignets sont doublés, ils se
                              replient et se ferment à l'aide de boutons de
                              manchettes (non fournies).
                            </p>
                          )}
                        </PopoverContent>
                      </Popover>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </>
        );
      case "PANTS":
        return (
          <>
            <div className="space-y-3">
              <h3 className="font-medium">Pant Fit</h3>
              <RadioGroup defaultValue="slim" className="flex flex-wrap gap-2">
                <div>
                  <RadioGroupItem
                    id="slim"
                    value="slim"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="slim"
                    className="border-border bg-background peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 flex h-10 cursor-pointer items-center justify-center rounded-md border px-4"
                  >
                    Slim Fit
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    id="regular"
                    value="regular"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="regular"
                    className="border-border bg-background peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 flex h-10 cursor-pointer items-center justify-center rounded-md border px-4"
                  >
                    Regular Fit
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    id="relaxed"
                    value="relaxed"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="relaxed"
                    className="border-border bg-background peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 flex h-10 cursor-pointer items-center justify-center rounded-md border px-4"
                  >
                    Relaxed Fit
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Pant Leg</h3>
              <Select defaultValue="straight">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select pant leg style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="straight">Straight Leg</SelectItem>
                  <SelectItem value="tapered">Tapered Leg</SelectItem>
                  <SelectItem value="wide">Wide Leg</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      case "SUITS":
        return (
          <>
            <div className="space-y-3">
              <h3 className="font-medium">Jacket Style</h3>
              <Select defaultValue="single">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select jacket style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Breasted</SelectItem>
                  <SelectItem value="double">Double Breasted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Lapel Style</h3>
              <Select defaultValue="notch">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select lapel style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="notch">Notch Lapel</SelectItem>
                  <SelectItem value="peak">Peak Lapel</SelectItem>
                  <SelectItem value="shawl">Shawl Lapel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Sleeve Length</h3>
              <RadioGroup defaultValue="long" className="flex flex-wrap gap-2">
                <div>
                  <RadioGroupItem
                    id="short-suit"
                    value="short"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="short-suit"
                    className="border-border bg-background peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 flex h-10 cursor-pointer items-center justify-center rounded-md border px-4"
                  >
                    Short Sleeve
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    id="long-suit"
                    value="long"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="long-suit"
                    className="border-border bg-background peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 flex h-10 cursor-pointer items-center justify-center rounded-md border px-4"
                  >
                    Long Sleeve
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Pant Fit</h3>
              <RadioGroup defaultValue="slim" className="flex flex-wrap gap-2">
                <div>
                  <RadioGroupItem
                    id="slim-suit"
                    value="slim"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="slim-suit"
                    className="border-border bg-background peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 flex h-10 cursor-pointer items-center justify-center rounded-md border px-4"
                  >
                    Slim Fit
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    id="regular-suit"
                    value="regular"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="regular-suit"
                    className="border-border bg-background peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 flex h-10 cursor-pointer items-center justify-center rounded-md border px-4"
                  >
                    Regular Fit
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <IsLoading className="size-8" />
      </div>
    );

  if (!product) return <div>Ooops... Nous n'avons pas trouvé ce produit.</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="border-border relative h-[500px] overflow-hidden rounded-lg border">
            <Image
              src={product?.gallery[currentImage] || "/placeholder.svg"}
              alt="Product image"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <Button
                variant="ghost"
                size="icon"
                className="bg-background/80 hover:bg-background rounded-full"
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Previous image</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-background/80 hover:bg-background rounded-full"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Next image</span>
              </Button>
            </div>
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {product?.gallery.map((image, index) => (
              <button
                key={index}
                className={cn(
                  "relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border-2",
                  currentImage === index ? "border-primary" : "border-border",
                )}
                onClick={() => setCurrentImage(index)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Product thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="mb-2 text-3xl font-bold">{product?.name} </h1>
              <hr className="w-6 rotate-90 bg-black" />
              <Badge>{formatType(product.type)}</Badge>
            </div>

            <p className="mb-4 text-2xl font-semibold">
              {formatPrice(Number(product.price), currency.code, currency.rate)}
            </p>
            {/* <p className="text-muted-foreground">
              This handcrafted piece features traditional African designs and
              techniques. Each item is uniquely patterned using methods that
              have been passed down through generations, ensuring authentic
              cultural representation and exceptional quality.
            </p> */}
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h3 className="mb-3 font-medium">Choisissez la taille</h3>
              <RadioGroup
                defaultValue={selectedOptions.size}
                className="flex flex-wrap gap-2"
                onValueChange={(val) => {
                  if (val === "sur-mesure") {
                    setSelectedOptions({ ...selectedOptions, size: val });
                  } else {
                    setSelectedOptions({
                      ...selectedOptions,
                      size: val as Sizes,
                    });
                  }
                }}
              >
                {sizes.map((size, index) => (
                  <div key={index}>
                    <RadioGroupItem
                      id={size}
                      value={size}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={size}
                      className="border-border bg-background peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border"
                    >
                      {size}
                    </Label>
                  </div>
                ))}

                <div>
                  <RadioGroupItem
                    id={"sur-mesure"}
                    value={"sur-mesure"}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={"sur-mesure"}
                    className="border-border bg-background peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 flex h-10 w-fit cursor-pointer items-center justify-center rounded-md border px-4"
                  >
                    Sur mesure
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Dynamic Product Options */}
            {renderProductOptions()}

            {/* Initials Section */}
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={toggleInitials}
                className={showInitials ? "border-primary text-primary" : ""}
              >
                {showInitials ? "Annuler" : "Ajouter vos initiales"}
              </Button>

              {showInitials && (
                <div className="space-y-2">
                  <Label htmlFor="initials">
                    Vos initiales (max 3 caractères)
                  </Label>
                  <Input
                    id="initials"
                    value={initials}
                    onChange={(e) =>
                      setInitials(e.target.value.slice(0, 3).toUpperCase())
                    }
                    placeholder="e.g. ABC"
                    maxLength={3}
                    className="w-24"
                  />
                  <p className="text-muted-foreground text-sm">
                    Les initiales seront brodées sur{" "}
                    {product?.type === "PANTS"
                      ? "la poche arrière"
                      : "la manchette"}
                  </p>
                </div>
              )}
            </div>

            <div>
              <h3 className="mb-3 font-medium">Quantité</h3>
              <div className="border-border flex w-fit items-center rounded-md border">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none"
                  onClick={decrementQuantity}
                  disabled={!quantity || quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Decrease quantity</span>
                </Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none"
                  onClick={incrementQuantity}
                  disabled={!quantity || quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Increase quantity</span>
                </Button>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            disabled={addingProduct}
            className="w-full md:w-auto"
            onClick={() => {
              // console.log("Add product to cart quantity is: ", quantity);

              addProductToCart(
                {
                  image: product.gallery[0],
                  name: product.name,
                  productId: product.id,
                  productType: product.type,
                  price: Number(product.price),
                  quantity,
                  stock: Number(product.stock),
                  options: selectedOptions,
                },
                quantity,
              );
            }}
          >
            {addingProduct ? (
              <IsLoading />
            ) : (
              <>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Ajouter au panier
              </>
            )}
          </Button>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-medium">Description du produit</h3>
            <div className="prose w-full">
              {parse(product.description || "")}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div>
        <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {relatedProducts.map((product) => (
            <Link href="#" key={product.id} className="group">
              <div className="space-y-3">
                <div className="bg-muted relative aspect-[4/5] overflow-hidden rounded-lg">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div>
                  <h3 className="font-medium group-hover:underline">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground">{product.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
