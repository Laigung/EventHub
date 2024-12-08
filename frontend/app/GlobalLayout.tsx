import { HomeOutlined, PlusOutlined } from "@ant-design/icons";
import { ConfigProvider, Layout, Menu, MenuProps } from "antd";
import { useState } from "react";
import { Link } from "react-router";

const { Header, Content } = Layout;

export default function GlobalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedMenuKey, setSelectedMenuKey] = useState<string>("homeLink");

  const menuItems: MenuProps["items"] = [
    {
      key: "homeLink",
      icon: (
        <Link to="/">
          <HomeOutlined />
        </Link>
      ),
      label: "Home",
    },
    {
      key: "createLink",
      icon: (
        <Link to="/create">
          <PlusOutlined />
        </Link>
      ),
      label: "Create Event",
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            darkItemSelectedBg: "#005d8d",
            activeBarHeight: 5,
          },
        },
      }}
    >
      <Layout className="w-full h-full">
        <Header className="sticky top-0 z-10 w-full flex items-center">
          <Link
            to="/"
            className="mr-5"
            onClick={() => setSelectedMenuKey("homeLink")}
          >
            <h1 className="text-3xl text-white">Event Ticketing Platform</h1>
          </Link>
          <Menu
            theme="dark"
            mode="horizontal"
            items={menuItems}
            style={{ flex: 1, minWidth: 0 }}
            selectedKeys={[selectedMenuKey]}
            onClick={(e) => setSelectedMenuKey(e.key)}
          />
        </Header>
        <Content className="py-2 bg-sol-pale">
          <div className="p-6 min-h-96">{children}</div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}
