import Link from "next/link";
import React from "react";

type LinkCardProps = {
  href: string;
  title: string;
  value: string;
};

const LinkCard: React.FC<LinkCardProps> = ({ href, title, value }) => {
  return (
    <Link
      href={href}
      className="group flex h-36 w-full flex-col rounded-2xl border p-4 transition hover:border-secondary"
    >
      <div className="flex-1">
        <h4 className="border-b transition group-hover:border-secondary group-hover:text-secondary">
          {title}
        </h4>
      </div>
      <p className="text-3xl font-semibold transition group-hover:text-secondary">
        {value}
      </p>
    </Link>
  );
};

export default LinkCard;
