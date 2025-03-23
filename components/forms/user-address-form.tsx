"use client";

import { PhoneInput } from "@/components/ui/phone-input";
import { countriesName } from "@/config";
import { checkoutFormSchema } from "@/lib/validators";
import { trpc } from "@/server/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import IsLoading from "../is-loading";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

type UserAddressFormProps = {
  id?: string;
  initialValues?: z.infer<typeof checkoutFormSchema>;
};

let toastId: string | number;

const UserAddressForm: React.FC<UserAddressFormProps> = ({
  id,
  initialValues,
}) => {
  const utils = trpc.useUtils();

  const { mutate: createAddress, isPending: creating } =
    trpc.userAddresses.createUserAddress.useMutation({
      onSuccess: () => {
        toast.success("Votre adresse a été créée avec succès.");
        form.reset();
        utils.userAddresses.getUserAddresses.invalidate();
      },
      onError: (error) => {
        toast.error(error.message);
      },
      onSettled: () => {
        toast.dismiss(toastId);
      },
    });

  const { mutate: updateAddress, isPending: updating } =
    trpc.userAddresses.updateUserAddress.useMutation({
      onSuccess: () => {
        toast.success("Votre adresse a été mise à jour avec succès.");
        form.reset();
        utils.userAddresses.getUserAddresses.invalidate();
      },
      onError: (error) => {
        toast.error(error.message);
      },
      onSettled: () => {
        toast.dismiss(toastId);
      },
    });

  const form = useForm<z.infer<typeof checkoutFormSchema>>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      address: initialValues?.address || "",
      city: initialValues?.city || "",
      country: initialValues?.country || "",
      email: initialValues?.email || "",
      firstName: initialValues?.firstName || "",
      lastName: initialValues?.lastName || "",
      note: initialValues?.note || "",
      phone: initialValues?.phone || "",
      state: initialValues?.state || "",
      zip: initialValues?.zip || "",
    },
  });

  function onSubmit(values: z.infer<typeof checkoutFormSchema>) {
    try {
      if (id) {
        toastId = toast.loading("Modification de l'adresse en cours...");
        updateAddress({
          id,
          values,
        });
      } else {
        toastId = toast.loading("Création de l'adresse en cours...");
        createAddress(values);
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <div className="space-y-4">
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
                      <Input {...field} />
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
                      <Input {...field} />
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
                  <Input {...field} />
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
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner un pays" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countriesName.map((country, index) => (
                        <SelectItem key={index} value={country}>
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
                    <Input {...field} />
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
                    <Input {...field} />
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
                    <Input {...field} />
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
                  <Input {...field} />
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
                  <Textarea {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="w-full"
            type="submit"
            disabled={creating || updating}
          >
            {creating || updating ? (
              <IsLoading />
            ) : id ? (
              "Modifier l'adresse"
            ) : (
              "Ajouter une adresse"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UserAddressForm;
