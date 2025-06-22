import { Layout, ConfigProvider, theme } from "antd";
import "./styles/variables.css";
import "./App.css";
import MemberTable from "./components/MemberTable";

function App() {
  const { Content } = Layout;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#4A7CFE",
          colorBorder: "#E3E3E3",
          controlHeight: 32,
        },
        components: {
          Button: {
            borderRadius: 8,
          },
          Dropdown: {
            borderRadius: 10,
          },
          Input: {
            borderRadius: 8,
            controlPaddingHorizontal: 12,
          },
          Select: {
            borderRadius: 8,
            controlPaddingHorizontal: 12,
          },
          DatePicker: {
            borderRadius: 8,
            controlHeight: 32,
            controlPaddingHorizontal: 12,
          },
          Form: {
            labelColor: "#00000073",
            labelFontSize: 14,
          },
          Modal: {
            borderRadius: 10,
            titleFontSize: 14,
          },
        },
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <Layout className="layout">
        <Content className="app-content">
          <div className="site-layout-content">
            <MemberTable />
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
