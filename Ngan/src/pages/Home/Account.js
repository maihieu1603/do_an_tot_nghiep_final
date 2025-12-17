import { Button, Col, DatePicker, Form, Input, Row, Tabs } from "antd";
import { useState } from "react";

function Account() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [loadingPass, setLoadingPass] = useState(false);
  const updateAccount = () => {
    const value = form.getFieldsValue();
  };

  const cancel = () => {
    setLoading(true);
    form.setFieldsValue();
  };

  const getInfo = async() => {
    
  }

  const items = [
    {
      key: "1",
      label: "Tài khoản",
      children: (
        <div style={{ padding: "0 80px" }}>
          <Form form={form} layout="vertical">
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  name="name"
                  label="Họ tên"
                  rules={[{ required: true, message: "Không được để trống" }]}
                >
                  <Input disabled={loading} size="large" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, message: "Không được để trống" }]}
                >
                  <Input disabled={true} size="large" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="birthday"
                  label="Ngày sinh"
                  rules={[{ required: true, message: "Không được để trống" }]}
                >
                  <DatePicker
                    disabled={loading}
                    size="large"
                    style={{ width: "100%" }}
                    format={{
                      format: "YYYY-MM-DD",
                      type: "mask",
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: "Không được để trống" },
                    {
                      pattern: /^[0-9]{10}$/,
                      message:
                        "Phải nhập đủ 10 số, không có chữ hoặc ký tự đặc biệt",
                    },
                  ]}
                >
                  <Input maxLength={10} disabled={loading} size="large" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="address"
                  label="Địa chỉ"
                  rules={[{ required: true, message: "Không được để trống" }]}
                >
                  <Input disabled={loading} size="large" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div style={{ justifySelf: "center" }}>
            {loading ? (
              <Button type="primary" onClick={() => setLoading(false)}>
                Sửa thông tin
              </Button>
            ) : (
              <div className="flex1">
                <Button onClick={() => cancel()}>Hủy</Button>
                <Button type="primary" onClick={() => updateAccount()}>
                  Lưu thông tin
                </Button>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Thay đổi mật khẩu",
      children: (
        <div style={{ padding: "0 80px" }}>
          <Form form={form} layout="vertical">
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  name="name"
                  label="Mật khẩu cũ"
                  rules={[{ required: true, message: "Không được để trống" }]}
                >
                  <Input.Password disabled={loadingPass} size="large" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="email"
                  label="Mật khẩu mới"
                  rules={[{ required: true, message: "Không được để trống" }]}
                >
                  <Input.Password disabled={loadingPass} size="large" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="email"
                  label="Xác nhận mật khẩu"
                  rules={[{ required: true, message: "Không được để trống" }]}
                >
                  <Input.Password disabled={loadingPass} size="large" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div style={{ justifySelf: "center" }}>
            <Button type="primary" onClick={() => setLoadingPass(false)}>
                Lưu mật khẩu
            </Button>
          </div>
        </div>
      ),
    },
  ];
  return (
    <Tabs defaultActiveKey="1" items={items} className="marginTop50 border" />
  );
}
export default Account;
