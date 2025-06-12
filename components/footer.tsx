"use client";

import { usePathname } from "next/navigation";
import React from "react";

type FooterProps = {};

const Footer: React.FC<FooterProps> = ({}) => {
  const pathname = usePathname();

  if (pathname.includes("/dashboard")) return null;

  return (
    <div className="bg-muted flex flex-col items-center justify-between border-t p-4 md:flex-row">
      <p className="text-muted-foreground text-xs">
        &copy; {new Date().getFullYear()} Store 221. All rights reserved.
      </p>
      {/* <div className="mt-4 flex space-x-4 md:mt-0">
        <Link
          href="#"
          className="text-muted-foreground hover:text-foreground text-xs"
        >
          Privacy Policy
        </Link>
        <Link
          href="#"
          className="text-muted-foreground hover:text-foreground text-xs"
        >
          Terms of Service
        </Link>
        <Link
          href="#"
          className="text-muted-foreground hover:text-foreground text-xs"
        >
          Shipping & Returns
        </Link>
      </div> */}
    </div>
  );
};

export default Footer;
