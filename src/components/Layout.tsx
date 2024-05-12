import { useUserStore } from "@/stores/user.store";
import {
  DashboardOutlined,
  FileTextOutlined,
  LogoutOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { PageContainer, ProCard, ProLayout } from "@ant-design/pro-components";
import { Dropdown } from "antd";
import { PropsWithChildren } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const routeProps = {
  route: {
    path: "/",
    routes: [
      {
        path: "/",
        name: "Dashboard",
        icon: <DashboardOutlined />,
      },
      {
        path: "/applications",
        name: "Applications",
        icon: <FileTextOutlined />,
      },
      {
        path: "/users",
        name: "Users",
        icon: <UsergroupAddOutlined />,
      },
    ],
  },
  location: { pathname: "/" },
};

export function Layout({ children }: PropsWithChildren) {
  const [user] = useUserStore();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="h-screen overflow-auto">
      <ProLayout
        {...routeProps}
        location={{ pathname }}
        menu={{
          collapsedShowGroupTitle: true,
        }}
        avatarProps={{
          src: user?.avatar,
          size: "small",
          title: user?.name ?? "user",
          render: (_props, dom) => {
            return (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "logout",
                      icon: <LogoutOutlined />,
                      label: "Logout",
                    },
                  ],
                }}
              >
                {dom}
              </Dropdown>
            );
          },
        }}
        menuItemRender={(item, dom) => (
          <div onClick={() => item.path && navigate(item.path)}>{dom}</div>
        )}
        layout="mix"
        splitMenus={false}
      >
        <PageContainer
        // footer={[
        //   <Button key="3">Cancel</Button>,
        //   <Button key="2" type="primary">
        //     Continue
        //   </Button>,
        // ]}
        >
          <ProCard>{children}</ProCard>
        </PageContainer>
      </ProLayout>
    </div>
  );
}
