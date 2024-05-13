import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import client from "@/api/client";

type PathParams = {
  id: number;
};
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

const path = "/users/{id}";
const queryFn = ({ body, pathParams = { id: NaN }, queryParams = {} }: QueryProps) => {
  console.log(pathParams);
  const url = Object.entries(pathParams).reduce(
    (url, [key, value]) => url.replace(`{${key}}`, String(value)),
    path
  );

  console.log(url);

  return client<Response>({
    method: "get",
    url,
    data: body,
    params: queryParams,
  }).then((res) => res.data);
};

const defaultQueryProps: QueryProps = {};

export function useGetUser({ queryProps = defaultQueryProps, ...props }: Props = {}) {
  return useQuery({
    ...props,
    queryKey: [path, queryProps],
    queryFn: () => queryFn(queryProps),
  });
}
