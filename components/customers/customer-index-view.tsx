"use client";

import LinkCard from "@/components/customers/link-card";
import UpdateUserInfo from "@/components/customers/update-user-info";
import { trpc } from "@/server/trpc/client";
import React from "react";

type CustomerIndexViewProps = {};

const CustomerIndexView: React.FC<CustomerIndexViewProps> = ({}) => {
  const [data] = trpc.users.getCurrentUser.useSuspenseQuery();

  if (!data) {
    return (
      <div>
        Une erreur est survenue sur cette page. Contactez un administrateur.
      </div>
    );
  }

  return (
    <div className="left-right-layout">
      <div className="left-col p-6">
        <div className="flex w-2/3 flex-col gap-4">
          {/* <UpdateAvatar fullName={`${data.givenName} ${data.familyName}`} /> */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between border-b">
              <h2 className="text-sm">Informations de compte</h2>
              <UpdateUserInfo />
            </div>

            <div className="flex items-center justify-between">
              <p>Prénom</p>
              <p>{data.givenName}</p>
            </div>
            <div className="flex items-center justify-between">
              <p>Nom</p>
              <p>{data.familyName}</p>
            </div>
            <div className="flex items-center justify-between">
              <p>Email</p>
              <p>{data.email}</p>
            </div>
            <div className="flex items-center justify-between">
              <p>Téléphone</p>
              <p>{data.phone}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="right-col">
        {/* <LinkCard
          href="/customer/orders"
          title="Commandes passée(s)"
          value={`${data.orders.length} commande(s)`}
        /> */}
        <LinkCard
          href="/customer/addresses"
          title="Adresse(s) de livraison"
          value={`${data.addresses.length} adresse(s)`}
        />
        <LinkCard
          href="/customer/favorites"
          title="Favoris"
          value={`${data.favorites.length} favori(s)`}
        />
        {/* <LinkCard
          href="#"
          title="Point(s) de fidélité"
          value={`${data.fidelityPoints} point(s)`}
        /> */}
      </div>
    </div>
  );
};

export default CustomerIndexView;
