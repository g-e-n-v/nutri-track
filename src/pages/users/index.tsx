import { useGetUserBMIRecords } from "@/api/hooks/useGetUserBMIRecords";
import { useGetUserMedical } from "@/api/hooks/useGetUserMedical";
import { useGetUserRestriction } from "@/api/hooks/useGetUserRestriction";
import { useGetUsers } from "@/api/hooks/useGetUsers";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  DatePicker,
  Descriptions,
  Drawer,
  Form,
  Image,
  Input,
  Select,
  Table,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { Line } from "@ant-design/plots";
import { useDeleteUser } from "@/api/hooks/useDeleteUser";
import { useState } from "react";
import { omit, pick, sortBy } from "lodash-es";
import { useUpdateUser } from "@/api/hooks/useUpdateUser";

export default function UsersPage() {
  const { message } = App.useApp();

  const { data, isLoading, refetch } = useGetUsers({
    queryProps: {
      queryParams: {
        limit: 10_000,
        page: 1,
      },
    },
  });

  const { mutateAsync: deleteUser } = useDeleteUser({
    onSuccess: () => {
      message.success("Deleted!");
      refetch();
    },
  });

  const { mutateAsync: updateUser } = useUpdateUser({
    onSuccess: () => {
      message.success("Updated!");
      refetch();
    },
    onError: (error) => {
      message.error((error as any)?.response?.data?.message);
    },
  });

  const [form] = Form.useForm();

  const [openInfoDrawer, setOpenInfoDrawer] = useState(false);
  const [openUpsertDrawer, setOpenUpsertDrawer] = useState(false);
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

  const { data: bmiRecord } = useGetUserBMIRecords();

  const bmiRecords = sortBy(
    bmiRecord?.results.filter((item) => item.userId === selectedItem?.id),
    (item) => item.date
  ).map((record) => ({
    ...record,
    bmi: (record.weight / (Number(selectedItem?.height) / 100) ** 2).toFixed(2),
  }));

  return (
    <>
      {/* <Button
        className="mb-4"
        icon={<PlusCircleOutlined />}
        type="primary"
        onClick={() => {
          setOpenUpsertDrawer(true);
          form.resetFields();
        }}
      >
        Add user
      </Button> */}
      <Table
        loading={isLoading}
        dataSource={data?.results}
        scroll={{ y: "calc(100vh - 360px)", x: 0 }}
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
            width: 100,
            title: "Avatar",
            dataIndex: "avatar",
            render: (avt) => (
              <Image
                src={avt}
                alt="image"
                className="size-20 rounded-lg overflow-hidden"
                preview={false}
              />
            ),
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
          {
            width: 200,
            title: "Updated At",
            dataIndex: "updatedAt",
            render: (updatedAt) => dayjs(updatedAt).format("YYYY-MM-DD HH:mm:ss"),
          },
          {
            width: 120,
            fixed: "right",
            title: "Action",
            render: (_, record) => (
              <div className="flex items-center gap-2">
                <Tooltip title="View Detail">
                  <Button
                    onClick={() => {
                      setSelectedItem(record);
                      setOpenInfoDrawer(true);
                    }}
                    icon={<EyeOutlined />}
                  />
                </Tooltip>
                <Tooltip title="Edit">
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setOpenUpsertDrawer(true);
                      setSelectedItem(record);
                      form.setFieldsValue(pick(record, ["email", "name", "role"]));
                    }}
                  />
                </Tooltip>
                <Tooltip title="Delete">
                  <Button
                    danger
                    type="primary"
                    icon={<DeleteOutlined />}
                    onClick={() => deleteUser({ pathParams: { id: record.id } })}
                  />
                </Tooltip>
              </div>
            ),
          },
        ]}
        pagination={{
          pageSize: 10,
          total: data?.results.length,
        }}
        rowKey={(row) => row.id}
      />

      <Drawer
        open={openUpsertDrawer}
        onClose={() => {
          setOpenUpsertDrawer(false);
          setSelectedItem(undefined);
        }}
        destroyOnClose
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            Object.keys(values).forEach((key) => {
              // @ts-ignore;
              if (values[key] === selectedItem?.[key]) {
                delete values[key];
              }
            });

            updateUser({
              pathParams: { id: String(selectedItem?.id) },
              body: values,
            });

            setSelectedItem(undefined);
            setOpenUpsertDrawer(false);
          }}
        >
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>

          <>
            <Form.Item name="password" label="Password">
              <Input.Password />
            </Form.Item>

            <Form.Item name="dob" label="DOB">
              <DatePicker placeholder="hehe" className="w-full" />
            </Form.Item>
          </>

          {/* <Form.Item name="role" label="Role" required>
            <Select
              options={[
                { label: "User", value: "USER" },
                // { label: "Expert", value: "EXPERT" },
                { label: "Admin", value: "ADMIN" },
              ]}
            />
          </Form.Item> */}

          <Button type="primary" htmlType="submit" className="w-full">
            {selectedItem ? "Update" : "Create"}
          </Button>
        </Form>
      </Drawer>

      <Drawer
        open={openInfoDrawer}
        onClose={() => {
          setOpenInfoDrawer(false);
          setSelectedItem(undefined);
        }}
        width={700}
      >
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
              children: medical?.medicalCondition?.name,
            },
            {
              span: 2,
              label: "Description",
              children: medical?.medicalCondition?.description,
            },
            {
              label: "Low",
              children: medical?.medicalCondition?.low,
            },
            {
              label: "High",
              children: medical?.medicalCondition?.high,
            },
            {
              label: "Avoid",
              children: medical?.medicalCondition?.avoid,
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

        <Line
          data={bmiRecords}
          yField="bmi"
          xField={(record: { date: string }) => dayjs(record.date).format("DD-MM-YYYY")}
        />

        <Table
          columns={[
            {
              title: "Weight",
              dataIndex: "weight",
            },
            {
              title: "Height",
              render: () => selectedItem?.height,
            },
            {
              title: "BMI",
              dataIndex: "bmi",
            },
            {
              title: "Date",
              dataIndex: "date",
              render: (date) => dayjs(date).format("DD-MM-YYYY"),
            },
          ]}
          dataSource={bmiRecords}
        />
      </Drawer>
    </>
  );
}
