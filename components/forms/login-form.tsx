"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { loginFormSchema } from "@/lib/validators";
import { trpc } from "@/server/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import IsLoading from "../is-loading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

type LoginFormProps = React.ComponentPropsWithoutRef<"div"> & {
  className?: string;
  setAuthType: React.Dispatch<React.SetStateAction<"login" | "signup">>;
};

let toastId: string | number;

export function LoginForm({
  className,
  setAuthType,
  ...props
}: LoginFormProps) {
  const router = useRouter();
  const pathname = usePathname();

  const url = `${process.env.NEXT_PUBLIC_TRPC_URL}${pathname}`;

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  });

  const { mutate: login, isPending } = trpc.auth.login.useMutation({
    onSuccess: (_, input) => {
      toast.success("Connexion réussie", {
        description: "Vous allez être redirigé dans quelques secondes.",
      });
      router.push(
        `/api/auth/login?connection_id=${process.env.NEXT_PUBLIC_PASSWORDLESS_ID}&login_hint=${input.email}&post_login_redirect_url=${url}`,
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      toast.dismiss(toastId);
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    try {
      toastId = toast.loading("Connexion en cours");

      login(values);
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Ooops...", {
        description:
          "Une erreur est survenue lors de la soumission du formulaire. Veuillez réessayer.",
      });
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Connectez vous</h1>
      </div>
      <div className="grid gap-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-auto w-full max-w-3xl space-y-4"
          >
            <FormField
              disabled={isPending}
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="exemple@email.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isPending} className="w-full">
              {isPending ? <IsLoading /> : "Connexion"}
            </Button>
          </form>
        </Form>
      </div>
      <div className="text-center text-sm">
        Vous n&apos;avez pas de compte ?{" "}
        <span
          className="cursor-pointer underline underline-offset-4"
          onClick={() => {
            setAuthType("signup");
          }}
        >
          Inscrivez vous
        </span>
      </div>
    </div>
  );
}
