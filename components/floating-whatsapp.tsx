import Link from "next/link";
import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import ActionTooltip from "./action-tooltip";
import { Button } from "./ui/button";

type FloatingWhatsappProps = {};

const FloatingWhatsapp: React.FC<FloatingWhatsappProps> = ({}) => {
  return (
    <div className="fixed right-2 bottom-16 z-50">
      <ActionTooltip label="Contactez-nous sur WhatsApp">
        <Button
          asChild
          size={"icon"}
          className="rounded-full bg-emerald-600 hover:bg-emerald-500"
        >
          <Link
            href={`whatsapp://send?phone=221769019494`}
            data-action="share/whatsapp/share"
            target="_blank"
          >
            <FaWhatsapp className="size-6 fill-white" color="#fff" />
          </Link>
        </Button>
      </ActionTooltip>
    </div>
  );
};

export default FloatingWhatsapp;
