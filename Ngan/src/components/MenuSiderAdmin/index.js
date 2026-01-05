import { Menu } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  FileTextOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

function MenuSiderAdmin({ collapsed }) {
  const location = useLocation();

  const handleGoExam = () => {
    const token = localStorage.getItem("accessToken");

    const examWindow = window.open("http://localhost:5173", "_blank");

    examWindow.onload = () => {
      examWindow.postMessage(
        {
          type: "SEND_TOKEN",
          accessToken: token,
        },
        "http://localhost:5173"
      );
    };
  };

  const items = [
    {
      key: "/admin/teachers",
      icon: <UserOutlined />,
      label: <Link to="/admin/teachers">Quản lý giáo viên</Link>,
    },
    {
      key: "/admin/students",
      icon: <TeamOutlined />,
      label: <Link to="/admin/students">Quản lý học viên</Link>,
    },
    {
      key: "/admin/courses",
      icon: <BookOutlined />,
      label: <Link to="/admin/courses">Quản lý khóa học</Link>,
    },
    {
      key: "/admin/tests",
      icon: <FileTextOutlined />,
      label: <Link to="/admin/tests">Quản lý bài test</Link>,
    },
    {
      key: "/admin/account",
      icon: <SettingOutlined />,
      label: <Link to="/admin/account">Thông tin tài khoản</Link>,
    },
    {
      icon: <BookOutlined />,
      label: <span onClick={handleGoExam}>Quản lý đề thi Toeic</span>,
    },
  ];

  return (
    <Menu
      mode="inline"
      inlineCollapsed={collapsed} // 🔥 CHỈ ICON KHI COLLAPSE
      items={items}
      selectedKeys={[location.pathname]}
    />
  );
}

export default MenuSiderAdmin;
