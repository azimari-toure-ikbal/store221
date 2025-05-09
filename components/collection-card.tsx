import React from "react";
import { Button } from "./ui/button";

type CollectionCardProps = {
  title: string;
  image: string;
};

const CollectionCard: React.FC<CollectionCardProps> = ({ image, title }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg">
      {/* <div className="absolute inset-0 z-10 bg-black/30 transition-colors group-hover:bg-black/40" /> */}
      <img
        src={image}
        alt={title}
        className="w-full object-fill transition-transform group-hover:scale-105"
      />
      <div className="absolute inset-0 z-20 flex items-end p-6">
        <div className="space-y-2 text-white">
          <h3 className="text-xl font-bold">{title}</h3>
          <Button variant="secondary">Voir plus</Button>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
