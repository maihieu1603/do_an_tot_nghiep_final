import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

function MenuSiderHome() {
  const location = useLocation();

  const handleGoExam = () => {
    const token = localStorage.getItem("accessToken");

    window.location.href = "http://localhost:5173";
  };
  const items = [
    {
      key: "/home/main",
      label: <Link to="/home/main">Trang chủ</Link>,
    },
    {
      key: "",
      label: <span onClick={handleGoExam}>Luyện đề</span>,
    },
    {
      key: "/home/tratu",
      label: <Link to="/home/tratu">Tra từ</Link>,
    },
    {
      key: "/home/vocal",
      label: <Link to="/home/vocal">Ôn tập từ vựng</Link>,
    },
  ];

  return (
    <>
      <Menu
        mode="horizontal"
        items={items}
        disabledOverflow
        selectedKeys={[location.pathname]}
      />
    </>
  );
}
export default MenuSiderHome;
