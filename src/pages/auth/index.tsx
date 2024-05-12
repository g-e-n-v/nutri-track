import { useApiLogin } from "@/api/hooks/useLogin";
import { useUserStore } from "@/stores/user.store";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { LoginForm, ProFormText } from "@ant-design/pro-components";
import { App, Button, Form, Tabs } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

export default function LoginPage() {
  const [_user, setUser] = useUserStore();

  const navigate = useNavigate();
  const [_token, setToken] = useLocalStorage<string | null>("token", null);

  const [form] = Form.useForm();
  const { message } = App.useApp();

  const [page, setPage] = useState("login");

  const { mutateAsync: apiLogin } = useApiLogin();

  const handleSubmit = async () => {
    const values = form?.getFieldsValue() ?? {};
    const { tokens, user } = await apiLogin({
      body: { deviceToken: "token", deviceType: "ANDROID", ...values },
    });
    setUser(user);
    const accessToken = tokens.access.token;
    setToken(accessToken);

    message.success(`Welcome back ${user.name}!`);
    navigate("/");
  };

  return (
    <div>
      <LoginForm
        form={form}
        title="Diet Admin"
        subTitle="subtitle"
        submitter={{
          render: () => (
            <Button className="w-full" type="primary" onClick={handleSubmit}>
              Login
            </Button>
          ),
        }}
      >
        <Tabs
          centered
          activeKey={page}
          onChange={(activeKey) => setPage(activeKey)}
          items={[
            { key: "login", label: "Login" },
            { key: "register", label: "Register" },
          ]}
        />

        {page === "login" && (
          <>
            <ProFormText
              name="email"
              fieldProps={{
                size: "large",
                prefix: <UserOutlined className={"prefixIcon"} />,
              }}
              placeholder={"Email"}
              required
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined className={"prefixIcon"} />,
              }}
              placeholder={"Password"}
              required
            />
          </>
        )}

        {page === "register" && (
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: "large",
                prefix: <UserOutlined className={"prefixIcon"} />,
              }}
              placeholder={"Username"}
              required
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined className={"prefixIcon"} />,
              }}
              placeholder={"Password"}
              required
            />
          </>
        )}
        <div className="mb-4 text-right">
          <Button type="link" className="p-0">
            <Link to={"/forgot-password"}>Forgot Password?</Link>
          </Button>
        </div>
      </LoginForm>
    </div>
  );
}
