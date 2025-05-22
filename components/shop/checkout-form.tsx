"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries, countriesName } from "@/config";
import { useCart } from "@/hooks/use-cart";
import { deliveryAreaAtom, deliveryZoneAtom } from "@/lib/atoms";
import { DBUserAddress } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { checkoutFormSchema } from "@/lib/validators";
import { trpc } from "@/server/trpc/client";
import { CurrentUserResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import IsLoading from "../is-loading";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";

type CheckoutFormProps = {
  user: CurrentUserResponse;
};

const CheckoutForm: React.FC<CheckoutFormProps> = ({ user }) => {
  const router = useRouter();

  const [selectedAddress, setSelectedAddress] = React.useState<
    DBUserAddress | undefined
  >(undefined);

  // const currency = useAtomValue(currencyAtom);
  const { cart, total, surMesureTotal, deliveryPrice } = useCart();
  const setDeliveryArea = useSetAtom(deliveryAreaAtom);
  const setDeliveryZone = useSetAtom(deliveryZoneAtom);

  const { mutate: checkout, isPending } = trpc.carts.checkout.useMutation({
    onSuccess: (data) => {
      toast.info("Vous allez être redirigé vers le site de paiement");
      router.push(data.redirectUrl);
    },
  });

  const form = useForm<z.infer<typeof checkoutFormSchema>>({
    resolver: zodResolver(checkoutFormSchema),
    mode: "onChange",
  });

  function onSubmit(values: z.infer<typeof checkoutFormSchema>) {
    try {
      if (!cart) return;

      checkout({
        cartId: cart.id,
        cartPrice: total,
        productName: "Commande produits Store221",
        // rate: 0.12,
        // currency: "XOF",
        delivery: values,
        deliveryPrice: deliveryPrice,
        promoCode: undefined,
      });
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  const handleSelectAddress = (address: DBUserAddress) => {
    if (address.id === selectedAddress?.id) {
      setSelectedAddress(undefined);
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        country: "",
        city: "",
        state: "",
        zip: "",
        address: "",
        note: undefined,
      });
      return;
    }

    setSelectedAddress(address);

    form.reset({
      firstName: address.firstName,
      lastName: address.lastName,
      email: address.email,
      phone: address.phone,
      country: address.country,
      city: address.city,
      state: address.state,
      zip: address.zip,
      address: address.address,
      note: address.note ?? undefined,
    });
  };

  React.useEffect(() => {
    if (form.formState.isValid) {
      setDeliveryZone(form.getValues());
    } else {
      setDeliveryZone(undefined);
    }
  }, [form.formState, form, setDeliveryZone]);

  // React.useEffect(() => {
  //   if (form.watch("country")) {
  //     const found = countries.find(
  //       (c) => c.name === form.watch("country"),
  //     )?.continent;

  //     // console.log("Found continent", found);

  //     if (found) setDeliveryArea(found);
  //   }
  // }, [form, setDeliveryArea]);

  return (
    <div className="space-y-4 rounded-lg bg-white p-4">
      {user && user.addresses.length > 0 && (
        <div className="flex w-full flex-col gap-4">
          <h2 className="text-lg font-medium">
            Liste de vos adresses ({user.addresses.length})
          </h2>
          <ScrollArea className="h-20 w-full">
            {user.addresses.map((address, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-4 rounded-md bg-zinc-100 p-2",
                  {
                    "bg-primary/20 border-primary border":
                      selectedAddress?.id === address.id,
                  },
                )}
                onClick={() => {
                  handleSelectAddress(address);
                }}
              >
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-medium">
                    {address.firstName} {address.lastName}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {address.address}
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto max-w-3xl space-y-4 py-10"
        >
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!!selectedAddress} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!!selectedAddress} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!!selectedAddress} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel>Téléphone</FormLabel>
                <FormControl className="w-full">
                  <PhoneInput
                    disabled={!!selectedAddress}
                    placeholder=""
                    {...field}
                    defaultCountry="SN"
                    international
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pays</FormLabel>
                  <Select
                    disabled={!!selectedAddress}
                    onValueChange={(val) => {
                      setDeliveryArea(
                        countries.find((c) => c.name === val)?.continent ||
                          "Afrique",
                      );
                      field.onChange(val);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner un pays" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countriesName.map((country, index) => (
                        <SelectItem
                          key={index}
                          value={country}
                          disabled={!!selectedAddress}
                        >
                          {country}
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
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ville</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!!selectedAddress} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Région / Etat</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!!selectedAddress} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code postal / ZIP</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!!selectedAddress} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Input {...field} disabled={!!selectedAddress} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructions (optionnel)</FormLabel>
                <FormControl>
                  <Textarea {...field} disabled={!!selectedAddress} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? <IsLoading /> : "Procéder au paiement"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CheckoutForm;
