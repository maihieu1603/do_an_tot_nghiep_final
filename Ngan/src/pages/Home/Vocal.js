import { Button, Input } from "antd";
import "./vocal.css";
import { SoundTwoTone } from "@ant-design/icons";
import { useState } from "react";

function Highlighter({ sentence, word }) {
  const parts = sentence.split(new RegExp(`(${word})`, "gi"));

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === word.toLowerCase() ? (
          <span key={index} style={{ color: "red", fontWeight: 700 }}>
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

function Vocal() {
  const [isFront, setIsFront] = useState(true);
  const flipCard = (e) => {
    if (!isFront && isContinue) {
      return;
    }
    const card = e.currentTarget;
    const isFlipped = card.classList.toggle("is-flipped");
    setIsFront(!isFlipped);
    if (isFront) {
      setIsContinue(false);
      setIsCheck(false);
      setValue();
    }
  };

  const dictionary = [
    {
      vocabulary: "father1",
    },
    {
      vocabulary: "father2",
    },
    {
      vocabulary: "father3",
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContinue, setIsContinue] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [value, setValue] = useState();
  const showModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const nextWord = () => {
    if(currentIndex < dictionary.length - 1) setCurrentIndex((prev) => prev + 1);
    else{
      setCurrentIndex(0);
      setIsModalOpen(!isModalOpen);
    }

    // Reset trạng thái
    setIsFront(true);
    setIsContinue(false);
    setIsCheck(false);
    setValue("");

    // Bỏ class lật thẻ
    const card = document.querySelector(".flashcard");
    if (card) {
      card.classList.remove("is-flipped");
    }
  };

  return (
    <>
      <div className="marginTop50">
        <Button className="button__On" onClick={showModal}>
          {!isModalOpen ? "Ôn tập từ vựng" : "Danh sách từ vựng"}
        </Button>
        {!isModalOpen ? (
          <>
            {dictionary.length === 0 ? (
              <h1>Chưa có từ trong từ điển của bạn!</h1>
            ) : (
              dictionary.map((word) => (
                <div className="nghia">
                  <div className="flex1">
                    <h1 style={{ color: "#0071f9" }}>{word.vocabulary}</h1>
                    <div className="tl">noun</div>
                  </div>
                  <div
                    className="flex1"
                    style={{
                      borderBottom: "1px solid #ddd",
                      paddingBottom: "10px",
                    }}
                  >
                    <h3 style={{ margin: 0 }}>/ˈfɑː·ðər/</h3>
                    <SoundTwoTone
                      style={{ fontSize: "20px", cursor: "pointer" }}
                    />
                  </div>
                  <div className="flex1">
                    <h3 className="font700_20">một người cha</h3>
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
              ))
            )}
          </>
        ) : (
          <div className="boc__flash">
            <div className="flashcard" onClick={flipCard}>
              <div className="loa__tron">
                <SoundTwoTone twoToneColor="#f68566ff" className="loa" />
              </div>
              {isCheck && (
                <div
                  className="check__tu"
                  style={
                    value === "father"
                      ? { backgroundColor: "rgb(239, 255, 253)" }
                      : { backgroundColor: "rgba(255, 239, 239, 1)" }
                  }
                >
                  <div className="flex1">
                    <h1 style={{ marginTop: "5px" }}>{dictionary[currentIndex].vocabulary}</h1>
                    <div className="tl">noun</div>
                  </div>
                  <h3 style={{ margin: 0 }}>/ˈfɑː·ðər/</h3>
                  <div className="flex1">
                    <h3 className="font700_20">một người cha</h3>
                  </div>
                </div>
              )}
              <div className="inner">
                <div className="front">
                  <img
                    src="/images/dad-stress-neurodevelopment-neurosicence.jpg"
                    style={{ width: "60%" }}
                    alt="một người cha"
                  />
                  <div
                    className="font700_16 marginTop20"
                    style={{ marginBottom: "8px" }}
                  >
                    <Highlighter
                      sentence="The young child ran to hug his father after school."
                      word="father"
                    />
                  </div>
                </div>
                <div className="back">
                  {!isContinue ? (
                    <>
                      <div className="flex1">
                        <h1 style={{ color: "#0071f9" }}>{dictionary[currentIndex].vocabulary}</h1>
                        <div className="tl">noun</div>
                      </div>
                      <h3 style={{ margin: 0 }}>/ˈfɑː·ðər/</h3>
                      <div className="flex1">
                        <h3 className="font700_20">một người cha</h3>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3>Nhập từ bạn nghe được</h3>
                      <Input
                        size="large"
                        style={{ width: "60%" }}
                        onChange={(e) => setValue(e.target.value)}
                        disabled={isCheck}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="marginTop20" style={{ justifySelf: "center" }}>
              {isFront ? (
                <Button onClick={nextWord}>Tôi đã biết từ này</Button>
              ) : !isContinue ? (
                <Button onClick={() => setIsContinue(true)}>Tiếp theo</Button>
              ) : !isCheck ? (
                <Button onClick={() => setIsCheck(true)}>Kiểm tra</Button>
              ) : (
                <Button onClick={nextWord}>Tiếp tục</Button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Vocal;
