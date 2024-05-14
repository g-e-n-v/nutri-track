import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import client from "@/api/client";

type PathParams = Record<string, string>;
type QueryParams = Record<string, string>;
type Body = Record<string, string>;

type QueryProps = {
  pathParams?: PathParams;
  queryParams?: QueryParams;
  body?: Body;
};

type Response = {
  results: Array<{
    id: number;
    weight: number;
    date: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
  }>;
  totalPages: number;
  page: number;
  limit: number;
  totalResults: number;
};

type Props = {
  queryProps?: QueryProps;
} & Omit<UseQueryOptions<Response>, "queryKey" | "queryFn">;

const path = "/bmi-records";
const queryFn = ({ body, pathParams = {}, queryParams = {} }: QueryProps) => {
  const url = Object.entries(pathParams).reduce(
    (url, [key, value]) => url.replace(`{${key}}`, String(value)),
    path
  );

  return client<Response>({
    method: "get",
    url,
    data: body,
    params: queryParams,
  }).then((res) => res.data);
};

const defaultQueryProps: QueryProps = {};

export function useGetUserBMIRecords({ queryProps = defaultQueryProps, ...props }: Props = {}) {
  return useQuery({
    ...props,
    queryKey: [path, queryProps],
    queryFn: () => queryFn(queryProps),
  });
}
