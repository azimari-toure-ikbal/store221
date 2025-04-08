"use client";

import { sessionAtom } from "@/lib/atoms";
import { generateUUIDv4 } from "@/lib/utils";
import { useAtom } from "jotai";
import Cookies from "js-cookie";
import React from "react";

export default function GlobalSessionProvider() {
  const [sessionId, setSessionId] = useAtom(sessionAtom);

  React.useEffect(() => {
    const sessionId = Cookies.get("S221_SESSION_ID");

    // if (!sessionId) {
    //   const newSessionId = generateUUIDv4();
    //   Cookies.set("S221_SESSION_ID", newSessionId, { expires: 7 }); // Expires in 7 days
    // }

    if (sessionId) {
      setSessionId(sessionId);
    } else {
      const newSessionId = generateUUIDv4();
      Cookies.set("S221_SESSION_ID", newSessionId, { expires: 7 }); // Expires in 7 days
      setSessionId(newSessionId);
    }
  }, []);

  return null; // Server components don’t return JSX directly
}
