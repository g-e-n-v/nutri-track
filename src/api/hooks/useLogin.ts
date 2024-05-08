import client from "@/api/client";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";

type PathParams = Record<string, string>;
type QueryParams = Record<string, string>;

type Body = {
  email: string;
  password: string;
  deviceToken: string;
  deviceType: string;
};
type MutationProps = Partial<{
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

type Props = Omit<UseMutationOptions<Response, Error, MutationProps>, "mutationFn">;

const path = "/auth/login";
const mutationFn = ({ body, pathParams = {}, queryParams = {} }: MutationProps) => {
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

export function useApiLogin(props: Props = {}) {
  return useMutation({
    ...props,
    mutationFn,
  });
}
