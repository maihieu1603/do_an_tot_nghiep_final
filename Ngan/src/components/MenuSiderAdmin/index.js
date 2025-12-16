import { Menu } from "antd";
import {Link, useLocation} from "react-router-dom";

function MenuSiderAdmin(){
    const location = useLocation();
    const items  = [
        {
            label: <Link to="/admin/teachers">Quản lý giáo viên</Link>,
            key: "/admin/teachers"
        },
        {
            label: <Link to="/admin/students">Quản lý học viên</Link>,
            key: "/admin/students"
        },
        {
            label: <Link to="/admin/courses">Quản lý khóa học</Link>,
            key: "/admin/courses"
        },
        {
            label: <Link to="/admin/tests">Quản lý bài test</Link>,
            key: "/admin/tests"
        },
    ]
    return(
        <>
            <Menu mode="vertical" items={items} selectedKeys={[location.pathname]}/>
        </>
    )
}
export default MenuSiderAdmin;