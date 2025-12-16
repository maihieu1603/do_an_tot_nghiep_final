import { TrophyFilled } from "@ant-design/icons";
import "./MyCourses.scss";
import ListCoursesStudent from "./ListCoursesStudent";

function MyCoursesStudent() {
  return (
    <>
      <div className="mycourse__header">
        <div className="mycourse__header--left">Khóa học của tôi</div>
        <div className="mycourse__header--right">
          Tổng số cúp đạt được{" "}
          <span
            style={{ color: "orange", fontSize: "16px", fontWeight: "700" }}
          >
            172/291
          </span>
          <TrophyFilled style={{ marginLeft: "8px", color: "orange" }} />
        </div>
      </div>

      <ListCoursesStudent type="Main"/>
    </>
  );
}
export default MyCoursesStudent;
