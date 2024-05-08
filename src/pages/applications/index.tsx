import { useDeleteApplication } from "@/api/hooks/useDeleteApplication";
import { useGetApplications } from "@/api/hooks/useGetApplications";
import { Layout } from "@/components/Layout";
import { StatusColorMap } from "@/constants/tag-color.constant";
import { DeleteOutlined } from "@ant-design/icons";
import { App, Button, Image, Table, Tag, Tooltip } from "antd";
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

  const {
    data,
    isLoading,
    refetch: refetchList,
  } = useGetApplications({
    queryProps: {
      queryParams: {
        limit: pagination.limit,
        page: pagination.page,
      },
    },
  });

  const { mutateAsync: deleteApplication, isPending } = useDeleteApplication({
    onSuccess: () => {
      refetchList();
      message.success("Deleted Successfully!");
    },
  });

  useEffect(() => {
    if (data) {
      setPagination(omit(data, "results"));
    }
  }, [data]);

  console.log(data);

  return (
    <Layout>
      <Table
        loading={isLoading || isPending}
        dataSource={data?.results}
        columns={[
          {
            title: "#",
            dataIndex: "id",
            render: (_id, _record, idx) => idx + pagination.limit * (pagination.page - 1),
          },
          {
            title: "ID",
            dataIndex: "id",
            render: (id: string) => <Link to={`/applications/${id}`}>{id}</Link>,
          },
          {
            title: "Image",
            dataIndex: "image",
            render: (image: string) => (
              <div className="size-20 bg-gray-500 rounded-md">
                {image && <Image src={image} alt="image" className="size-20" />}
              </div>
            ),
          },
          {
            title: "Description",
            dataIndex: "description",
          },
          {
            title: "Initial Weight",
            dataIndex: "initialWeight",
          },
          {
            title: "Note",
            dataIndex: "note",
          },
          {
            title: "Status",
            dataIndex: "status",
            render: (status) => <Tag color={StatusColorMap[status]}>{status}</Tag>,
          },
          {
            title: "Updated At",
            dataIndex: "updatedAt",
            render: (updatedAt) => dayjs(updatedAt).format("YYYY-MM-DD HH:mm:ss"),
          },
          {
            title: "Action",
            render: (_, record) => (
              <>
                <Tooltip title="Delete">
                  <Button
                    danger
                    type="primary"
                    icon={<DeleteOutlined />}
                    onClick={() => deleteApplication({ pathParams: { id: record.id } })}
                  />
                </Tooltip>
              </>
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
    </Layout>
  );
}
