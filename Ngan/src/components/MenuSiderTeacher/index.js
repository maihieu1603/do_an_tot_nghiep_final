import { Menu } from "antd";
import {Link, useLocation} from "react-router-dom";

function MenuSiderTeacher(){
    const location = useLocation();
    const items  = [
        {
            label: <Link to="/teacher/courses">Quản lý khóa học</Link>,
            key: "/teacher/courses"
        },
    ]
    return(
        <>
            <Menu mode="vertical" items={items} selectedKeys={[location.pathname]}/>
        </>
    )
}
export default MenuSiderTeacher;