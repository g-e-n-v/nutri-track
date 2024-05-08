import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import client from "@/api/client";

type PathParams = Record<string, string>;
type QueryParams = Record<string, string>;

type Body = {
  email: string;
  password: string;
  deviceToken: string;
  deviceType: string;
};
type QueryProps = Partial<{
  pathParams: PathParams;
  queryParams: QueryParams;
  body: Body;
}>;

type Response = {
  user: {
    id: number;
    email: string;
    name: string;
    avatar: string;
    role: string;
    gender: string;
    accountType: string;
    height: number;
    dob: string;
    guid: string;
    createdAt: string;
    updatedAt: string;
  };
  tokens: {
    access: {
      token: string;
      expires: string;
    };
    refresh: {
      token: string;
      expires: string;
    };
  };
};

type Props = {
  queryProps?: QueryProps;
} & Omit<UseQueryOptions<Response>, "queryKey" | "queryFn">;

const path = "/auth/login";
const queryFn = ({ body, pathParams = {}, queryParams = {} }: QueryProps) => {
  const url = Object.entries(pathParams).reduce((url, [key, value]) => {
    url.replace(`{${key}}`, value);
    return url;
  }, path);

  return client<Response>({
    method: "POST",
    url,
    data: body,
    params: queryParams,
  }).then((res) => res.data);
};

export function useApiLogin({ queryProps = {}, ...props }: Props = {}) {
  return useQuery({
    ...props,
    queryKey: [path, queryProps],
    queryFn: () => queryFn(queryProps),
  });
}
