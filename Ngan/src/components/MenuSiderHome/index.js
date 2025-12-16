import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

function MenuSiderHome() {
    const location = useLocation();
  const items = [
    {
      key: "/home/main",
      label: <Link to="/home/main">Trang chủ</Link>,
    },
    {
      key: "/home/exam",
      label: <Link to="/home/exam">Luyện đề</Link>,
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
      <Menu mode="horizontal" items={items} disabledOverflow selectedKeys={[location.pathname]}/>
    </>
  );
}
export default MenuSiderHome;
