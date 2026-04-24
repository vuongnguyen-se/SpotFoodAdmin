import { Layout, Menu, Avatar, Typography, Button, Space } from "antd";
import {
  EnvironmentOutlined,
  AppstoreOutlined,
  TranslationOutlined,
  FileTextOutlined,
  SoundOutlined,
  MonitorOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const menuItems = [
  { key: "/pois", icon: <EnvironmentOutlined />, label: "POIs" },
  { key: "/categories", icon: <AppstoreOutlined />, label: "Categories" },
  { key: "/translations", icon: <TranslationOutlined />, label: "Translations" },
  { key: "/contents", icon: <FileTextOutlined />, label: "Contents" },
  { key: "/audios", icon: <SoundOutlined />, label: "Audios" },
  { key: "/monitoring", icon: <MonitorOutlined />, label: "Monitoring" },
];

function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#eef2f7" }}>
      <Sider
        width={240}
        theme="light"
        style={{
          borderRight: "1px solid #f0f0f0",
          background: "#fff",
        }}
      >
        <div style={{ padding: "24px 20px 16px" }}>
          <Title level={4} style={{ margin: 0, fontSize: 20 }}>
            Poi Admin
          </Title>
          <Text type="secondary">Management Panel</Text>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: "none" }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "0 24px",
          }}
        >
          <Space>
            <Avatar style={{ backgroundColor: "#1677ff" }}>VN</Avatar>
            <Button icon={<LogoutOutlined />} onClick={handleLogout}>
              Logout
            </Button>
          </Space>
        </Header>

        <Content style={{ padding: 24 }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 24,
              minHeight: "calc(100vh - 112px)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;