import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="container mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-4 py-10 md:py-16">
      <Card className="w-full">
        <CardHeader className="pb-4 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-xl md:text-2xl">Paiement réussi</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Votre paiement a été traité avec succès. Nous vous remercions pour
            votre réservation.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <Link
            href={`whatsapp://send?phone=+221781039292`}
            data-action="share/whatsapp/share"
            target="_blank"
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            Contacter le Support
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
