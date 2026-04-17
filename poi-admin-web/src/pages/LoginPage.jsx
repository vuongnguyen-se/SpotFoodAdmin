import { Button, Card, Form, Input, Typography, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      // Tạm thời mock login trước
      if (values.username === "admin" && values.password === "123456") {
        localStorage.setItem("token", "fake-admin-token");
        localStorage.setItem("isAuthenticated", "true");
        message.success("Đăng nhập thành công");
        navigate("/pois");
        return;
      }

      message.error("Sai tài khoản hoặc mật khẩu");
    } catch (error) {
      console.error(error);
      message.error("Đăng nhập thất bại");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#eef2f7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <Card
        style={{
          width: 420,
          borderRadius: 16,
          boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <Title level={2} style={{ marginBottom: 8 }}>
            Admin Login
          </Title>
          <Text type="secondary">
            Đăng nhập để truy cập hệ thống quản trị
          </Text>
        </div>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập username" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập password" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter password"
              size="large"
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" block size="large">
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default LoginPage;