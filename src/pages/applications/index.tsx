// import { useDeleteApplication } from "@/api/hooks/useDeleteApplication";
import { useGetApplications } from "@/api/hooks/useGetApplications";
import { usePutChangeApplicationStatus } from "@/api/hooks/usePutChangeApplicationStatus";
import { StatusColorMap } from "@/constants/tag-color.constant";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { App, Button, Image, Table, Tabs, Tag, Tooltip } from "antd";
import clsx from "clsx";
import dayjs from "dayjs";
import { omit } from "lodash-es";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ApplicationsPage() {
  const { message } = App.useApp();

  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
    totalPages: NaN,
    totalResults: NaN,
  });

  const [filter, setFilter] = useState<string>("ALL");

  const {
    data,
    isLoading,
    refetch: refetchList,
  } = useGetApplications({
    queryProps: {
      queryParams: {
        limit: pagination.limit,
        page: pagination.page,
        sortBy: "createdAt",
        sortType: "desc",
      },
    },
  });

  // const { mutateAsync: deleteApplication, isPending } = useDeleteApplication({
  //   onSuccess: () => {
  //     refetchList();
  //     message.success("Deleted Successfully!");
  //   },
  // });

  const { mutateAsync: changeApplicationStatus, isPending } = usePutChangeApplicationStatus({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      message.error(error.response?.data?.message);
    },
  });

  useEffect(() => {
    if (data) {
      setPagination(omit(data, "results"));
    }
  }, [data]);

  const displayApplications =
    filter === "ALL" ? data?.results : data?.results?.filter((item) => item.status === filter);

  return (
    <div>
      <Button.Group className="mb-4">
        <Button className={clsx({ "bg-blue-500 text-white": filter === "ALL" })}>ALL</Button>
        <Button
          onClick={() => setFilter("PENDING")}
          className={clsx("text-amber-500", { "bg-amber-500 text-white": filter === "PENDING" })}
        >
          PENDING
        </Button>
        <Button
          onClick={() => setFilter("APPROVED")}
          className={clsx("text-green-500", { "bg-green-500 text-white": filter === "APPROVED" })}
        >
          APPROVED
        </Button>
        <Button
          onClick={() => setFilter("REJECTED")}
          className={clsx("text-red-500", { "bg-red-500 text-white": filter === "REJECTED" })}
        >
          REJECTED
        </Button>
      </Button.Group>

      <Table
        loading={isLoading || isPending}
        dataSource={displayApplications}
        scroll={{ y: "calc(100vh - 300px)", x: 0 }}
        columns={[
          {
            fixed: "left",
            width: 60,
            title: "#",
            dataIndex: "id",
            render: (_id, _record, idx) => idx + pagination.limit * (pagination.page - 1),
          },
          {
            fixed: "left",
            width: 60,
            title: "ID",
            dataIndex: "id",
            render: (id: string) => <Link to={`/applications/${id}`}>{id}</Link>,
          },
          {
            fixed: "left",
            width: 120,
            title: "Image",
            dataIndex: "image",
            render: (image: string) => (
              <div className="size-20 bg-gray-200 rounded-md">
                {image && <Image src={image} alt="image" className="size-20" preview={false} />}
              </div>
            ),
          },
          {
            fixed: "left",
            width: 200,
            title: "Description",
            dataIndex: "description",
          },
          {
            width: 120,
            title: "Initial Weight",
            dataIndex: "initialWeight",
          },
          {
            width: 150,
            title: "Note",
            dataIndex: "note",
          },
          {
            width: 100,
            title: "Status",
            dataIndex: "status",
            render: (status) => <Tag color={StatusColorMap[status]}>{status}</Tag>,
          },
          {
            width: 200,
            title: "Updated At",
            dataIndex: "updatedAt",
            render: (updatedAt) => dayjs(updatedAt).format("YYYY-MM-DD HH:mm:ss"),
          },
          {
            fixed: "right",
            width: 150,
            title: "Action",
            render: (_, record) => (
              <div className="flex gap-4">
                <Tooltip title="Approve">
                  <Button
                    type="primary"
                    disabled={record.status === "APPROVED"}
                    // icon={<DeleteOutlined />}
                    // onClick={() => deleteApplication({ pathParams: { id: record.id } })}
                    icon={<CheckOutlined />}
                    onClick={async () => {
                      await changeApplicationStatus({
                        pathParams: { id: record.id },
                        body: { status: "APPROVED" },
                      });
                      await refetchList();
                    }}
                  />
                </Tooltip>
                <Tooltip title="Reject">
                  <Button
                    danger
                    type="primary"
                    disabled={record.status === "REJECTED"}
                    // icon={<DeleteOutlined />}
                    // onClick={() => deleteApplication({ pathParams: { id: record.id } })}
                    icon={<CloseOutlined />}
                    onClick={async () => {
                      await changeApplicationStatus({
                        pathParams: { id: record.id },
                        body: { status: "REJECTED" },
                      });
                      await refetchList();
                    }}
                  />
                </Tooltip>
              </div>
            ),
          },
        ]}
        pagination={{
          pageSize: pagination.limit,
          current: pagination.page,
          total: pagination.totalResults,
          onChange: (page, _pageSize) => {
            setPagination((prev) => ({ ...prev, page }));
          },
        }}
        rowKey={(row) => row.id}
      />
    </div>
  );
}
