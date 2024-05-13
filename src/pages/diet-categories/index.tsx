import { useGetDietCategories } from "@/api/hooks/useGetDietCategories";
import { Button, Table, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { useState } from "react";

export default function DietCategoriesPage() {
  const { data, isLoading } = useGetDietCategories({
    queryProps: {
      queryParams: {
        limit: 10_000,
        page: 1,
      },
    },
  });

  const [selectedItem, setSelectedItem] = useState<NonNullable<typeof data>["results"][number]>();

  return (
    <>
      <Table
        loading={isLoading}
        dataSource={data?.results}
        scroll={{ y: "calc(100vh - 300px)", x: 0 }}
        columns={[
          {
            width: 60,
            title: "ID",
            dataIndex: "id",
          },
          {
            width: 150,
            title: "Name",
            dataIndex: "name",
          },
          {
            width: 400,
            title: "Description",
            dataIndex: "description",
          },
          {
            width: 300,
            title: "Low",
            dataIndex: "low",
            render: (value: string[]) => value.map((v) => <Tag>{v}</Tag>),
          },
          {
            width: 300,
            title: "Hight",
            dataIndex: "high",
            render: (value: string[]) => value.map((v) => <Tag>{v}</Tag>),
          },
          // {
          //   title: "Status",
          //   dataIndex: "status",
          //   render: (status) => <Tag color={StatusColorMap[status]}>{status}</Tag>,
          // },
          {
            width: 200,
            title: "Updated At",
            dataIndex: "updatedAt",
            render: (updatedAt) => dayjs(updatedAt).format("YYYY-MM-DD HH:mm:ss"),
          },
          {
            width: 100,
            fixed: "right",
            title: "Action",
            render: (_, record) => (
              <>
                {/* <Tooltip title="Delete">
                  <Button
                    danger
                    type="primary"
                    icon={<DeleteOutlined />}
                    // onClick={() => deleteApplication({ pathParams: { id: record.id } })}
                  />
                </Tooltip> */}
              </>
            ),
          },
        ]}
        pagination={{
          pageSize: 10,
          total: data?.totalResults,
        }}
        rowKey={(row) => row.id}
      />
    </>
  );
}
