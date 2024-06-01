// import { useDeleteApplication } from "@/api/hooks/useDeleteApplication";
import { useGetApplications } from "@/api/hooks/useGetApplications";
import { useGetUser } from "@/api/hooks/useGetUser";
import { usePutChangeApplicationStatus } from "@/api/hooks/usePutChangeApplicationStatus";
import { StatusColorMap } from "@/constants/tag-color.constant";
import { CheckOutlined, CloseOutlined, EyeOutlined } from "@ant-design/icons";
import { App, Button, Descriptions, Drawer, Image, Table, Tag, Tooltip } from "antd";
import clsx from "clsx";
import dayjs from "dayjs";
import { omit, sortBy } from "lodash-es";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ApplicationsPage() {
  const { message } = App.useApp();

  const [pagination, setPagination] = useState({
    limit: 10_000,
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

  const [selectedItem, setSelectedItem] = useState<NonNullable<typeof data>["results"][number]>();
  const { data: owner } = useGetUser({
    queryProps: { pathParams: { id: Number(selectedItem?.userId) } },
    enabled: !!selectedItem?.userId,
  });

  const { data: approver } = useGetUser({
    queryProps: { pathParams: { id: Number(selectedItem?.approvedById) } },
    enabled: !!selectedItem?.approvedById,
  });

  const { mutateAsync: changeApplicationStatus, isPending } = usePutChangeApplicationStatus({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      message.error(error.response?.data?.message);
    },
    onSuccess: () => {
      message.success("Change application status success");
      refetchList();
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
        <Button
          onClick={() => setFilter("ALL")}
          className={clsx({ "bg-blue-500 text-white": filter === "ALL" })}
        >
          ALL
        </Button>
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
        dataSource={sortBy(displayApplications, (app) => -app.updatedAt.valueOf())}
        scroll={{ y: "calc(100vh - 360px)", x: 0 }}
        columns={[
          // {
          //   fixed: "left",
          //   width: 60,
          //   title: "#",
          //   dataIndex: "id",
          //   render: (_id, _record, idx) => idx,
          // },
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
              <div className="size-20 bg-gray-200 rounded-md overflow-hidden">
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
            width: 140,
            title: "Target Weight",
            dataIndex: "targetWeight",
          },
          {
            width: 150,
            title: "Note",
            dataIndex: "note",
          },
          {
            width: 170,
            title: "Type",
            dataIndex: "type",
            filters: [
              {
                text: "UPDATE_DIET",
                value: "UPDATE_DIET",
              },
              {
                text: "CREATE_DIET",
                value: "CREATE_DIET",
              },
              {
                text: "REGISTER_EXPERT",
                value: "REGISTER_EXPERT",
              },
            ],
            onFilter: (value, record) => record.type === value,
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
            render: (updatedAt) => dayjs(updatedAt).format("HH:mm DD/MM/YYYY"),
          },
          {
            fixed: "right",
            width: 150,
            title: "Action",
            render: (_, record) => (
              <div className="flex gap-4">
                <Tooltip title="View Detail">
                  <Button onClick={() => setSelectedItem(record)} icon={<EyeOutlined />} />
                </Tooltip>

                <Tooltip title="Approve">
                  <Button
                    type="primary"
                    disabled={record.status === "APPROVED" || record.type !== "REGISTER_EXPERT"}
                    // icon={<DeleteOutlined />}
                    // onClick={() => deleteApplication({ pathParams: { id: record.id } })}
                    icon={<CheckOutlined />}
                    onClick={async () => {
                      await changeApplicationStatus({
                        pathParams: { id: record.id },
                        body: { status: "APPROVED" },
                      });
                    }}
                  />
                </Tooltip>
                <Tooltip title="Reject">
                  <Button
                    danger
                    type="primary"
                    disabled={record.status === "REJECTED" || record.type !== "REGISTER_EXPERT"}
                    // icon={<DeleteOutlined />}
                    // onClick={() => deleteApplication({ pathParams: { id: record.id } })}
                    icon={<CloseOutlined />}
                    onClick={async () => {
                      await changeApplicationStatus({
                        pathParams: { id: record.id },
                        body: { status: "REJECTED" },
                      });
                    }}
                  />
                </Tooltip>
              </div>
            ),
          },
        ]}
        pagination={{
          pageSize: 10,
          total: displayApplications?.length,
        }}
        rowKey={(row) => row.id}
      />

      <Drawer open={!!selectedItem} onClose={() => setSelectedItem(undefined)} width={600}>
        <Descriptions
          title={
            <div className="flex items-center gap-2">
              Application Detail{" "}
              <Tag color={StatusColorMap[selectedItem?.status ?? ""]}>{selectedItem?.status}</Tag>
            </div>
          }
          layout="vertical"
          column={3}
          items={[
            {
              // label: "Image",
              children: (
                <div className="size-20 bg-gray-200 rounded-md overflow-hidden">
                  {selectedItem?.image && (
                    <Image
                      src={selectedItem.image}
                      alt="image"
                      className="size-20"
                      preview={false}
                    />
                  )}
                </div>
              ),
              span: 1,
            },
            {
              span: 2,
              label: "Description",
              children: selectedItem?.description ?? "--",
            },
            {
              label: "Initial Weight",
              children: selectedItem?.initialWeight ?? "--",
            },
            {
              label: "Target Weight",
              children: selectedItem?.targetWeight ?? "--",
            },
            {
              label: "Note",
              children: selectedItem?.note ?? "--",
            },
            {
              label: "Owner",
              children: owner?.name,
            },
            {
              label: "Approver",
              children: approver?.name,
            },
            {
              label: "Updated At",
              children: dayjs(selectedItem?.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
            },
          ]}
        />
      </Drawer>
    </div>
  );
}
