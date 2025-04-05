import React, { useEffect, useState } from "react";
import axios from "../lib/axios";
import { useNavigate } from "react-router-dom";

interface GetMyAccountResponse {
  accountNumber: string;
  balance: number;
  createdAt: string;
}

export default function WithdrawPage() {
  const [amount, setAmount] = useState(""); // string 타입으로 변경
  const [accountNumber, setAccountNumber] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      axios
        .get<GetMyAccountResponse[]>("/accounts/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => setAccountNumber(res.data[0].accountNumber))
        .catch(() => setMessage("❌ 계좌 정보를 가져오지 못했습니다."));
    }
  }, []);

  const handleWithdraw = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return alert("❌ 로그인 필요");

    const amountNumber = Number(amount);

    // ✅ 유효성 검사
    if (!amount || isNaN(amountNumber) || amountNumber <= 0) {
      alert("❌ 유효한 출금 금액을 입력해주세요.");
      return;
    }

    try {
      const res = await axios.post(
        "/transactions/withdraw",
        {
          fromAccountNumber: accountNumber,
          amount: amountNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ 출금 완료!");
      navigate("/transactions");
    } catch (err) {
      alert("❌ 출금 실패");
      console.error(err);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={() => navigate("/transactions")}
          className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          🏠 홈
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6">💸 출금하기</h1>

      <div className="w-full max-w-md flex flex-col gap-4">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">내 계좌</label>
          <input
            type="text"
            value={accountNumber}
            readOnly
            className="border px-4 py-2 rounded-md bg-gray-100 text-gray-600"
          />
        </div>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="출금 금액"
          className="border px-4 py-2 rounded-md"
        />

        <button
          onClick={handleWithdraw}
          className="bg-red-600 hover:bg-red-700 text-white w-full py-3 rounded-md font-semibold"
        >
          출금
        </button>

        {message && <p className="mt-4 text-red-500 text-sm text-center">{message}</p>}
      </div>
    </div>
  );
}
