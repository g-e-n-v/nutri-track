import client from "@/api/client";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";

type PathParams = {
  id: string | number;
};
type QueryParams = Record<string, string>;
type Body = Record<string, string>;
type MutationProps = {
  pathParams: PathParams;
  queryParams?: QueryParams;
  body?: Body;
};

type Response = Record<string, string>;

type Props = Omit<UseMutationOptions<Response, Error, MutationProps>, "mutationFn">;

const path = "/users/{id}";
const mutationFn = ({ body, pathParams, queryParams = {} }: MutationProps) => {
  const url = Object.entries(pathParams).reduce(
    (url, [key, value]) => url.replace(`{${key}}`, String(value)),
    path
  );

  return client<Response>({
    method: "delete",
    url,
    data: body,
    params: queryParams,
  }).then((res) => res.data);
};

export function useDeleteUser(props: Props = {}) {
  return useMutation({
    ...props,
    mutationFn,
  });
}
