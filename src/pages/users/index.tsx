import { useGetUserMedical } from "@/api/hooks/useGetUserMedical";
import { useGetUserRestriction } from "@/api/hooks/useGetUserRestriction";
import { useGetUsers } from "@/api/hooks/useGetUsers";
import { EyeOutlined } from "@ant-design/icons";
import { Button, Descriptions, Drawer, Table, Tooltip } from "antd";
import dayjs from "dayjs";
import { omit } from "lodash-es";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function UsersPage() {
  const [pagination, setPagination] = useState({
    limit: 10_000,
    page: 1,
    totalPages: NaN,
    totalResults: NaN,
  });

  const { data, isLoading } = useGetUsers({
    queryProps: {
      queryParams: {
        limit: pagination.limit,
        page: pagination.page,
      },
    },
  });

  const [selectedItem, setSelectedItem] = useState<NonNullable<typeof data>["results"][number]>();

  const { data: medical } = useGetUserMedical({
    queryProps: {
      pathParams: { id: selectedItem?.id as number },
    },
    enabled: !!selectedItem?.id,
  });

  const { data: restriction } = useGetUserRestriction({
    queryProps: {
      pathParams: { id: selectedItem?.id as number },
    },
    enabled: !!selectedItem?.id,
  });

  useEffect(() => {
    if (data) {
      setPagination(omit(data, "results"));
    }
  }, [data]);

  return (
    <>
      <Table
        loading={isLoading}
        dataSource={data?.results}
        scroll={{ y: "calc(100vh - 300px)", x: 0 }}
        columns={[
          // {
          //   width: 60,
          //   title: "#",
          //   dataIndex: "id",
          //   render: (_id, _record, idx) => idx + pagination.limit * (pagination.page - 1),
          // },
          {
            width: 60,
            title: "ID",
            dataIndex: "id",
            render: (id: string) => <Link to={`/applications/${id}`}>{id}</Link>,
          },
          {
            width: 150,
            title: "Name",
            dataIndex: "name",
          },
          {
            width: 250,
            title: "Email",
            dataIndex: "email",
          },
          {
            width: 150,
            title: "Role",
            dataIndex: "role",
          },
          {
            width: 150,
            title: "Average Score",
            dataIndex: "averageScore",
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
                <Tooltip title="View Detail">
                  <Button onClick={() => setSelectedItem(record)} icon={<EyeOutlined />} />
                </Tooltip>
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
          total: pagination.totalResults,
        }}
        rowKey={(row) => row.id}
      />

      <Drawer open={!!selectedItem} onClose={() => setSelectedItem(undefined)} width={700}>
        <Descriptions
          title={<div className="flex items-center gap-2">User Detail</div>}
          layout="vertical"
          column={3}
          items={[
            {
              label: "Name",
              children: selectedItem?.name,
            },
            {
              span: 2,
              label: "Email",
              children: selectedItem?.email,
            },
            {
              label: "Role",
              children: selectedItem?.role,
            },
            {
              label: "Average Score",
              children: selectedItem?.averageScore,
            },
            {
              label: "Last update",
              children: dayjs(selectedItem?.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
            },
          ]}
        />

        <Descriptions
          className="mt-4"
          title={<div>Medical</div>}
          layout="vertical"
          column={2}
          items={[
            {
              span: 2,
              label: "Name",
              children: medical?.medicalCondition.name,
            },
            {
              span: 2,
              label: "Description",
              children: medical?.medicalCondition.description,
            },
            {
              label: "Low",
              children: medical?.medicalCondition.low,
            },
            {
              label: "High",
              children: medical?.medicalCondition.high,
            },
            {
              label: "Avoid",
              children: medical?.medicalCondition.avoid,
            },
          ]}
        />
        <Descriptions
          className="mt-4"
          title={<div>Restriction</div>}
          layout="vertical"
          column={2}
          items={[
            {
              label: "Low",
              children: restriction?.restriction.low,
            },
            {
              label: "High",
              children: restriction?.restriction.high,
            },
            {
              span: 2,
              label: "Avoid",
              children: restriction?.restriction.avoid,
            },
          ]}
        />
      </Drawer>
    </>
  );
}
