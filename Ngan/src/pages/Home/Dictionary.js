import { Button, Input, notification } from "antd";
import { useLocation } from "react-router-dom";
import { SoundTwoTone } from "@ant-design/icons";
import { useRef, useState } from "react";
import { getListSuggest } from "../../services/VocaService";
import { openNotification } from "../../components/Notification";
import { AutoComplete } from "antd";
const { Search } = Input;
function Dictionary() {
  const location = useLocation();
  const word = location.state?.word;
  const [api, content] = notification.useNotification();
  const onSearch = (value) => console.log(value);

  const [value, setValue] = useState("");
  const [options, setOptions] = useState([]);
  const debounceRef = useRef(null);
  // Gọi API suggestion
  const fetchSuggestions = async (text) => {
    console.log(text);
    if (!text) {
      setOptions([]);
      return;
    }

    try {
      const res = await getListSuggest(text);
      console.log(res);
      if (res.code === 200) {
        const opts = res.data.map((word) => ({ value: word }));
        setOptions(opts);
      } else {
        openNotification(api, "bottomRight", "Lỗi", res.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (text) => {
    setValue(text);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(text);
    }, 400); // 400ms sau khi dừng gõ
  };

  const handleSelect = async (word) => {
    console.log("từ: " + word);
    // console.log("Selected:", word);

    // const res = await axios.get(`http://localhost:8080/dictionary`, {
    //   params: { word },
    // });

    // console.log("Dictionary detail:", res.data);
    // // 👉 hiển thị nghĩa, phát âm, ví dụ...
  };
  return (
    <>
      {content}
      <div style={{ justifySelf: "center", marginTop: "70px", width: "50%" }}>
        <AutoComplete
          className="search-box"
          size="large"
          value={value}
          options={options}
          style={{ width: "100%" }}
          onSearch={handleSearch}
          onSelect={handleSelect}
        >
          <Input.Search
            placeholder="Tra từ tại đây"
            onClick={onSearch}
            defaultValue={word}
          />
        </AutoComplete>
      </div>
      <div className="nghia">
        <div className="flex1">
          <h1 style={{ color: "#0071f9" }}>{word}</h1>
          <div className="tl">noun</div>
        </div>
        <div
          className="flex1"
          style={{ borderBottom: "1px solid #ddd", paddingBottom: "10px" }}
        >
          <h3 style={{ margin: 0 }}>/ˈfɑː·ðər/</h3>
          <SoundTwoTone style={{ fontSize: "20px", cursor: "pointer" }} />
        </div>

        <div className="flex1" style={{ margin: "15px" }}>
          <div style={{ width: "50%" }}>
            <div className="flex1">
              <h3 className="font700_20">một người cha</h3>
              <Button type="primary">Lưu từ</Button>
            </div>

            <div className="font20">Ví dụ:</div>
            <div style={{ paddingLeft: "20px" }}>
              <div className="font700_16" style={{ marginBottom: "8px" }}>
                The young child ran to hug his father after school.
              </div>
              <div className="font16">
                Đứa bé chạy đến ôm bố nó sau khi tan học.
              </div>
            </div>
          </div>
          <img
            src="/images/dad-stress-neurodevelopment-neurosicence.jpg"
            style={{ width: "45%" }}
            alt="một người cha"
          />
        </div>
      </div>
    </>
  );
}
export default Dictionary;
