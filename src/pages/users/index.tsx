import { useGetUsers } from "@/api/hooks/useGetUsers";
import { Table } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function UsersPage() {
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 1,
    totalPages: NaN,
    totalResults: NaN,
  });

  const {
    data,
    isLoading,
    // refetch: refetchList,
  } = useGetUsers({
    queryProps: {
      queryParams: {
        limit: pagination.limit,
        page: pagination.page,
      },
    },
  });

  return (
    <>
      <Table
        loading={isLoading}
        dataSource={data?.results}
        scroll={{ y: "calc(100vh - 300px)", x: 0 }}
        columns={[
          {
            width: 60,
            title: "#",
            dataIndex: "id",
            render: (_id, _record, idx) => idx + pagination.limit * (pagination.page - 1),
          },
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
          // {
          //   fixed: "right",
          //   title: "Action",
          //   render: (_, record) => (
          //     <>
          //       <Tooltip title="Delete">
          //         <Button
          //           danger
          //           type="primary"
          //           icon={<DeleteOutlined />}
          //           // onClick={() => deleteApplication({ pathParams: { id: record.id } })}
          //         />
          //       </Tooltip>
          //     </>
          //   ),
          // },
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
    </>
  );
}
