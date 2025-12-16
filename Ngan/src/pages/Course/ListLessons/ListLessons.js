import ListItemStudent from "./ListItemStudent";
import ListItemTeacher from "./ListItemTeacher";
import "./ListLesson.scss";
import MiniTestStudent from "./MiniTestStudent";
import MiniTestTeacher from "./MiniTestTeacher";
function ListLessons(props) {
  const role = props.role;
  const modules = props.modules;
  const courseId=props.id;
  const status = props.status;
  return (
    <>
      <div className="list__header">
        <div className="list__header--title">Danh sách bài học</div>
        <div className="list__header--quantity">{modules?.length} bài học</div>
      </div>
      <div className="list__body">
        {role === "Teacher" ? (
          <>
            {modules?.length === 0 ? (
              <h3>Không có bài học nào</h3>
            ) : (
              <>
                {modules?.map((module) => (
                  <>
                    {module.type === "LESSON" ? <ListItemTeacher module={module} onReload={props.onReload} status={status}/> : <MiniTestTeacher module={module} onReload={props.onReload} status={status}/>}
                  </>
                ))}
              </>
            )}
          </>
        ) : (
          <>
            {modules?.length === 0 ? (
              <h3>Không có bài học nào</h3>
            ) : (
              <>
                {modules?.map((module, index) => (
                  <>
                    {module.type === "LESSON" ? <ListItemStudent module={module} index={index} courseId={courseId}/> : <MiniTestStudent module={module} index={index} courseId={courseId}/>}
                  </>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
export default ListLessons;
