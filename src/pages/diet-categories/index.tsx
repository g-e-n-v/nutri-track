import { useCreateDietCategory } from "@/api/hooks/useCreateDietCategory";
import { useDeleteDietCategory } from "@/api/hooks/useDeleteDietCategory";
import { useGetDietCategories } from "@/api/hooks/useGetDietCategories";
import { useUpdateDietCategory } from "@/api/hooks/useUpdateDietCategory";
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { App, Button, Drawer, Form, Input, Popconfirm, Select, Table, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { useState } from "react";

const LOW_HIGH_OPTIONS = [
  { value: "Protein" },
  { value: "Total lipid (fat)" },
  { value: "Fiber, total dietary" },
  { value: "Carbohydrate by difference" },
  { value: "Sugars" },
];

export default function DietCategoriesPage() {
  const { message } = App.useApp();

  const { data, isLoading, refetch } = useGetDietCategories({
    queryProps: {
      queryParams: {
        limit: 10_000,
        page: 1,
      },
    },
  });

  const [selectedItem, setSelectedItem] = useState<NonNullable<typeof data>["results"][number]>();
  const [openUpsertDrawer, setOpenUpsertDrawer] = useState(false);
  const [form] = Form.useForm();

  const { mutateAsync: createDietCate } = useCreateDietCategory({
    onSuccess: () => {
      message.success("Create successfully!");
      refetch();
      setOpenUpsertDrawer(false);
      form.resetFields();
    },
    onError: (error) => {
      message.error((error as any)?.response?.data?.message);
    },
  });

  const { mutateAsync: updateDietCate } = useUpdateDietCategory({
    onSuccess: () => {
      message.success("Update successfully!");
      refetch();
      setOpenUpsertDrawer(false);
    },
    onError: (error) => {
      message.error((error as any)?.response?.data?.message);
    },
  });

  const { mutateAsync: deleteDietCate } = useDeleteDietCategory({
    onSuccess: () => {
      message.success("Delete successfully!");
      refetch();
    },
    onError: (error) => {
      message.error((error as any)?.response?.data?.message);
    },
  });

  return (
    <>
      <Button
        className="mb-6"
        type="primary"
        icon={<PlusCircleOutlined />}
        onClick={() => {
          setOpenUpsertDrawer(true);
        }}
      >
        Create
      </Button>

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
              <div className="flex gap-2">
                <Tooltip title="Edit">
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setOpenUpsertDrawer(true);
                      setSelectedItem(record);
                      form.setFieldsValue(record);
                    }}
                  />
                </Tooltip>
                <Popconfirm
                  title="Are you sure to delete this item?"
                  onConfirm={() => {
                    deleteDietCate({ pathParams: { id: record.id } });
                  }}
                >
                  <Tooltip title="Delete">
                    <Button danger type="primary" icon={<DeleteOutlined />} />
                  </Tooltip>
                </Popconfirm>
              </div>
            ),
          },
        ]}
        pagination={{
          pageSize: 10,
          total: data?.totalResults,
        }}
        rowKey={(row) => row.id}
      />

      <Drawer
        open={openUpsertDrawer}
        onClose={() => {
          setOpenUpsertDrawer(false);
          form.resetFields();
        }}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            if (selectedItem) {
              updateDietCate({ body: values, pathParams: { id: selectedItem.id } });
            } else {
              createDietCate({ body: values });
            }
          }}
        >
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>

          <Form.Item name="low" label="Low">
            <Select mode="multiple" options={LOW_HIGH_OPTIONS} />
          </Form.Item>

          <Form.Item name="high" label="High">
            <Select mode="multiple" options={LOW_HIGH_OPTIONS} />
          </Form.Item>

          <Button htmlType="submit" type="primary" className="w-full">
            {selectedItem ? "Update" : "Create"}
          </Button>
        </Form>
      </Drawer>
    </>
  );
}
