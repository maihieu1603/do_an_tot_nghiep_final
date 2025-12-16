import { Layout } from "antd";
import "./layout.scss";
import { Outlet } from "react-router-dom";
import MenuSiderTeacher from "../components/MenuSiderTeacher";
import HeaderCommon from "../components/Header";
import { useState } from "react";
const { Header, Content, Sider } = Layout;
function LayoutAdmin() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Header className="header">
          <HeaderCommon toggleSidebar={toggleSidebar} />
        </Header>
        <div style={{ display: "flex", flex: 1, marginTop: "60px" }}>
          <Layout>
            <Sider
              className="sider"
              collapsible
              collapsed={collapsed}
              trigger={null}
              collapsedWidth={0}
            >
              <MenuSiderTeacher />
            </Sider>
            <Content className="layout__content" style={collapsed ? {marginLeft:0} : {marginLeft:"195px"}}>
              <Outlet />
            </Content>
          </Layout>
        </div>
      </Layout>
    </>
  );
}
export default LayoutAdmin;
