import { useApiLogin } from "@/api/hooks/useLogin";
import { useUserStore } from "@/stores/user.store";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { LoginForm, ProFormText } from "@ant-design/pro-components";
import { App, Button, Form, Tabs } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";
import bg from "../../assets/bg.jpeg";

export default function LoginPage() {
  const [_user, setUser] = useUserStore();

  const navigate = useNavigate();
  const [_token, setToken] = useLocalStorage<string | null>("token", null);

  const [form] = Form.useForm();
  const { message } = App.useApp();

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
    <div
      style={{ backgroundImage: `url(${bg})` }}
      className="bg-cover min-h-screen flex justify-center items-center"
    >
      <div className="w-max bg-white rounded-lg overflow-hidden">
        <LoginForm
          form={form}
          title={<div className="pb-8 text-2xl">NutriTrack Admin</div>}
          submitter={{
            render: () => (
              <Button className="w-full" type="primary" onClick={handleSubmit}>
                Login
              </Button>
            ),
          }}
        >
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

          <div className="mb-4 text-right">
            <Button type="link" className="p-0">
              <Link to={"/forgot-password"}>Forgot Password?</Link>
            </Button>
          </div>
        </LoginForm>
      </div>
    </div>
  );
}
