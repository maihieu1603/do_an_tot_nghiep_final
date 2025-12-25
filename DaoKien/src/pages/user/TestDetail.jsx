"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import ExamInfo from "../../components/test-detail/ExamInfo";
import TimeSetting from "../../components/test-detail/TimeSetting";
import PartList from "../../components/test-detail/PartList";
import StartTestButton from "../../components/test-detail/StartTestButton";
import CommentSection from "../../components/comments/CommentSection";

export default function TestDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [customTime, setCustomTime] = useState(30);

    useEffect(() => {
        const fetchExam = async () => {
            try {
                setLoading(true);

                // const token = import.meta.env.VITE_STUDENT_TOKEN;
                const baseUrl = import.meta.env.VITE_API_URL;

                const token = localStorage.getItem("accessToken");

                const res = await fetch(`${baseUrl}/exams/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const json = await res.json();

                if (!json.success) {
                    setError("Không tải được dữ liệu đề thi");
                    return;
                }

                setExam(json.data);
            } catch (err) {
                setError("Lỗi tải dữ liệu.");
            } finally {
                setLoading(false);
            }
        };

        fetchExam();
    }, [id]);

    if (loading) return <p>Đang tải...</p>;
    if (!exam) return <p>Lỗi tải dữ liệu</p>;

    const parts = [...new Set(exam.Questions.map((q) => q.Media?.Section))];

    // const handleStartTest = () => {
    //     if (customTime < 5 || customTime > exam.TimeExam) {
    //         setError(`Thời gian phải từ 5 đến ${exam.TimeExam} phút`);
    //         return;
    //     }
    //     navigate(`/user/dotests/${id}?time=${customTime}`);
    // };

    const handleStartTest = async () => {
        try {
            // const token = import.meta.env.VITE_STUDENT_TOKEN;
            const baseUrl = import.meta.env.VITE_API_URL;

            const token = localStorage.getItem("accessToken");

            if (customTime < 5 || customTime > exam.TimeExam) {
                setError(`Thời gian phải từ 5 đến ${exam.TimeExam} phút`);
                return;
            }

            // 🟦 Tạo attempt
            const res = await fetch(`${baseUrl}/attempts/start`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ExamID: exam.ID,
                    Type: "FULL_TEST",
                }),
            });

            const json = await res.json();
            if (!json.success) {
                setError("Không thể bắt đầu bài thi");
                return;
            }

            const attemptId = json.data.attemptId;

            // 🟦 Điều hướng đến trang làm bài
            navigate(`/user/dotests/${exam.ID}?time=${customTime}`, {
                state: { attemptId },
            });

        } catch (err) {
            setError("Lỗi khởi tạo bài thi");
        }
    };


    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold text-center mb-8">{exam.Title}</h1>

            <ExamInfo exam={exam} parts={parts} />
            <TimeSetting
                customTime={customTime}
                setCustomTime={setCustomTime}
                maxTime={exam.TimeExam}
            />
            <PartList exam={exam} parts={parts} />
            <StartTestButton onStart={handleStartTest} />

            <CommentSection examId={exam.ID} />
        </div>
    );
}


// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { AlertCircle, CheckCircle2, Clock, FileText } from "lucide-react";
// import CommentSection from "../../components/comments/CommentSection";

// export default function TestDetail() {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const [exam, setExam] = useState(null);
//     const [comments, setComments] = useState([]);
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [customTime, setCustomTime] = useState(30);

//     useEffect(() => {
//         const fetchExam = async () => {
//             try {
//                 setLoading(true);

//                 const token = import.meta.env.VITE_STUDENT_TOKEN;
//                 const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/api/exam";

//                 const res = await fetch(`${baseUrl}/exams/${id}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });

//                 const json = await res.json();

//                 if (!json.success) {
//                     setError("Không tải được dữ liệu đề thi");
//                     setLoading(false);
//                     return;
//                 }

//                 setExam(json.data);

//                 // Nếu bạn có API get comment -> thay phần này bằng API thật
//                 setComments([]); // tạm để rỗng

//                 setLoading(false);
//             } catch (err) {
//                 console.error(err);
//                 setError("Lỗi tải dữ liệu.");
//                 setLoading(false);
//             }
//         };

//         fetchExam();
//     }, [id]);

//     // -----------------------------
//     // Start Test
//     // -----------------------------
//     const handleStartTest = () => {
//         if (customTime < 5 || customTime > exam.TimeExam) {
//             setError(`Thời gian phải từ 5 đến ${exam.TimeExam} phút`);
//             return;
//         }

//         navigate(`/user/dotests/${id}?time=${customTime}`);
//     };

//     // -----------------------------
//     // Loading UI
//     // -----------------------------
//     if (loading) {
//         return (
//             <div className="flex items-center justify-center min-h-screen">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//                     <p className="text-gray-600">Đang tải thông tin đề thi...</p>
//                 </div>
//             </div>
//         );
//     }

//     // -----------------------------
//     // Error UI
//     // -----------------------------
//     if (error && !exam) {
//         return (
//             <div className="max-w-2xl mx-auto px-4 py-10">
//                 <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
//                     <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
//                     <p className="text-red-700 font-medium">{error}</p>
//                 </div>
//             </div>
//         );
//     }

//     // -----------------------------
//     // Dữ liệu từ API thật
//     // exam.Questions[] ← đã có đủ Media + Choices
//     // exam.ExamType.Description
//     // -----------------------------

//     const totalQuestions = exam?.Questions?.length || 0;

//     // Group theo Section (Part) vì API có field Section trong Media
//     const parts = [...new Set(exam.Questions.map(q => q.Media?.Section))];

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
//             <div className="max-w-6xl mx-auto px-6 py-12">

//                 <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 mb-8 text-center drop-shadow-sm">
//                     {exam.Title}
//                 </h1>

//                 {/* Errors */}
//                 {error && (
//                     <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-5 mb-8 flex items-start gap-4 shadow-md">
//                         <AlertCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
//                         <p className="text-red-800 font-medium">{error}</p>
//                     </div>
//                 )}

//                 {/* Exam Info */}
//                 <div className="bg-white shadow-xl rounded-2xl p-8 mb-10 ring-1 ring-gray-200 hover:shadow-2xl transition-shadow duration-300">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <InfoItem
//                             icon={CheckCircle2}
//                             label="Loại đề"
//                             value={exam.ExamType?.Description || "Không xác định"}
//                         />
//                         <InfoItem
//                             icon={Clock}
//                             label="Thời gian chuẩn"
//                             value={`${exam.TimeExam} phút`}
//                         />
//                         <InfoItem
//                             icon={FileText}
//                             label="Số phần thi"
//                             value={`${parts.length} phần`}
//                         />
//                         <InfoItem
//                             icon={FileText}
//                             label="Tổng số câu hỏi"
//                             value={`${totalQuestions} câu`}
//                         />
//                     </div>
//                 </div>

//                 {/* Custom Time */}
//                 <div className="bg-white shadow-xl rounded-2xl p-8 mb-8 ring-1 ring-gray-200">
//                     <h2 className="text-xl font-bold text-gray-800 mb-6">Cài đặt thời gian làm bài</h2>

//                     <div className="mt-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
//                         <label className="block mb-3 font-semibold text-gray-700 text-lg">Thời gian làm bài (phút):</label>
//                         <input
//                             type="number"
//                             min="5"
//                             max={exam.TimeExam}
//                             value={customTime}
//                             onChange={(e) => setCustomTime(Number(e.target.value))}
//                             className="border border-gray-300 rounded-lg p-3 w-40 text-center focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 shadow-sm"
//                         />
//                         <p className="text-sm text-gray-600 mt-3">(Tối đa {exam.TimeExam} phút)</p>
//                     </div>
//                 </div>

//                 {/* Part List (Group by Section) */}
//                 <div className="bg-gray-50 rounded-xl p-5 mb-8">
//                     <h2 className="text-lg font-semibold text-gray-800 mb-4">Các phần thi trong đề</h2>

//                     {parts.map((section) => {
//                         const qInPart = exam.Questions.filter(q => q.Media?.Section === section);

//                         return (
//                             <div key={section} className="p-4 rounded-lg">
//                                 <p className="font-medium text-blue-700 text-sm">
//                                     Part {section}
//                                     <span className="text-gray-600 text-xs ml-1 bg-gray-100 px-2 py-0.5 rounded-full">
//                                         ({qInPart.length} câu hỏi)
//                                     </span>
//                                 </p>

//                                 <div className="flex flex-wrap gap-2 mt-2">
//                                     <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
//                                         {qInPart[0]?.Media?.Type}
//                                     </span>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>

//                 {/* Start Button */}
//                 <div className="text-center mt-8 mb-12">
//                     <button
//                         onClick={handleStartTest}
//                         className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105"
//                     >
//                         🚀 Bắt đầu làm bài
//                     </button>
//                 </div>

//                 <CommentSection examId={exam.ID} initialComments={comments} />
//             </div>
//         </div>
//     );

//     function InfoItem({ icon: Icon, label, value }) {
//         return (
//             <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
//                 <Icon className="w-6 h-6 text-blue-600 flex-shrink-0" />
//                 <div>
//                     <p className="text-sm text-gray-500 font-medium">{label}</p>
//                     <p className="font-bold text-gray-900 text-lg">{value}</p>
//                 </div>
//             </div>
//         );
//     }
// }