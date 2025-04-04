import React, { useEffect, useState } from "react";
import axios from "../lib/axios";
import { useNavigate } from "react-router-dom";

interface GetMyAccountResponse {
  accountNumber: string;
  balance: number;
  createdAt: string;
}

export default function WithdrawPage() {
  const [amount, setAmount] = useState(0);
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
        .then((res) => {
          setAccountNumber(res.data[0].accountNumber); // 첫 계좌
        })
        .catch(() => setMessage("❌ 계좌 정보를 가져오지 못했습니다."));
    }
  }, []);

  const handleWithdraw = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("❌ 로그인 필요");
      return;
    }

    try {
      const res = await axios.post(
        "/transactions/withdraw",
        {
          fromAccountNumber: accountNumber,
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("✅ 출금 완료!");
      console.log("출금 결과:", res.data);
      navigate("/transactions");
    } catch (err) {
      alert("❌ 출금 실패");
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">💸 출금하기</h1>

      <div className="mb-4">
        <label className="text-sm text-gray-600">내 계좌</label>
        <input
          type="text"
          value={accountNumber}
          className="border px-4 py-2 rounded-md bg-gray-100 text-gray-600"
          readOnly
        />
      </div>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="출금 금액"
        className="border px-4 py-2 rounded-md mr-2"
      />
      <button onClick={handleWithdraw} className="bg-red-600 text-white px-6 py-2 rounded-md">
        출금
      </button>

      {message && <p className="mt-4 text-red-500 text-sm">{message}</p>}
    </div>
  );
}
