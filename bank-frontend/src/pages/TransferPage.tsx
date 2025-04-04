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
  const [amount, setAmount] = useState(0);
  const [memo, setMemo] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // 🔑 내 계좌번호 가져오기
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      axios
        .get<GetMyAccountResponse[]>("/accounts/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setFromAccountNumber(res.data[0].accountNumber); // 첫 번째 계좌 사용
        })
        .catch(() => setMessage("❌ 계좌 정보를 가져오지 못했습니다."));
    }
  }, []);

  const handleTransfer = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("❌ 인증 토큰이 없습니다. 다시 로그인 해주세요.");
      return;
    }

    try {
      const res = await axios.post(
        "/transactions/transfer",
        {
          fromAccountNumber,
          toAccountNumber,
          amount,
          memo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ 송금 완료!");
      console.log("송금 응답:", res.data);
      navigate("/transactions");
    } catch (err) {
      alert("❌ 송금 실패!");
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">💳 송금하기</h1>

      <div className="mb-4">
        <label className="text-sm text-gray-600">내 계좌</label>
        <input
          type="text"
          value={fromAccountNumber}
          readOnly
          className="border px-4 py-2 rounded-md bg-gray-100 text-gray-600 w-full"
        />
      </div>

      <input
        type="text"
        placeholder="받는 사람 계좌번호"
        value={toAccountNumber}
        onChange={(e) => setToAccountNumber(e.target.value)}
        className="border px-4 py-2 rounded-md w-full mb-2"
      />
      <input
        type="number"
        placeholder="송금 금액"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="border px-4 py-2 rounded-md w-full mb-2"
      />
      <input
        type="text"
        placeholder="메모"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        className="border px-4 py-2 rounded-md w-full mb-4"
      />
      <button
        onClick={handleTransfer}
        className="bg-blue-700 hover:bg-blue-800 text-white w-full py-3 rounded-md font-semibold"
      >
        송금
      </button>

      {message && <p className="mt-4 text-red-500 text-sm">{message}</p>}
    </div>
  );
}
