import React, { useEffect, useState } from "react";
import axios from "../lib/axios";
import { useNavigate } from "react-router-dom";

interface GetMyAccountResponse {
  accountNumber: string;
  balance: number;
  createdAt: string;
}

export default function TransferPage() {
  const [fromAccountNumber, setFromAccountNumber] = useState("");
  const [toAccountNumber, setToAccountNumber] = useState("");
  const [amount, setAmount] = useState(""); // ✅ 문자열로 바꿔서 0 제거
  const [memo, setMemo] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // 🔑 내 계좌 가져오기
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      axios
        .get<GetMyAccountResponse[]>("/accounts/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setFromAccountNumber(res.data[0].accountNumber))
        .catch(() => setMessage("❌ 계좌 정보를 가져오지 못했습니다."));
    }
  }, []);

  const handleTransfer = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return alert("❌ 인증 토큰이 없습니다. 다시 로그인 해주세요.");

    if (!toAccountNumber || !amount || Number(amount) <= 0) {
      setMessage("❌ 계좌번호와 금액을 올바르게 입력해주세요.");
      return;
    }

    try {
      const res = await axios.post(
        "/transactions/transfer",
        {
          fromAccountNumber,
          toAccountNumber,
          amount: Number(amount),
          memo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("✅ 송금 완료!");
      navigate("/transactions");
    } catch (err) {
      alert("❌ 송금 실패!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      {/* 🏠 홈 버튼 */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={() => navigate("/transactions")}
          className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg"
        >
          🏠 홈
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6">💳 송금하기</h1>

      <div className="w-full max-w-md flex flex-col gap-4">
        <input
          type="text"
          value={fromAccountNumber}
          readOnly
          className="border px-4 py-2 rounded-md bg-gray-100 text-gray-600"
        />
        <input
          type="text"
          placeholder="받는 사람 계좌번호"
          value={toAccountNumber}
          onChange={(e) => setToAccountNumber(e.target.value)}
          className="border px-4 py-2 rounded-md"
        />
        <input
          type="number"
          placeholder="송금 금액"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border px-4 py-2 rounded-md"
        />
        <input
          type="text"
          placeholder="메모"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="border px-4 py-2 rounded-md"
        />
        <button
          onClick={handleTransfer}
          className="bg-blue-700 hover:bg-blue-800 text-white w-full py-3 rounded-md font-semibold"
        >
          송금
        </button>

        {message && <p className="text-red-500 text-sm text-center">{message}</p>}
      </div>
    </div>
  );
}
