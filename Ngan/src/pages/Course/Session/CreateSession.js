import { Button, Col, Form, Input, notification, Row, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState, useRef } from "react";
import { Player } from "video-react";
import "video-react/dist/video-react.css";
import "./CreateSession.scss";
import { openNotification } from "../../../components/Notification";
import { Progress } from "antd";
import { API_DOMAIN } from "../../../utils/request";
import {
  createLessionOfModule,
  getLessonAdminTeacher,
  updateLessionOfModule,
} from "../../../services/CourseService";
import { refreshToken, saveToken } from "../../../services/AuthService";

function CreateSession({ ac, orderIndex, lessonId, handleCancel, moduleId }) {
  const [form] = Form.useForm();

  const [videoFile, setVideoFile] = useState([]);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoPath1, setVideoPath1] = useState(null);
  const [docFile, setDocFile] = useState([]);
  const [docUrl, setDocUrl] = useState(null);
  const [duration, setDuration] = useState(0);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [uploadMessage, setUploadMessage] = useState("");

  const uploadIdRef = useRef(null);
  const workerRef = useRef(null);

  // IMPORTANT: giữ state ở ngoài component để không mất khi modal đóng
  const pendingSubmitRef = useRef(false);
  const lessonDataRef = useRef(null);

  const [api, contextHolder] = notification.useNotification();

  // Tạo FormData gửi lên backend
  const buildFormData = (sessionData) => {
    const formData = new FormData();

    var lesson = {
      moduleId,
      orderIndex: sessionData.orderIndex,
      title: sessionData.title,
      summary: sessionData.summary,
      gatingRules: sessionData.gatingRules,
      durationMinutes: sessionData.durationMinutes || durationUpdate,
    };

    if (ac === "Update") lesson = { ...lesson, id: lessonId };
    console.log("lesson:");
    console.log(lesson);

    formData.append("lesson", JSON.stringify(lesson));

    if(sessionData.videoPath1){
      console.log("Video: " + sessionData.videoPath1);
      formData.append("videoPath", sessionData.videoPath1);
    }

    if (sessionData.materials !== null) {
      formData.append("materials", sessionData.materials);
    }

    return formData;
  };

  // Gọi API tạo bài giảng
  const createSession = async (sessionData) => {
    try {
      const formData = buildFormData(sessionData);
      const response = await createLessionOfModule(formData);

      if (response.code === 200) {
        openNotification(
          api,
          "bottomRight",
          "Thành công",
          "Tạo bài giảng thành công!"
        );
        setTimeout(() => handleCancel(), 1500);
      } else if (response.code === 401) {
        const refresh = await refreshToken();
        if (refresh.code === 200) {
          saveToken(refresh.data.token, refresh.data.refreshToken);
        }
      } else {
        setLoading(false);
        openNotification(
          api,
          "bottomRight",
          "Lỗi",
          response.message || "Tạo bài giảng thất bại"
        );
      }
    } catch (error) {
      console.error(error);
      openNotification(
        api,
        "bottomRight",
        "Lỗi",
        "Có lỗi xảy ra khi tạo bài giảng"
      );
    }
  };

  const updateSession = async (sessionData) => {
    try {
      const formData = buildFormData(sessionData);
      const response = await updateLessionOfModule(formData);

      if (response.code === 200) {
        openNotification(
          api,
          "bottomRight",
          "Thành công",
          "Sửa bài giảng thành công!"
        );
        setTimeout(() => handleCancel(), 2000);
      } else if (response.code === 401) {
        const refresh = await refreshToken();
        if (refresh.code === 200) {
          saveToken(refresh.data.token, refresh.data.refreshToken);
        }
      } else {
        setLoading(false);
        openNotification(
          api,
          "bottomRight",
          "Lỗi",
          response.message || "Sửa bài giảng thất bại"
        );
      }
    } catch (error) {
      console.error(error);
      openNotification(
        api,
        "bottomRight",
        "Lỗi",
        "Có lỗi xảy ra khi sửa bài giảng"
      );
    }
  };

  // Khởi tạo worker CHỈ 1 LẦN duy nhất
  useEffect(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker("/videoUploadWorker.js");
    }

    workerRef.current.onmessage = (e) => {
      const { type, progress, message, videoPath } = e.data;

      if (type === "progress") {
        setUploadStatus("uploading");
        setUploadProgress(progress);
      }

      if (type === "done") {
        setUploadStatus("done");
        setUploadMessage("Upload video hoàn tất");
        setVideoPath1(videoPath);
        console.log(videoPath);

        openNotification(
          api,
          "bottomRight",
          "Thành công",
          "Upload video hoàn tất"
        );

        // Nếu user đã nhấn nút submit trước đó và modal đã đóng
        if (pendingSubmitRef.current && lessonDataRef.current && videoPath) {
          if (ac === "Create")
            createSession({
              ...lessonDataRef.current,
              videoPath1: videoPath,
            });
          else
            updateSession({
              ...lessonDataRef.current,
              videoPath1: videoPath,
            });

          // Reset state
          pendingSubmitRef.current = false;
          lessonDataRef.current = null;
        }
      }

      if (type === "error") {
        setUploadStatus("error");
        setUploadMessage(message || "Có lỗi khi upload video");
        openNotification(
          api,
          "bottomRight",
          "Thất bại",
          "Upload video thất bại"
        );
      }
    };

    return () => {}; // ❗Không terminate worker
  }, []);

  const generateFileId = (file) => `${Date.now()}-${file.name}`;

  // Lấy thời lượng video
  const handleVideoDuration = (file) => {
    const url = URL.createObjectURL(file);
    const tempVideo = document.createElement("video");
    tempVideo.src = url;
    tempVideo.onloadedmetadata = () => {
      setDuration(tempVideo.duration);
      URL.revokeObjectURL(url);
    };
  };

  const [videoPathUpdate,setVideoPathUpdate]= useState(null);
  const [durationUpdate, setDurationUpdate] = useState(0);
  const fetchApiGetLesson = async () => {
    const response = await getLessonAdminTeacher(lessonId);
    console.log(response);
    if (response.code === 200) {
      const data = response.data;
      setVideoPathUpdate(data.videoPath);
      setDurationUpdate(data.durationMinutes);
      form.setFieldsValue({
        orderIndex: data.orderIndex,
        title: data.title,
        summary: data.summary,
        gatingRules: data.gatingRules,
      });
    } else if (response.code === 401) {
      const refresh = await refreshToken();
      if (refresh.code === 200) {
        saveToken(refresh.data.token, refresh.data.refreshToken);
      }
    }
  };

  // Reset khi mở modal create
  useEffect(() => {
    setLoading(false);
    setVideoFile([]);
    setVideoUrl(null);
    setDocFile([]);
    setDocUrl(null);
    setVideoPath1(null);
    setUploadProgress(0);
    setUploadStatus("idle");
    setUploadMessage("");
    setVideoPathUpdate(null);
    setDurationUpdate(0);
    if (ac === "Update") {
      form.resetFields();
      fetchApiGetLesson();
      console.log(lessonId);
    } else if (ac === "Create") {
      form.resetFields();
      form.setFieldsValue({ orderIndex });
    }
  }, [ac, lessonId]);

  const propsVideo = {
    onRemove: () => {
      setVideoFile([]);
      setVideoUrl(null);
      setDuration(0);
      setUploadProgress(0);
      setUploadStatus("idle");
      setUploadMessage("");
      setVideoPath1(null);
    },

    beforeUpload: (file) => {
      if (videoFile.length >= 1) {
        openNotification(
          api,
          "bottomRight",
          "Lỗi",
          "Chỉ được upload 1 video duy nhất"
        );
        return Upload.LIST_IGNORE;
      }
      if (file.type !== "video/mp4") {
        openNotification(api, "bottomRight", "Lỗi", "Chỉ chấp nhận file .mp4");
        return Upload.LIST_IGNORE;
      }

      const url = URL.createObjectURL(file);
      setVideoFile([file]);
      setVideoUrl(url);
      handleVideoDuration(file);

      const fileId = generateFileId(file);
      uploadIdRef.current = fileId;

      setUploadProgress(0);
      setUploadStatus("uploading");
      setUploadMessage("Đang upload video...");

      workerRef.current.postMessage({
        file,
        fileId,
        fileName: file.name,
        chunkSize: 5 * 1024 * 1024,
        uploadUrl: `${API_DOMAIN}chunk`,
        completeUrl: `${API_DOMAIN}chunk/merge`,
      });

      return false;
    },

    fileList: videoFile,
    accept: ".mp4",
  };

  const propsDoc = {
    onRemove: () => {
      setDocFile([]);
      setDocUrl(null);
    },

    beforeUpload: (file) => {
      if (file.name.split(".").pop().toLowerCase() !== "pdf") {
        openNotification(api, "bottomRight", "Lỗi", "Chỉ chấp nhận PDF");
        return Upload.LIST_IGNORE;
      }

      const url = URL.createObjectURL(file);
      setDocFile([file]);
      setDocUrl(url);

      return false;
    },

    fileList: docFile,
    accept: ".pdf",
  };

  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();

      var data = {
        ...values,
        videoPath1,
        materials: docFile[0] || null,
        durationMinutes: duration,
      };

      if(videoPathUpdate && videoFile.length === 0){
        updateSession(data);
      }

      // Lưu lại để xử lý sau (dù modal đóng)
      lessonDataRef.current = data;

      // Nếu chưa có videoPath → upload chưa xong → chờ
      if (!videoPath1) {
        pendingSubmitRef.current = true;
        setTimeout(()=>handleCancel(),1500); // đóng modal nhưng upload vẫn chạy
        return;
      }

      // Video đã upload xong → tạo luôn
      if (ac === "Create") createSession(data);
      else updateSession(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {contextHolder}

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item label="🎬 Video (.mp4)">
              <Upload {...propsVideo} disabled={loading}>
                <Button icon={<UploadOutlined />} disabled={loading}>
                  Chọn video
                </Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="📄 Tài liệu (PDF)">
              <Upload {...propsDoc} disabled={loading}>
                <Button icon={<UploadOutlined />} disabled={loading}>
                  Chọn tài liệu
                </Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="orderIndex"
              label="STT"
              rules={[{ required: true, message: "Không được để trống" }]}
            >
              <Input
                type="number"
                placeholder="Nhập STT bài học"
                disabled={loading}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="title"
              label="Tiêu đề"
              rules={[{ required: true, message: "Không được để trống" }]}
            >
              <Input placeholder="Nhập tiêu đề bài học" disabled={loading} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="summary"
              label="Tóm tắt"
              rules={[{ required: true, message: "Không được để trống" }]}
            >
              <Input placeholder="Nhập tóm tắt bài học" disabled={loading} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="gatingRules"
              label="Thời gian học video tối thiểu (%)"
              rules={[
                { required: true, message: "Không được để trống" },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    if (isNaN(value))
                      return Promise.reject("Giá trị phải là số");
                    if (value < 0 || value > 100)
                      return Promise.reject(
                        `Giá trị phải nằm trong khoảng từ 0 đến 100`
                      );
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                type="number"
                placeholder="Nhập tỉ lệ phần trăm video cần phải học"
                disabled={loading}
              />
            </Form.Item>
          </Col>
          {ac === "Create" && (
            <Col span={24}>
              <h3>Preview bài giảng</h3>

              {videoUrl && (
                <div style={{ marginTop: 10 }}>
                  <h4>Video:</h4>
                  <Player
                    src={videoUrl}
                    fluid={false}
                    width="100%"
                    height={400}
                  />
                </div>
              )}

              {/* {uploadStatus === "uploading" && (
              <div style={{ marginTop: 10 }}>
                <p>{uploadMessage}</p>
                <Progress percent={uploadProgress} status="active" />
              </div>
            )}

            {uploadStatus === "done" && (
              <p style={{ color: "green", marginTop: 10 }}>{uploadMessage}</p>
            )}

            {uploadStatus === "error" && (
              <p style={{ color: "red", marginTop: 10 }}>{uploadMessage}</p>
            )} */}

              {docUrl && (
                <div style={{ marginTop: 15 }}>
                  <h4>Tài liệu:</h4>
                  <iframe
                    src={docUrl}
                    width="100%"
                    height="600px"
                    style={{ border: "1px solid #ccc", borderRadius: 8 }}
                  />
                </div>
              )}
            </Col>
          )}
        </Row>
        <div className="form__teacher--button">
          <Form.Item>
            {ac === "Create" ? (
              <Button
                htmlType="submit"
                type="primary"
                style={{ marginTop: 16 }}
                disabled={loading}
                loading={loading}
              >
                Thêm bài giảng
              </Button>
            ) : (
              <Button
                htmlType="submit"
                type="primary"
                style={{ marginTop: 16 }}
                disabled={loading}
                loading={loading}
              >
                Sửa bài giảng
              </Button>
            )}
          </Form.Item>
        </div>
      </Form>
    </>
  );
}

export default CreateSession;
