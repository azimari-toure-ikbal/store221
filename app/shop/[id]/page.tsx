"use client";

// import IkImage from "@/lib/image";
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
import { use, useState } from "react";

import IsLoading from "@/components/is-loading";
import ProductDetailActions from "@/components/product-detail-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { INITIALS_PRICE } from "@/config";
import { useCart } from "@/hooks/use-cart";
import { useProductFilters } from "@/hooks/use-states";
import { currencyAtom } from "@/lib/atoms";
import {
  collarTypes,
  CollarTypes,
  pantFits,
  PantFits,
  pantLegs,
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
  formatCollarType,
  formatPantFit,
  formatPantLeg,
  formatPrice,
  formatSleevesLength,
  formatType,
  formatWristsType,
} from "@/lib/utils";
import { trpc } from "@/server/trpc/client";
import { useAtomValue } from "jotai";
import React from "react";
import { toast } from "sonner";

type Params = Promise<{ id: string }>;

type Props = {
  params: Params;
};

export default function ProductDetailPage({ params }: Props) {
  const { id } = use(params);

  const currency = useAtomValue(currencyAtom);

  const { addProductToCart, addingProduct } = useCart();

  const [{ quantity, selectedOptions }, setFilters] = useProductFilters();

  const [currentImage, setCurrentImage] = useState(0);
  const [showInitials, setShowInitials] = useState(false);

  React.useEffect(() => {
    if (selectedOptions.initials !== "") setShowInitials(true);
  }, [selectedOptions.initials]);

  const { data: product, isLoading } = trpc.products.getProductDetails.useQuery(
    {
      id,
    },
  );

  const { data: otherProducts, isLoading: otherLoading } =
    trpc.products.getOtherProducts.useQuery(
      {
        type: product?.type || "AFRICAN_SHIRTS",
      },
      {
        enabled: !!product,
      },
    );

  const incrementQuantity = () =>
    setFilters((prev) => ({ ...prev, quantity: prev.quantity + 1 }));
  const decrementQuantity = () =>
    setFilters((prev) => ({
      ...prev,
      quantity: prev.quantity > 1 ? prev.quantity - 1 : 1,
    }));

  const toggleInitials = () => {
    setShowInitials((prev) => !prev);
    if (showInitials)
      setFilters((prev) => ({
        ...prev,
        selectedOptions: {
          ...prev.selectedOptions,
          initials: "",
        },
      }));
  };

  // console.log("filters", selectedOptions);

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

  // React.useEffect(() => {
  //   if (!showInitials) {
  //     setFilters((prev) => ({
  //       ...prev,
  //       selectedOptions: {
  //         ...prev.selectedOptions,
  //         initials: "",
  //       },
  //     }));
  //   }
  // }, [setFilters, showInitials]);

  // Render options based on product type
  const renderProductOptions = () => {
    if (!product) return;

    switch (product.type) {
      case "CLASSIC_SHIRTS":
      case "AFRICAN_SHIRTS":
        return (
          <>
            {/* Sleeves options */}
            <div className="space-y-3">
              <h3 className="font-medium">Longeur des manches</h3>
              <RadioGroup
                defaultValue={selectedOptions.sleevesLength}
                className="flex flex-wrap gap-2"
                onValueChange={(val) => {
                  setFilters((prev) => ({
                    ...prev,
                    selectedOptions: {
                      ...prev.selectedOptions,
                      sleevesLength: val as SleevesLengths,
                    },
                  }));
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

            {/* Collar options */}
            {selectedOptions.sleevesLength === "LONG" ||
              (product.type === "CLASSIC_SHIRTS" && (
                <div className="space-y-3">
                  <h3 className="font-medium">Type de col</h3>
                  <RadioGroup
                    defaultValue={selectedOptions.collarType}
                    className="flex flex-wrap gap-4"
                    onValueChange={(val) => {
                      setFilters((prev) => ({
                        ...prev,
                        selectedOptions: {
                          ...prev.selectedOptions,
                          collarType: val as CollarTypes,
                        },
                      }));
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
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant={"secondary"}
                                size={"icon"}
                                className="absolute -top-2 -right-2 size-5 rounded-full p-3"
                              >
                                <Info />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  {formatCollarType(col)}
                                </DialogTitle>
                                <DialogDescription>
                                  {col === "MINIMALISTIC" ? (
                                    <p className="text-justify text-xs">
                                      Le col minimaliste, également connu sous
                                      le nom de col officier, se distingue par
                                      son style épuré et moderne. Il s'adapte
                                      aussi bien à une chemise formelle pour un
                                      look sophistiqué qu'à une chemise d'été en
                                      lin pour un style décontracté. La rigidité
                                      du col varie en fonction du tissu : souple
                                      pour les matières casual et plus rigide
                                      pour les tissus formels.
                                    </p>
                                  ) : (
                                    <p className="text-justify text-xs">
                                      Le col standard, aussi appelé col italien,
                                      est un choix business polyvalent.
                                      Adaptable, il peut se porter avec ou sans
                                      cravate. De taille moyenne, avec des
                                      pointes plutôt évasées, il offre une tenue
                                      parfaite et est équipé de baleines
                                      amovibles.
                                    </p>
                                  )}
                                </DialogDescription>
                              </DialogHeader>
                              <img
                                src={
                                  col === "STANDARD"
                                    ? "/shop/Col-standard.png"
                                    : "/shop/Col-minimaliste.png"
                                }
                                alt="collar"
                                className="aspect-square h-auto w-full rounded-lg border"
                              />
                            </DialogContent>
                          </Dialog>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}

            {/* Wrists options */}
            {selectedOptions.sleevesLength === "LONG" && (
              <div className="space-y-3">
                <h3 className="font-medium">Type de poignets</h3>
                <RadioGroup
                  defaultValue={selectedOptions.wristsType}
                  className="flex flex-wrap gap-2"
                  onValueChange={(val) => {
                    setFilters((prev) => ({
                      ...prev,
                      selectedOptions: {
                        ...prev.selectedOptions,
                        wristsType: val as WristsTypes,
                      },
                    }));
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

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant={"secondary"}
                              size={"icon"}
                              className="absolute -top-2 -right-2 size-5 rounded-full p-3"
                            >
                              <Info />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                {formatWristsType(wrist)}
                              </DialogTitle>
                              <DialogDescription>
                                {wrist === "SIMPLE" ? (
                                  <p className="text-justify text-xs">
                                    Les poignets simples sont adaptés à tous les
                                    styles quotidiens, qu'ils soient casual ou
                                    business. Leurs angles biseautés leur
                                    confèrent une allure contemporaine et ils se
                                    ferment par un bouton. leur rigidité et leur
                                    hauteur sont adjustés en fonction du type de
                                    tissu choisi : des poignets plus souples
                                    pour les tissus casual et plus rigides pour
                                    les tissus formels.
                                  </p>
                                ) : (
                                  <p className="text-justify text-xs">
                                    Les poignets mousquetaires sont parfaits
                                    pour des chemises cérémonie ou pour créer un
                                    look business sophistiqué. Ces poignets sont
                                    doublés, ils se replient et se ferment à
                                    l'aide de boutons de manchettes (non
                                    fournies).
                                  </p>
                                )}
                              </DialogDescription>
                            </DialogHeader>
                            <img
                              src={
                                wrist === "SIMPLE"
                                  ? "/shop/Poignet-Simple.png"
                                  : "/shop/Poignet-Mousquetaire.png"
                              }
                              alt="collar"
                              className="aspect-square h-auto w-full rounded-lg border"
                            />
                          </DialogContent>
                        </Dialog>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
          </>
        );
      case "PANTS":
        return (
          <>
            {/* Pant fit options */}
            <div className="space-y-3">
              <h3 className="font-medium">Coupe de pantalon</h3>
              <RadioGroup
                defaultValue={selectedOptions.pantFit}
                className="flex flex-wrap gap-4"
                onValueChange={(val) => {
                  setFilters((prev) => ({
                    ...prev,
                    selectedOptions: {
                      ...prev.selectedOptions,
                      pantFit: val as PantFits,
                    },
                  }));
                }}
              >
                {pantFits.map((fit, index) => (
                  <div key={index}>
                    <RadioGroupItem
                      id={fit}
                      value={fit}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={fit}
                      className="border-border bg-background peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 relative flex h-10 cursor-pointer items-center justify-center rounded-md border px-4"
                    >
                      {formatPantFit(fit)}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant={"secondary"}
                            size={"icon"}
                            className="absolute -top-2 -right-2 size-5 rounded-full p-3"
                          >
                            <Info />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{formatPantFit(fit)}</DialogTitle>
                            <DialogDescription>
                              {fit === "REGULAR" ? (
                                <p className="text-justify text-xs">
                                  La coupe regular offre comme son nom l’indique
                                  une forme droite de la taille jusqu’aux
                                  chevilles. C’est la coupe la plus classique et
                                  la plus indémodable. La coupe droite s’adapte
                                  à toutes les morphologies, petites ou grandes.
                                  C’est aussi la forme à privilégier si vous
                                  êtes un peu fort. Classique et décontractée,
                                  la coupe regular s'adapte à toutes les
                                  occasions et à tous les styles vestimentaires
                                  : tee-shirt, pull, veste, chemise...
                                </p>
                              ) : (
                                <p className="text-justify text-xs">
                                  De forme droite mais resserrée au niveau des
                                  cuisses et des chevilles, la coupe slim est la
                                  coupe du moment. Cette coupe est
                                  principalement recommandée pour les
                                  silhouettes minces et longilignes. Comme elle
                                  laisse bien apparaitre vos chaussures vous
                                  pouvez donc porter le jean slom avec des
                                  Derbies ou des baskets du type Converse. Vous
                                  pourrez également marier votre jean avec une
                                  chemise pour un look mode et tendance. Pour un
                                  style plus classique, optez pour des
                                  mocassins.
                                </p>
                              )}
                            </DialogDescription>
                          </DialogHeader>
                          {/* <img
                            src={
                              fit === "REGULAR"
                                ? "/shop/Bas-ourlet.png"
                                : "/shop/Bas-releve.png"
                            }
                            alt="collar"
                            className="aspect-square h-auto w-full rounded-lg border"
                          /> */}
                        </DialogContent>
                      </Dialog>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Pant Leg options*/}
            <div className="space-y-3">
              <h3 className="font-medium">Bas de pantalon</h3>
              <RadioGroup
                defaultValue={selectedOptions.pantLeg}
                className="flex flex-wrap gap-4"
                onValueChange={(val) => {
                  setFilters((prev) => ({
                    ...prev,
                    selectedOptions: {
                      ...prev.selectedOptions,
                      pantLeg: val as PantLegs,
                    },
                  }));
                }}
              >
                {pantLegs.map((leg, index) => (
                  <div key={index}>
                    <RadioGroupItem
                      id={leg}
                      value={leg}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={leg}
                      className="border-border bg-background peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 relative flex h-10 cursor-pointer items-center justify-center rounded-md border px-4"
                    >
                      {formatPantLeg(leg)}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant={"secondary"}
                            size={"icon"}
                            className="absolute -top-2 -right-2 size-5 rounded-full p-3"
                          >
                            <Info />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{formatPantLeg(leg)}</DialogTitle>
                            <DialogDescription>
                              {leg === "OUTLET" ? (
                                <p className="text-justify text-xs">
                                  Le pantalon à ourlets est un type de pantalon
                                  dont les bords inférieurs des jambes sont
                                  ourlés. Cela peut ajouter une touche de style
                                  et de sophistication à la tenue, et il est
                                  souvent utilisé pour donner un aspect plus
                                  soigné et structuré au vêtement. Les pantalons
                                  à ourlets peuvent être ajustés pour
                                  différentes longueurs, ce qui permet de
                                  personnaliser l'apparence en fonction des
                                  préférences de l'individu.
                                </p>
                              ) : (
                                <p className="text-justify text-xs">
                                  Le revers est une technique de finition du bas
                                  d'un pantalon qui consiste à retourner le
                                  tissu vers l'extérieur, créant ainsi un pli
                                  apparent qui ajoute une touche stylistique
                                  unique au vêtement.
                                </p>
                              )}
                            </DialogDescription>
                          </DialogHeader>
                          <img
                            src={
                              leg === "OUTLET"
                                ? "/shop/Bas-ourlet.png"
                                : "/shop/Bas-releve.png"
                            }
                            alt="collar"
                            className="aspect-square h-auto w-full rounded-lg border"
                          />
                        </DialogContent>
                      </Dialog>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </>
        );
      case "MEN_SUITS":
      case "WOMEN_SUITS":
        return (
          <div className="grid grid-cols-2 gap-4">
            {/* Sleeves options */}
            {/* <div className="space-y-3">
              <h3 className="font-medium">Longeur des manches</h3>
              <RadioGroup
                defaultValue={selectedOptions.sleevesLength}
                className="flex flex-wrap gap-2"
                onValueChange={(val) => {
                  setFilters((prev) => ({
                    ...prev,
                    selectedOptions: {
                      ...prev.selectedOptions,
                      sleevesLength: val as SleevesLengths,
                    },
                  }));
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
            </div> */}

            {/* Collar options */}
            {/* <div className="space-y-3">
              <h3 className="font-medium">Type de col</h3>
              <RadioGroup
                defaultValue={selectedOptions.collarType}
                className="flex flex-wrap gap-4"
                onValueChange={(val) => {
                  setFilters((prev) => ({
                    ...prev,
                    selectedOptions: {
                      ...prev.selectedOptions,
                      collarType: val as CollarTypes,
                    },
                  }));
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant={"secondary"}
                            size={"icon"}
                            className="absolute -top-2 -right-2 size-5 rounded-full p-3"
                          >
                            <Info />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{formatCollarType(col)}</DialogTitle>
                            <DialogDescription>
                              {col === "MINIMALISTIC" ? (
                                <p className="text-justify text-xs">
                                  Le col minimaliste, également connu sous le
                                  nom de col officier, se distingue par son
                                  style épuré et moderne. Il s'adapte aussi bien
                                  à une chemise formelle pour un look
                                  sophistiqué qu'à une chemise d'été en lin pour
                                  un style décontracté. La rigidité du col varie
                                  en fonction du tissu : souple pour les
                                  matières casual et plus rigide pour les tissus
                                  formels.
                                </p>
                              ) : (
                                <p className="text-justify text-xs">
                                  Le col standard, aussi appelé col italien, est
                                  un choix business polyvalent. Adaptable, il
                                  peut se porter avec ou sans cravate. De taille
                                  moyenne, avec des pointes plutôt évasées, il
                                  offre une tenue parfaite et est équipé de
                                  baleines amovibles.
                                </p>
                              )}
                            </DialogDescription>
                          </DialogHeader>
                          <img
                            src={
                              col === "STANDARD"
                                ? "/shop/Col-standard.png"
                                : "/shop/Col-minimaliste.png"
                            }
                            alt="collar"
                            className="aspect-square h-auto w-full rounded-lg border"
                          />
                        </DialogContent>
                      </Dialog>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div> */}

            {/* Wrists options */}
            {/* <div className="space-y-3">
              <h3 className="font-medium">Type de poignets</h3>
              <RadioGroup
                defaultValue={selectedOptions.wristsType}
                className="flex flex-wrap gap-2"
                onValueChange={(val) => {
                  setFilters((prev) => ({
                    ...prev,
                    selectedOptions: {
                      ...prev.selectedOptions,
                      wristsType: val as WristsTypes,
                    },
                  }));
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

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant={"secondary"}
                            size={"icon"}
                            className="absolute -top-2 -right-2 size-5 rounded-full p-3"
                          >
                            <Info />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{formatWristsType(wrist)}</DialogTitle>
                            <DialogDescription>
                              {wrist === "SIMPLE" ? (
                                <p className="text-justify text-xs">
                                  Les poignets simples sont adaptés à tous les
                                  styles quotidiens, qu'ils soient casual ou
                                  business. Leurs angles biseautés leur
                                  confèrent une allure contemporaine et ils se
                                  ferment par un bouton. leur rigidité et leur
                                  hauteur sont adjustés en fonction du type de
                                  tissu choisi : des poignets plus souples pour
                                  les tissus casual et plus rigides pour les
                                  tissus formels.
                                </p>
                              ) : (
                                <p className="text-justify text-xs">
                                  Les poignets mousquetaires sont parfaits pour
                                  des chemises cérémonie ou pour créer un look
                                  business sophistiqué. Ces poignets sont
                                  doublés, ils se replient et se ferment à
                                  l'aide de boutons de manchettes (non
                                  fournies).
                                </p>
                              )}
                            </DialogDescription>
                          </DialogHeader>
                          <img
                            src={
                              wrist === "SIMPLE"
                                ? "/shop/Poignet-Simple.png"
                                : "/shop/Poignet-Mousquetaire.png"
                            }
                            alt="collar"
                            className="aspect-square h-auto w-full rounded-lg border"
                          />
                        </DialogContent>
                      </Dialog>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div> */}

            {/* Pant fit options */}
            <div className="space-y-3">
              <h3 className="font-medium">Coupe de pantalon</h3>
              <RadioGroup
                defaultValue={selectedOptions.pantFit}
                className="flex flex-wrap gap-4"
                onValueChange={(val) => {
                  setFilters((prev) => ({
                    ...prev,
                    selectedOptions: {
                      ...prev.selectedOptions,
                      pantFit: val as PantFits,
                    },
                  }));
                }}
              >
                {pantFits.map((fit, index) => (
                  <div key={index}>
                    <RadioGroupItem
                      id={fit}
                      value={fit}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={fit}
                      className="border-border bg-background peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 relative flex h-10 cursor-pointer items-center justify-center rounded-md border px-4"
                    >
                      {formatPantFit(fit)}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant={"secondary"}
                            size={"icon"}
                            className="absolute -top-2 -right-2 size-5 rounded-full p-3"
                          >
                            <Info />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{formatPantFit(fit)}</DialogTitle>
                            <DialogDescription>
                              {fit === "REGULAR" ? (
                                <p className="text-justify text-xs">
                                  La coupe regular offre comme son nom l’indique
                                  une forme droite de la taille jusqu’aux
                                  chevilles. C’est la coupe la plus classique et
                                  la plus indémodable. La coupe droite s’adapte
                                  à toutes les morphologies, petites ou grandes.
                                  C’est aussi la forme à privilégier si vous
                                  êtes un peu fort. Classique et décontractée,
                                  la coupe regular s'adapte à toutes les
                                  occasions et à tous les styles vestimentaires
                                  : tee-shirt, pull, veste, chemise...
                                </p>
                              ) : (
                                <p className="text-justify text-xs">
                                  De forme droite mais resserrée au niveau des
                                  cuisses et des chevilles, la coupe slim est la
                                  coupe du moment. Cette coupe est
                                  principalement recommandée pour les
                                  silhouettes minces et longilignes. Comme elle
                                  laisse bien apparaitre vos chaussures vous
                                  pouvez donc porter le jean slom avec des
                                  Derbies ou des baskets du type Converse. Vous
                                  pourrez également marier votre jean avec une
                                  chemise pour un look mode et tendance. Pour un
                                  style plus classique, optez pour des
                                  mocassins.
                                </p>
                              )}
                            </DialogDescription>
                          </DialogHeader>
                          {/* <img
                            src={
                              fit === "REGULAR"
                                ? "/shop/Bas-ourlet.png"
                                : "/shop/Bas-releve.png"
                            }
                            alt="collar"
                            className="aspect-square h-auto w-full rounded-lg border"
                          /> */}
                        </DialogContent>
                      </Dialog>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Pant Leg options*/}
            <div className="space-y-3">
              <h3 className="font-medium">Bas de pantalon</h3>
              <RadioGroup
                defaultValue={selectedOptions.pantLeg}
                className="flex flex-wrap gap-4"
                onValueChange={(val) => {
                  setFilters((prev) => ({
                    ...prev,
                    selectedOptions: {
                      ...prev.selectedOptions,
                      pantLeg: val as PantLegs,
                    },
                  }));
                }}
              >
                {pantLegs.map((leg, index) => (
                  <div key={index}>
                    <RadioGroupItem
                      id={leg}
                      value={leg}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={leg}
                      className="border-border bg-background peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 relative flex h-10 cursor-pointer items-center justify-center rounded-md border px-4"
                    >
                      {formatPantLeg(leg)}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant={"secondary"}
                            size={"icon"}
                            className="absolute -top-2 -right-2 size-5 rounded-full p-3"
                          >
                            <Info />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{formatPantLeg(leg)}</DialogTitle>
                            <DialogDescription>
                              {leg === "OUTLET" ? (
                                <p className="text-justify text-xs">
                                  Le pantalon à ourlets est un type de pantalon
                                  dont les bords inférieurs des jambes sont
                                  ourlés. Cela peut ajouter une touche de style
                                  et de sophistication à la tenue, et il est
                                  souvent utilisé pour donner un aspect plus
                                  soigné et structuré au vêtement. Les pantalons
                                  à ourlets peuvent être ajustés pour
                                  différentes longueurs, ce qui permet de
                                  personnaliser l'apparence en fonction des
                                  préférences de l'individu.
                                </p>
                              ) : (
                                <p className="text-justify text-xs">
                                  Le revers est une technique de finition du bas
                                  d'un pantalon qui consiste à retourner le
                                  tissu vers l'extérieur, créant ainsi un pli
                                  apparent qui ajoute une touche stylistique
                                  unique au vêtement.
                                </p>
                              )}
                            </DialogDescription>
                          </DialogHeader>
                          <img
                            src={
                              leg === "OUTLET"
                                ? "/shop/Bas-ourlet.png"
                                : "/shop/Bas-releve.png"
                            }
                            alt="collar"
                            className="aspect-square h-auto w-full rounded-lg border"
                          />
                        </DialogContent>
                      </Dialog>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
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
          {/* Main image: aspect-ratio 3:4 to match your vertical shots */}
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-100 md:aspect-[4/5]">
            <Image
              src={product?.gallery[currentImage] ?? "/placeholder.svg"}
              fill
              alt={product?.name}
              className="object-contain object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
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

          {/* Thumbnails: keep square thumbnails but center & contain */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {product?.gallery.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={cn(
                  "relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border-2 bg-gray-50",
                  currentImage === index ? "border-primary" : "border-border",
                )}
              >
                <Image
                  src={image ?? "/placeholder.svg"}
                  fill
                  alt={`Product thumbnail ${index + 1}`}
                  className="object-contain object-center"
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

            {product.discountedPrice && Number(product.discountedPrice) > 0 ? (
              <div className="flex items-center gap-6">
                <p className="mb-4 text-2xl font-semibold line-through">
                  {formatPrice(
                    Number(product.price),
                    currency.code,
                    currency.rate,
                  )}
                </p>

                <p className="text-primary mb-4 text-2xl font-semibold">
                  {formatPrice(
                    Number(product.discountedPrice),
                    currency.code,
                    currency.rate,
                  )}
                </p>
              </div>
            ) : (
              <p className="mb-4 text-2xl font-semibold">
                {formatPrice(
                  Number(product.price),
                  currency.code,
                  currency.rate,
                )}
              </p>
            )}
            <ProductDetailActions id={product.id} title={product.name} />
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
                    setFilters((prev) => ({
                      ...prev,
                      selectedOptions: { ...prev.selectedOptions, size: val },
                    }));
                  } else {
                    setFilters((prev) => ({
                      ...prev,
                      selectedOptions: {
                        ...prev.selectedOptions,
                        size: val as Sizes,
                      },
                    }));
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {product.type !== "PANTS" && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant={"outline"}>
                      Guide des tailles (chemises)
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Le guide des tailles pour les chemises
                      </DialogTitle>
                    </DialogHeader>
                    <img
                      src="/shop/guide-chemises.png"
                      alt="guide taille chemises"
                    />
                  </DialogContent>
                </Dialog>
              )}

              {product.type !== "AFRICAN_SHIRTS" &&
                product.type !== "CLASSIC_SHIRTS" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant={"outline"}>
                        Guide des tailles (pantalons)
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Le guide des tailles pour les pantalons
                        </DialogTitle>
                      </DialogHeader>
                      <img
                        src="/shop/guide-pantalons.png"
                        alt="guide taille pantalons"
                      />
                    </DialogContent>
                  </Dialog>
                )}
            </div>

            {/* Dynamic Product Options */}
            {renderProductOptions()}

            {product.tissues.length > 1 && (
              <div className="space-y-3">
                <h3 className="font-medium">Changer de tissu</h3>
                <RadioGroup
                  defaultValue={selectedOptions.tissu}
                  className="flex flex-wrap gap-4"
                  onValueChange={(val) => {
                    setFilters((prev) => ({
                      ...prev,
                      selectedOptions: {
                        ...prev.selectedOptions,
                        tissu: val,
                      },
                    }));
                  }}
                >
                  {product.tissues.map((tissu, index) => (
                    <div key={index}>
                      <RadioGroupItem
                        id={tissu.name}
                        value={tissu.name}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={tissu.name}
                        className="border-border bg-background peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 relative flex h-10 cursor-pointer items-center justify-center rounded-md border px-4"
                      >
                        {tissu.name}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant={"secondary"}
                              size={"icon"}
                              className="absolute -top-2 -right-2 size-5 rounded-full p-3"
                            >
                              <Info />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{tissu.name}</DialogTitle>
                            </DialogHeader>
                            <img
                              src={tissu.url}
                              alt={`tissu ${tissu.name}`}
                              className="aspect-square h-auto w-full rounded-lg border"
                            />
                          </DialogContent>
                        </Dialog>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Initials Section */}
            {selectedOptions.sleevesLength === "LONG" && (
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">
                    +{" "}
                    {formatPrice(INITIALS_PRICE, currency.code, currency.rate)}
                  </span>
                  <Button
                    variant="outline"
                    onClick={toggleInitials}
                    className={
                      showInitials
                        ? "border-primary text-primary w-fit"
                        : "w-fit"
                    }
                  >
                    {showInitials ? "Annuler" : "Ajouter vos initiales"}
                  </Button>
                </div>

                {showInitials && (
                  <div className="space-y-2">
                    <Label htmlFor="initials">
                      Vos initiales (max 3 caractères)
                    </Label>
                    <Input
                      id="initials"
                      value={selectedOptions.initials}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          selectedOptions: {
                            ...prev.selectedOptions,
                            initials: e.target.value.slice(0, 3).toUpperCase(),
                          },
                        }))
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
            )}

            <div>
              <h3 className="mb-3 font-medium">Quantité</h3>
              <div className="border-border flex w-fit items-center rounded-md border">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 cursor-pointer rounded-none"
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
                  className="h-10 w-10 cursor-pointer rounded-none"
                  onClick={incrementQuantity}
                  disabled={!quantity || quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Increase quantity</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              size="lg"
              disabled={addingProduct}
              className="w-full md:w-auto"
              onClick={() => {
                // console.log("Add product to cart quantity is: ", quantity);

                if (
                  product.type === "MEN_SUITS" ||
                  product.type === "WOMEN_SUITS"
                ) {
                  if (!selectedOptions.pantFit || !selectedOptions.pantLeg) {
                    return toast.warning(
                      "Vous devez sélectionner toutes les options avant de pouvoir ajouter le produit au panier",
                    );
                  }
                }

                if (product.type === "PANTS") {
                  if (!selectedOptions.pantFit || !selectedOptions.pantLeg) {
                    return toast.warning(
                      "Vous devez sélectionner les options avant de pouvoir ajouter le produit au panier",
                    );
                  }
                }

                if (
                  product.type === "CLASSIC_SHIRTS" ||
                  product.type === "AFRICAN_SHIRTS"
                ) {
                  if (!selectedOptions.sleevesLength) {
                    return toast.warning(
                      "Vous devez sélectionner les options avant de pouvoir ajouter le produit au panier",
                    );
                  }

                  if (
                    selectedOptions.sleevesLength === "LONG" &&
                    (!selectedOptions.collarType || !selectedOptions.wristsType)
                  ) {
                    return toast.warning(
                      "Vous devez sélectionner les options avant de pouvoir ajouter le produit au panier",
                    );
                  }

                  if (
                    product.type === "CLASSIC_SHIRTS" &&
                    !selectedOptions.collarType
                  ) {
                    return toast.warning(
                      "Vous devez sélectionner les options avant de pouvoir ajouter le produit au panier",
                    );
                  }
                }

                // console.log("selectedOptions", selectedOptions);

                // return;

                const productPrice =
                  product.discountedPrice && Number(product.discountedPrice) > 0
                    ? Number(product.discountedPrice)
                    : Number(product.price);

                addProductToCart(
                  {
                    image: product.gallery[0],
                    name: product.name,
                    productId: product.id,
                    productType: product.type,
                    price: productPrice,
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

            <Button
              variant={"outline"}
              onClick={() => {
                setFilters(null);
                setTimeout(() => {
                  window.location.reload();
                }, 100);
              }}
            >
              Réinitialiser
            </Button>
          </div>

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
      {otherProducts && otherProducts.length > 0 && (
        <div>
          <h2 className="mb-6 text-2xl font-bold">Complètez votre look</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {otherLoading && (
              <div className="h-72 w-full animate-pulse rounded-lg bg-zinc-100"></div>
            )}

            {!otherLoading &&
              otherProducts &&
              otherProducts.length > 0 &&
              otherProducts.map((product) => (
                <Link
                  href={`/shop/${product.id}`}
                  key={product.id}
                  className="group"
                >
                  <div className="space-y-3">
                    <div className="bg-muted relative aspect-[4/5] overflow-hidden rounded-lg">
                      <img
                        src={product.gallery[0] || "/placeholder.svg"}
                        alt={product.name}
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
      )}
    </div>
  );
}
