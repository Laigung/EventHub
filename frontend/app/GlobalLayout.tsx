import { Layout } from 'antd';

const { Header, Content } = Layout;

export default function GlobalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout className="w-full h-full">
      <Header className="sticky top-0 z-10 w-full flex items-center">
        <h1 className="text-3xl text-white">Event Ticketing Platform</h1>
      </Header>
      <Content className="py-2">
        <div className="p-6 min-h-96">{children}</div>
      </Content>
    </Layout>
  );
}
