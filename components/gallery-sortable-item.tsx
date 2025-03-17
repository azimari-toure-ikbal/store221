import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

interface SortableItemProps {
  id: string;
  src: string;
  onDelete: (id: string) => void;
}

export function SortableItem({ id, src, onDelete }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative aspect-square cursor-pointer"
    >
      <Image
        alt="Uploaded image"
        src={src}
        fill
        className="rounded-md object-cover"
      />
      <Button
        size="icon"
        variant="destructive"
        className="absolute top-0 right-0 size-5 rounded-full"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(id);
        }}
      >
        <XIcon className="size-2 text-white" />
      </Button>
    </div>
  );
}
