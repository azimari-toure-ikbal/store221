"use client";

import { sessionAtom } from "@/lib/atoms";
import { generateUUIDv4 } from "@/lib/utils";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useAtom } from "jotai";
import React from "react";

export default function GlobalSessionProvider() {
  const { user } = useKindeBrowserClient();
  const [sessionId, setSessionId] = useAtom(sessionAtom);

  React.useEffect(() => {
    // if (typeof window === "undefined") return;

    if (sessionId === "") {
      // console.log("Session ID is empty, creating one...");
      setSessionId(generateUUIDv4());
    }

    if (user) {
      // console.log("User is authenticated, syncing user with session...");
    } else {
      // console.log("No user is authenticated, skipping sync...");
    }
  }, [user]);

  return null; // Server components don’t return JSX directly
}
