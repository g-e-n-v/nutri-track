import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import client from "@/api/client";

type PathParams = Record<string, string>;
type QueryParams = {
  sortBy?: string;
  sortType?: string;
  limit?: number;
  page?: number;
};
type Body = Record<string, string>;

type QueryProps = Partial<{
  pathParams: PathParams;
  queryParams: QueryParams;
  body: Body;
}>;

type Response = {
  results: Array<{
    id: number;
    name: string;
    description: string;
    high: Array<string>;
    low: Array<string>;
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

const path = "/diet-categories";
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

const defaultQueryProps: QueryProps = {
  queryParams: {
    limit: 10,
    page: 1,
    sortType: "asc",
  },
};

export function useGetDietCategories({ queryProps = defaultQueryProps, ...props }: Props = {}) {
  return useQuery({
    ...props,
    queryKey: [path, queryProps],
    queryFn: () => queryFn(queryProps),
  });
}
