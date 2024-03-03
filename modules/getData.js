// import { keys } from "../keys.js";
// let { client_id, client_secret } = keys;
const client_id = process.env.client_id;
const client_secret = process.env.client_secret;

let spotifyURL = `https://api.spotify.com/v1/`;

// 토큰 요청
const getToken = async ({ client_id, client_secret }) => {
  const authOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(client_id + ":" + client_secret),
    },
    body: "grant_type=client_credentials",
  };

  try {
    const response = await fetch(
      "https://accounts.spotify.com/api/token",
      authOptions
    );
    // 토큰 반환
    let token = await response.json();
    return token;
  } catch (error) {
    console.error("Error:", error);
  }
};

let token;

// 데이터 요청
export const getData = async (url) => {
  // 토큰이 없을 경우 token 요청
  if (!token) {
    token = await getToken({ client_id, client_secret });
  }
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    // 토큰이 만료되어 401 에러가 날 경우 토큰 다시 요청 하고 getData 다시 수행
    if (error.status === 401) {
      await getToken({ client_id, client_secret });
      return getData(url);
    } else {
      console.error("Error:", error);
    }
  }
};

// 검색용 함수
export const spotifySearch = ({ q, type }) => {
  let url = `${spotifyURL}search?q=${q}&type=${type}&limit=6`;
  return getData(url);
};
