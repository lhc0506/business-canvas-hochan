import { Layout, Typography, ConfigProvider } from 'antd'
import './App.css'
import MemberTable from './components/MemberTable'

function App() {
  const { Header, Content, Footer } = Layout;
  
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <Layout className="layout">
        <Header style={{ display: 'flex', alignItems: 'center' }}>
          <Typography.Title level={4} style={{ color: 'white', margin: 0 }}>
            회원 관리 시스템
          </Typography.Title>
        </Header>
        <Content style={{ padding: '0 50px', marginTop: 20 }}>
          <div className="site-layout-content" style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            <Typography.Title level={2}>회원 관리 테이블</Typography.Title>
            <p>회원 정보를 관리할 수 있는 테이블 애플리케이션입니다.</p>
            <MemberTable />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          회원 관리 시스템 ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </ConfigProvider>
  )
}

export default App
