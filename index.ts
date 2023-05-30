export const handleGetParamString = (data: any = {}) => {
  const queryArray: Array<string> = [];
  Object.keys(data).map((key) => {
    queryArray.push(`${key}=${encodeURIComponent(data[key])}`);
  });
  return queryArray.join("&");
};

interface IRequestProps {
  url: string;
  config?: any;
  data?: any;
  method?: string;
  headers?: any;
}

const BaseUrl = "";

const handletransformData = (data: any, method: string, headers: any) => {
  if (method === "GET") {
    return null;
  } else if (
    method === "POST" &&
    headers["Content-Type"]?.includes("x-www-form-urlencoded")
  ) {
    return handleGetParamString(data);
  } else {
    return JSON.stringify(data);
  }
};

export default (props: IRequestProps) => {
  let { url, config = {}, data, method = "GET", headers = {} } = props || {};

  method = method.toUpperCase();

  url = method === "GET" ? `${url}?${handleGetParamString(data)}` : url;

  data = handletransformData(data, method, headers);

  return new Promise((resolve, reject) => {
    fetch(`${BaseUrl}${url}`, {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      ...config,
      credentials: "include",
      method,
      body: data,
    })
      .then((midRes) => midRes.json())
      .then((res) => {
        if (res?.status === "-1") {
          reject(res);
        }
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
