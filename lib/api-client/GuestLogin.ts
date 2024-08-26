/**
 * File: GuestLogin.ts
 * Desc: Helper method login as guest - for request api access token for guest
 * Created By: anirutn@thaicom.net
 * Date: 2024/08/15
 * Last Update: 2024/08/15
 */
import UserAccountLoginResponse from '@/models/UserAccountLoginResponse';
import axios from 'axios';
import https from 'https';

export default async function GuestLogin() : Promise<UserAccountLoginResponse | any> {
  const agent = new https.Agent({
    rejectUnauthorized: false
  });

  var config = {
    httpsAgent: agent,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.API_KEY,
      // "Authorization": `Bearer ${apiToken}`,
    }
  };

  try {
    const apiEndpoint = `/durian-api/auth/login/guest`;
    const res: UserAccountLoginResponse = await axios.post(apiEndpoint, { }, config)
      .then(res => res.data)
      .catch((err) => { return { status: err.response?.status ?? 400, data: `${err.response?.data ?? "Bad Request"}` }});
    return res;
  } catch { }

  return { status: 400, title: "Guest Login Failed", detail: ""};
}
