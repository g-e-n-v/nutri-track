import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import client from "@/api/client";

type PathParams = {
  id: number;
};
type QueryParams = Record<string, string>;
type Body = Record<string, string>;

type QueryProps = {
  pathParams: PathParams;
  queryParams?: QueryParams;
  body?: Body;
};

type Response = {
  id: number;
  userId: number;
  conditionId: number;
  createdAt: string;
  updatedAt: string;
  medicalCondition: {
    id: number;
    name: string;
    description: string;
    high: string;
    low: string;
    avoid: string;
    createdAt: string;
    updatedAt: string;
  };
};

type Props = {
  queryProps?: QueryProps;
} & Omit<UseQueryOptions<Response>, "queryKey" | "queryFn">;

const path = "/user-medical-conditions/{id}";
const queryFn = ({ body, pathParams = { id: NaN }, queryParams = {} }: QueryProps) => {
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

const defaultQueryProps: QueryProps = {
  pathParams: { id: NaN },
};

export function useGetUserMedical({ queryProps = defaultQueryProps, ...props }: Props = {}) {
  return useQuery({
    ...props,
    queryKey: [path, queryProps],
    queryFn: () => queryFn(queryProps),
  });
}
