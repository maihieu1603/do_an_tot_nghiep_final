import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

function MenuSiderStudent(props) {
  const isStudyPlan = props.isStudyPlan;
  const location = useLocation();
  const items = [
    {
      label: <Link to="/student/study_plan">Study Plan</Link>,
      key: "/student/study_plan",
    },
    {
      label: (
        <Link
          to="/student/my_courses"
          style={{ color: isStudyPlan && "white" }}
        >
          My Courses
        </Link>
      ),
      key: "/student/my_courses",
    },
    {
      label: (
        <Link to="/student/profile" style={{ color: isStudyPlan && "white" }}>
          Profile
        </Link>
      ),
      key: "/student/profile",
    },
  ];
  return (
    <>
      <Menu
        mode="vertical"
        items={items}
        style={{ backgroundColor: isStudyPlan ? "#007bff" : "white" }}
        selectedKeys={[location.pathname]}
      />
    </>
  );
}
export default MenuSiderStudent;
