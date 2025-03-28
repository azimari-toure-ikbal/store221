"use server";

import { logVerbose } from "@/config";
import { Identities, init, Users } from "@kinde/management-api-js";

export const registerUser = async (user: {
  id: string;
  email: string;
  givenName: string;
  familyName: string;
  admin: boolean;
}) => {
  init();

  try {
    const kUser = await Users.createUser({
      requestBody: {
        profile: {
          family_name: user.familyName,
          given_name: user.givenName,
        },
        organization_code: user.admin
          ? process.env.KINDE_ADMIN_ORG
          : process.env.KINDE_CLIENT_ORG,
        identities: [
          {
            type: "email",
            details: {
              email: user.email,
            },
          },
        ],
        provided_id: user.id,
      },
    });

    return kUser.id;
  } catch (error) {
    if (logVerbose) console.error(error);
    throw new Error("Failed to register user in KINDE");
  }
};

export const updateUser = async (user: {
  id: string;
  givenName: string;
  familyName: string;
  email: string;
}) => {
  init();

  // TODO: Add a way to switch the user org.
  try {
    const kIden = await Users.getUserIdentities({
      userId: user.id,
    });

    if (!kIden.identities || kIden.identities.length === 0) {
      if (logVerbose)
        console.error(
          `User ${user.id} has no identities. Can't update user in KINDE`,
        );
      throw new Error("User has no identities");
    }

    if (!kIden.identities[0].id) {
      if (logVerbose)
        console.error(
          `User ${user.id} has no identity id. Can't update user in KINDE`,
        );
      throw new Error("User has no identity id");
    }

    await Identities.deleteIdentity({
      identityId: kIden.identities[0].id,
    });

    const kUser = await Users.updateUser({
      id: user.id,
      requestBody: {
        family_name: user.familyName,
        given_name: user.givenName,
      },
    });

    await Users.createUserIdentity({
      userId: user.id,
      requestBody: {
        type: "email",
        value: user.email,
      },
    });

    return kUser.id;
  } catch (error) {
    if (logVerbose) console.error(error);
    throw new Error("Failed to update user in KINDE");
  }
};

export const deleteUser = async (id: string) => {
  init();

  try {
    await Users.deleteUser({
      id,
      isDeleteProfile: true,
    });
  } catch (error) {
    if (logVerbose) console.error(error);
    throw new Error("Failed to delete user in KINDE");
  }
};
