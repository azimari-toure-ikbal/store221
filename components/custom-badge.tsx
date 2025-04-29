import { Badge } from "@/components/ui/badge";

const statusVariants = {
  success: [
    "payed",
    "succeeded",
    "completed",
    "published",
    "approved",
    "paid",
    "delivered",
  ],
  warning: [
    "waiting_payment",
    "pending_payment",
    "forgotten",
    "pending",
    "shipping",
  ],
  error: [
    "dropped",
    "abandonned",
    "trashed",
    "cancelled",
    "rejected",
    "deleted",
    "canceled",
    "refunded",
  ],
  neutral: ["draft", "default", "preparation"],
};

export const statusLabels = {
  preparation: "Préparation",
  shipping: "En livraison",
  delivered: "Livré",
  refunded: "Remboursé",
  canceled: "Annulé",
  published: "Publié",
  waiting_payment: "En attente",
  pending_payment: "En attente",
  forgotten: "Oublié",
  payed: "Payé",
  paid: "Payé",
  approved: "Approuvé",
  succeeded: "Réussi",
  completed: "Terminé",
  dropped: "Abandon client",
  abandonned: "Abandonné",
  draft: "Brouillon",
  deleted: "Supprimé",
  pending: "Confirmation",
  trashed: "Supprimé",
  cancelled: "Annulé",
  rejected: "Rejeté",
  default: "Inconnu",
} as const;

const getBadgeVariant = (status: string) => {
  const lowerStatus = status.toLowerCase();
  if (statusVariants.success.includes(lowerStatus)) return "success";
  if (statusVariants.warning.includes(lowerStatus)) return "warning";
  if (statusVariants.error.includes(lowerStatus)) return "destructive";
  if (statusVariants.neutral.includes(lowerStatus)) return "secondary";
  return "default";
};

const CustomBadge = ({ status }: { status: keyof typeof statusLabels }) => {
  const variant = getBadgeVariant(status);
  return (
    <Badge variant={variant} className="w-full">
      {statusLabels[status.toLowerCase() as keyof typeof statusLabels] ||
        "Unknown"}
    </Badge>
  );
};

export default CustomBadge;
