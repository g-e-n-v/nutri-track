import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import client from "@/api/client";

type PathParams = Record<string, string>;
type QueryParams = Record<string, string>;
type Body = Record<string, string>;

type QueryProps = Partial<{
  pathParams: PathParams;
  queryParams: QueryParams;
  body: Body;
}>;

type Response = {
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

type Props = {
  queryProps?: QueryProps;
} & Omit<UseQueryOptions<Response>, "queryKey" | "queryFn">;

const path = "/auth/profile";
const queryFn = ({ body, pathParams = {}, queryParams = {} }: QueryProps) => {
  const url = Object.entries(pathParams).reduce((url, [key, value]) => {
    url.replace(`{${key}}`, value);
    return url;
  }, path);

  return client<Response>({
    method: "get",
    url,
    data: body,
    params: queryParams,
  }).then((res) => res.data);
};

const defaultQueryProps: QueryProps = {};

export function useGetMe({ queryProps = defaultQueryProps, ...props }: Props = {}) {
  return useQuery({
    ...props,
    queryKey: [path, queryProps],
    queryFn: () => queryFn(queryProps),
  });
}
