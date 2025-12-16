import { useLocation, useNavigate } from "react-router-dom";
import DetailSession from "../../Course/Session/DetailSession";
import { Breadcrumb, Button, notification } from "antd";
import { useEffect, useRef, useState } from "react";
import {
  getLessonIdNext,
  getLessonIdPrevious,
  getLessonPath,
  saveProcessLesson,
} from "../../../services/CourseService";
import { refreshToken, saveToken } from "../../../services/AuthService";
import { openNotification } from "../../../components/Notification";
import { logout } from "../../../components/function";
import { getId } from "../../../components/token";

function SessionDetail() {
  const location = useLocation();
  const courseId = location.state.courseId || null;
  const [lessonId, setLessonId] = useState(location.state.lessonId);
  const navigate = useNavigate();

  const handleClick = (lesson) => {
    if (lesson.type === "LESSON") {
      setLessonId(lesson.id);
    } else if (lesson.type === "TEST") {
      navigate("/study/mini-test", {
        state: { testId: lesson.id, courseId: courseId },
      });
    }
  };

  const [api, context] = notification.useNotification();
  const [course, setCourse] = useState("");
  const [category, setCategory] = useState("");
  const [lesson, setLesson] = useState("");
  const [id, setId] = useState("");

  const fetchApiGetPath = async () => {
    const response = await getLessonPath(lessonId);

    if (response.code === 200) {
      const [c, cat, les, i] = response.data.split("/");
      setCourse(c);
      setCategory(cat);
      setLesson(les);
      setId(parseInt(i));
    } else if (response.code === 401) {
      const refresh = await refreshToken();
      if (refresh.code === 200) {
        saveToken(refresh.data.token, refresh.data.refreshToken);
        const retryResponse = await getLessonPath(lessonId);
        if (retryResponse.code === 200) {
          const [c, cat, les, i] = retryResponse.data.split("/");
          setCourse(c);
          setCategory(cat);
          setLesson(les);
          setId(parseInt(i));
        } else {
          openNotification(api, "bottomRight", "Lỗi", retryResponse.message);
        }
      } else {
        openNotification(
          api,
          "bottomRight",
          "Cảnh báo",
          "Phiên đăng nhập của bạn đã hết hạn"
        );
        setTimeout(() => {
          logout();
        }, 1000);
      }
    }
  };

  const [previousId, setPreviousId] = useState();
  const fetchPreviousLesson = async () => {
    const response = await getLessonIdPrevious(lessonId, "LESSON");
    console.log(response.data);
    if (response.code === 200) {
      setPreviousId(response.data);
    } else if (response.code === 401) {
      const refresh = await refreshToken();
      if (refresh.code === 200) {
        saveToken(refresh.data.token, refresh.data.refreshToken);
        const retryResponse = await getLessonIdPrevious(lessonId, "LESSON");
        if (retryResponse.code === 200) {
          setPreviousId(retryResponse.data);
        } else {
          openNotification(api, "bottomRight", "Lỗi", retryResponse.message);
        }
      } else {
        openNotification(
          api,
          "bottomRight",
          "Cảnh báo",
          "Phiên đăng nhập của bạn đã hết hạn"
        );
        setTimeout(() => {
          logout();
        }, 1000);
      }
    }
  };

  const [nextId, setNextId] = useState();
  const fetchNextLesson = async () => {
    const response = await getLessonIdNext(lessonId, "LESSON");
    console.log(response.data);
    if (response.code === 200) {
      setNextId(response.data);
    } else if (response.code === 401) {
      const refresh = await refreshToken();
      if (refresh.code === 200) {
        saveToken(refresh.data.token, refresh.data.refreshToken);
        const retryResponse = await getLessonIdNext(lessonId, "LESSON");
        if (retryResponse.code === 200) {
          setNextId(retryResponse.data);
        } else {
          openNotification(api, "bottomRight", "Lỗi", retryResponse.message);
        }
      } else {
        openNotification(
          api,
          "bottomRight",
          "Cảnh báo",
          "Phiên đăng nhập của bạn đã hết hạn"
        );
        setTimeout(() => {
          logout();
        }, 1000);
      }
    }
  };

  useEffect(() => {
    fetchApiGetPath();
    fetchNextLesson();
    fetchPreviousLesson();
  }, [lessonId]);

  const items =
    courseId !== null
      ? [
          {
            title: (
              <Button
                type="link"
                onClick={() => navigate("/student/my_courses")}
              >
                Khóa học của tôi
              </Button>
            ),
          },
          {
            title: (
              <Button
                type="link"
                onClick={() =>
                  navigate("/student/course-detail", {
                    state: { id: courseId },
                  })
                }
              >
                {category}
              </Button>
            ),
          },
          {
            title: <Button type="text">{lesson}</Button>,
          },
        ]
      : [
          {
            title: (
              <Button
                type="link"
                onClick={() => navigate("/student/my_courses")}
              >
                Khóa học của tôi
              </Button>
            ),
          },
          {
            title: <Button type="text">{lesson}</Button>,
          },
        ];
  const [percent, setPercent] = useState(0);
  const percentRef = useRef(0);

  useEffect(() => {
    percentRef.current = percent;
  }, [percent]);

  const saveProgress = () => {
    var data = {
      lessonId,
      studentProfileId: getId(),
      percentageWatched: parseInt(percentRef.current),
    };
    console.log(data);
    const response = saveProcessLesson(data);
    console.log(response);
  };
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveProgress();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      saveProgress();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <>
      {context}
      <div
        className="flex"
        style={{
          position: "fixed",
          top: "64px",
          left: 0,
          zIndex: 99,
          width: "100%",
          height: "50px",
          borderBottom: "1px solid #ddd",
          padding: "0 20px",
          backgroundColor: "white",
        }}
      >
        <div>
          <Breadcrumb items={items} />
        </div>
        <div className="flex1">
          {previousId && (
            <Button type="primary" onClick={() => handleClick(previousId)}>
              Bài trước
            </Button>
          )}
          {nextId && (
            <Button type="primary" onClick={() => handleClick(nextId)}>
              Bài sau
            </Button>
          )}
        </div>
      </div>
      <div style={{ marginTop: "60px" }}>
        <DetailSession lessonId={lessonId} setPercent={setPercent} />
      </div>
    </>
  );
}
export default SessionDetail;
