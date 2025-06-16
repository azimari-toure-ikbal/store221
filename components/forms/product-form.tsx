"use client";

import { productFormAtom } from "@/lib/atoms";
import {
  collarTypes,
  pantFits,
  pantLegs,
  productTypes,
  sellers,
  sizes,
  sleevesLengths,
  wristsTypes,
} from "@/lib/db/schema/products";
import {
  cn,
  formatCollarType,
  formatPantFit,
  formatPantLeg,
  formatSleevesLength,
  formatType,
  formatWristsType,
} from "@/lib/utils";
import { productFormSchema } from "@/lib/validators";
import { trpc } from "@/server/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { PencilIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Tiptap from "../editor/tiptap";
import FileUpload from "../file-upload";
import { GallerySortable } from "../gallery-sortable";
import IsLoading from "../is-loading";
import { Button } from "../ui/button";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "../ui/extension/multi-select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type ProductFormProps = {
  id?: string;
};

let toastId: string | number;

const ProductForm: React.FC<ProductFormProps> = ({ id }) => {
  const router = useRouter();

  const [productFormBackup, setProductFormBackup] = useAtom(productFormAtom);

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      sizes: ["S", "XS", "M", "L", "XL", "XXL"],
      options: {
        collarType: ["MINIMALISTIC", "STANDARD"],
        sleevesLength: ["LONG", "SHORT"],
        wristsType: ["SIMPLE", "MUSKETEER"],
        pantFit: ["REGULAR", "SLIM_FIT"],
        pantLeg: ["OUTLET", "REVERS"],
      },
    },
  });

  const { data: product, isLoading: loadingDetails } =
    trpc.products.getProductDetails.useQuery(
      {
        id: id ?? "",
      },
      {
        enabled: !!id,
      },
    );

  const { mutate: updateProduct, isPending: updating } =
    trpc.products.updateProduct.useMutation({
      onSuccess: (_, input) => {
        toast.success("Mise à jour du produit effectuée");
      },
      onError: (error) => {
        toast.error(error.message);
      },
      onSettled: () => {
        toast.dismiss(toastId);
      },
    });

  const { mutate: createProduct, isPending } =
    trpc.products.createProduct.useMutation({
      onSuccess: (_, input) => {
        toast.success("Produit créé avec succès");
        router.push("/dashboard/products");
      },
      onError: (error) => {
        toast.error(error.message);
      },
      onSettled: () => {
        toast.dismiss(toastId);
      },
    });

  React.useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        type: product.type,
        seller: product.seller,
        description: product.description,
        price: product.price,
        discountedPrice: product.discountedPrice || undefined,
        stock: String(product.stock),
        gallery: product.gallery,
        tissues: product.tissues,
        sizes: product.sizes,
        options: {
          sleevesLength: product.options.sleevesLength ?? [],
          collarType: product.options.collarType ?? [],
          wristsType: product.options.wristsType ?? [],
          pantFit: product.options.pantFit ?? [],
          pantLeg: product.options.pantLeg ?? [],
        },
      });
    }
  }, [form, product]);

  // React.useEffect(() => {
  //   console.log("we are here");
  //   // Each 60 seconds, update setProductFormBackup with the current form values
  //   const interval = setInterval(() => {
  //     console.log("test");
  //     setProductFormBackup(form.getValues());
  //   }, 5000);

  //   return () => {
  //     clearInterval(interval);
  //     setProductFormBackup(PRODUCT_FORM_DEFAULT_VALUES);

  //     if (true) {
  //       if (id) {
  //         updateProduct({
  //           id,
  //           values: productFormBackup,
  //           status: "DRAFT",
  //         });
  //       } else {
  //         createProduct({
  //           values: productFormBackup,
  //           status: "DRAFT",
  //         });
  //       }
  //     }
  //   };
  // }, [
  //   form,
  //   id,
  //   setProductFormBackup,
  //   productFormBackup,
  //   createProduct,
  //   updateProduct,
  // ]);

  const handleReorderGallery = (newOrder: string[]) => {
    form.setValue("gallery", newOrder);
  };

  const handleDeleteGallery = (id: string) => {
    const updatedGallery = form.watch("gallery").filter((pic) => pic !== id);
    form.setValue("gallery", updatedGallery);
  };

  const saveDraft = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (id) {
      updateProduct({
        id,
        values: form.getValues(),
        status: "DRAFT",
      });
    } else {
      createProduct({
        values: form.getValues(),
        status: "DRAFT",
      });
    }
  };

  async function onSubmit(values: z.infer<typeof productFormSchema>) {
    try {
      if (values.tissues && values.tissues.length > 0) {
        // If there is at least one tissue, check if all tissues have a name and a url
        const hasNameAndUrl = values.tissues.every(
          (tissue) => tissue.name && tissue.url,
        );

        if (!hasNameAndUrl) {
          return toast.error(
            "Vous devez ajouter un nom et une image pour chaque tissu",
          );
        }
      }

      if (values.type === "AFRICAN_SHIRTS") {
        values.options.collarType = [];
      }

      if (values.type === "PANTS") {
        values.options.collarType = [];
        values.options.sleevesLength = [];
        values.options.wristsType = [];
      }

      if (id) {
        toastId = toast.loading("Modification en cours");

        updateProduct({
          id,
          values,
          status: "PUBLISHED",
        });
      } else {
        toastId = toast.loading("Création en cours");

        createProduct({
          values: {
            ...values,
            options: values.options,
          },
          status: "PUBLISHED",
        });
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Ooops...", {
        description:
          "Une erreur est survenue lors de la soumission du formulaire. Veuillez réessayer.",
      });
    }
  }

  if (loadingDetails) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <IsLoading />
      </div>
    );
  }

  // console.log("tissues", form.watch("tissues"));

  return (
    <div className="mx-auto h-full max-w-4xl">
      <Form {...form}>
        <form
          className="h-full w-full space-y-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isPending || updating}>
              {isPending || updating ? (
                <IsLoading />
              ) : id ? (
                "Modifier"
              ) : (
                "Créer"
              )}
            </Button>
            <Button
              type="button"
              variant={"outline"}
              disabled={isPending || updating}
              onClick={saveDraft}
            >
              {isPending || updating ? <IsLoading /> : "Brouillon"}
            </Button>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Type de produit</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? product?.type}
                    className="flex gap-6"
                  >
                    {productTypes.map((t, index) => (
                      <FormItem
                        key={index}
                        className="flex items-center space-y-0 space-x-3"
                      >
                        <FormControl>
                          <RadioGroupItem value={t} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {formatType(t)}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="seller"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vendeur</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value ?? product?.seller}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choisissez un vendeur" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sellers.map((seller, index) => (
                      <SelectItem key={index} value={seller}>
                        {seller}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Tiptap description={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tarif</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discountedPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tarif en promotion</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="gallery"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Galerie de photos</FormLabel>
                <FormControl>
                  <FileUpload
                    endPoint="productImages"
                    onMultipleChange={(files) => {
                      if (files && files.length > 0) {
                        // Get the current pictures from the form
                        const currentPictures = form.getValues("gallery") || [];

                        // Create new picture objects for the selected color
                        const newPictures = files.map((file) => file.url);

                        // Merge the new pictures with the existing ones
                        const updatedPictures = [
                          ...currentPictures,
                          ...newPictures,
                        ];

                        // Update the form value
                        form.setValue("gallery", updatedPictures);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <GallerySortable
            items={form.watch("gallery") || []}
            onReorder={handleReorderGallery}
            onDelete={handleDeleteGallery}
          />

          <FormField
            control={form.control}
            name="tissues"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Galerie de tissus</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {field.value?.map((tissue, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <Input
                          placeholder="Nom du tissu"
                          value={tissue.name}
                          onChange={(e) => {
                            const newTissues = [...field.value];
                            newTissues[index].name = e.target.value;
                            field.onChange(newTissues);
                          }}
                        />

                        {tissue.url ? (
                          <div className="relative">
                            <img
                              src={tissue.url}
                              alt={tissue.name || "Tissu"}
                              className="h-24 w-40 rounded-md object-cover"
                            />
                            <Button
                              type="button"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-1"
                              onClick={() => {
                                const newTissues = [...field.value];
                                newTissues[index].url = "";
                                field.onChange(newTissues);
                              }}
                            >
                              <PencilIcon className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <FileUpload
                            endPoint="productTissues"
                            onChange={(url) => {
                              if (!url) {
                                return toast.error("Le fichier est invalide");
                              }

                              const newTissues = [...field.value];
                              newTissues[index].url = url;
                              field.onChange(newTissues);
                            }}
                          />
                        )}

                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => {
                            const newTissues = field.value.filter(
                              (_, i) => i !== index,
                            );
                            field.onChange(newTissues);
                          }}
                        >
                          Supprimer
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        field.onChange([
                          ...(field.value || []),
                          { name: "", url: "" },
                        ]);
                      }}
                    >
                      Ajouter un tissu
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {(form.watch("type") === "CLASSIC_SHIRTS" ||
            form.watch("type") === "AFRICAN_SHIRTS") && (
            <div
              className={cn("grid w-full grid-cols-1 gap-4 md:grid-cols-3", {
                "md:grid-cols-2": form.watch("type") === "AFRICAN_SHIRTS",
              })}
            >
              <FormField
                control={form.control}
                name="options.sleevesLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tailles des manches</FormLabel>
                    <FormControl>
                      <MultiSelector
                        values={field.value}
                        onValuesChange={field.onChange}
                        loop
                      >
                        <MultiSelectorTrigger>
                          <MultiSelectorInput placeholder="Ajouter une taille" />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent>
                          <MultiSelectorList>
                            {sleevesLengths.map((sleeve) => (
                              <MultiSelectorItem key={sleeve} value={sleeve}>
                                {formatSleevesLength(sleeve)}
                              </MultiSelectorItem>
                            ))}
                          </MultiSelectorList>
                        </MultiSelectorContent>
                      </MultiSelector>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("type") === "CLASSIC_SHIRTS" && (
                <FormField
                  control={form.control}
                  name="options.collarType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de col</FormLabel>
                      <FormControl>
                        <MultiSelector
                          values={field.value}
                          onValuesChange={field.onChange}
                          loop
                        >
                          <MultiSelectorTrigger>
                            <MultiSelectorInput placeholder="Ajouter une taille" />
                          </MultiSelectorTrigger>
                          <MultiSelectorContent>
                            <MultiSelectorList>
                              {collarTypes.map((col) => (
                                <MultiSelectorItem key={col} value={col}>
                                  {formatCollarType(col)}
                                </MultiSelectorItem>
                              ))}
                            </MultiSelectorList>
                          </MultiSelectorContent>
                        </MultiSelector>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="options.wristsType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de poignets</FormLabel>
                    <FormControl>
                      <MultiSelector
                        values={field.value}
                        onValuesChange={field.onChange}
                        loop
                      >
                        <MultiSelectorTrigger>
                          <MultiSelectorInput placeholder="Ajouter une taille" />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent>
                          <MultiSelectorList>
                            {wristsTypes.map((wrist) => (
                              <MultiSelectorItem key={wrist} value={wrist}>
                                {formatWristsType(wrist)}
                              </MultiSelectorItem>
                            ))}
                          </MultiSelectorList>
                        </MultiSelectorContent>
                      </MultiSelector>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {form.watch("type") === "PANTS" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="options.pantFit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coupe de pantalon</FormLabel>
                    <FormControl>
                      <MultiSelector
                        values={field.value}
                        onValuesChange={field.onChange}
                        loop
                      >
                        <MultiSelectorTrigger>
                          <MultiSelectorInput placeholder="Ajouter une taille" />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent>
                          <MultiSelectorList>
                            {pantFits.map((pant) => (
                              <MultiSelectorItem key={pant} value={pant}>
                                {formatPantFit(pant)}
                              </MultiSelectorItem>
                            ))}
                          </MultiSelectorList>
                        </MultiSelectorContent>
                      </MultiSelector>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="options.pantLeg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bas de pantalon</FormLabel>
                    <FormControl>
                      <MultiSelector
                        values={field.value}
                        onValuesChange={field.onChange}
                        loop
                      >
                        <MultiSelectorTrigger>
                          <MultiSelectorInput placeholder="Ajouter une taille" />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent>
                          <MultiSelectorList>
                            {pantLegs.map((leg) => (
                              <MultiSelectorItem key={leg} value={leg}>
                                {formatPantLeg(leg)}
                              </MultiSelectorItem>
                            ))}
                          </MultiSelectorList>
                        </MultiSelectorContent>
                      </MultiSelector>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {(form.watch("type") === "MEN_SUITS" ||
            form.watch("type") === "WOMEN_SUITS") && (
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="options.pantFit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coupe de pantalon</FormLabel>
                    <FormControl>
                      <MultiSelector
                        values={field.value}
                        onValuesChange={field.onChange}
                        loop
                      >
                        <MultiSelectorTrigger>
                          <MultiSelectorInput placeholder="Ajouter une taille" />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent>
                          <MultiSelectorList>
                            {pantFits.map((pant) => (
                              <MultiSelectorItem key={pant} value={pant}>
                                {formatPantFit(pant)}
                              </MultiSelectorItem>
                            ))}
                          </MultiSelectorList>
                        </MultiSelectorContent>
                      </MultiSelector>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="options.pantLeg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bas de pantalon</FormLabel>
                    <FormControl>
                      <MultiSelector
                        values={field.value}
                        onValuesChange={field.onChange}
                        loop
                      >
                        <MultiSelectorTrigger>
                          <MultiSelectorInput placeholder="Ajouter une taille" />
                        </MultiSelectorTrigger>
                        <MultiSelectorContent>
                          <MultiSelectorList>
                            {pantLegs.map((leg) => (
                              <MultiSelectorItem key={leg} value={leg}>
                                {formatPantLeg(leg)}
                              </MultiSelectorItem>
                            ))}
                          </MultiSelectorList>
                        </MultiSelectorContent>
                      </MultiSelector>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <FormField
            control={form.control}
            name="sizes"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Tailles</FormLabel>
                <FormControl>
                  <MultiSelector
                    values={field.value}
                    onValuesChange={field.onChange}
                    loop
                  >
                    <MultiSelectorTrigger>
                      <MultiSelectorInput placeholder="Ajouter une taille" />
                    </MultiSelectorTrigger>
                    <MultiSelectorContent>
                      <MultiSelectorList>
                        {sizes.map((size) => (
                          <MultiSelectorItem key={size} value={size}>
                            {size}
                          </MultiSelectorItem>
                        ))}
                      </MultiSelectorList>
                    </MultiSelectorContent>
                  </MultiSelector>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default ProductForm;
