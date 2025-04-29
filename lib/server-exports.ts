import got from "got";

export const baseUrl = process.env.PAYPAL_BASE_URL ?? "";

export const getAccessToken = async () => {
  try {
    const res = await got.post(`${baseUrl}/v1/oauth2/token`, {
      form: {
        grant_type: "client_credentials",
      },
      username: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
      password: process.env.PAYPAL_SECRET,
    });

    // console.log("res", res.body);
    const data = JSON.parse(res.body);
    return data.access_token;
  } catch (e) {
    throw new Error(`Error in getAccessToken: ${e}`);
  }
};
