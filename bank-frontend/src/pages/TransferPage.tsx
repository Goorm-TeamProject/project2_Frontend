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
  const [amount, setAmount] = useState(""); 
  const [memo, setMemo] = useState("");
  const [message, setMessage] = useState("");
  const [balance, setBalance] = useState<number | null>(null);
  const navigate = useNavigate();

  // 🔑 내 계좌 정보 조회
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
          setFromAccountNumber(res.data[0].accountNumber);
          setBalance(res.data[0].balance);
        })
        .catch(() => setMessage("❌ 계좌 정보를 가져오지 못했습니다."));
    }
  }, []);

  // 🧾 송금 처리
  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setMessage("❌ 인증 토큰이 없습니다. 다시 로그인 해주세요.");
      return;
    }

    const amountNumber = Number(amount);

    // 유효성 검사
    if (!toAccountNumber) {
      setMessage("❌ 받는 사람 계좌번호를 입력해주세요.");
      return;
    }
    if (!amount || isNaN(amountNumber) || amountNumber <= 0) {
      setMessage("❌ 유효한 송금 금액을 입력해주세요.");
      return;
    }
    if (balance !== null && amountNumber > balance) {
      setMessage("❌ 잔액을 초과한 금액입니다.");
      return;
    }

    try {
      await axios.post(
        "/transactions/transfer",
        {
          fromAccountNumber,
          toAccountNumber,
          amount: amountNumber,
          memo,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/transactions");
    } catch (err) {
      setMessage("❌ 송금 실패. 다시 시도해주세요.");
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
      {balance !== null && (
        <p className="mb-4 text-gray-700 text-lg">
          현재 잔액: <span className="font-semibold text-blue-700">{balance.toLocaleString()}원</span>
        </p>
      )}

      <form onSubmit={handleTransfer} className="w-full max-w-md flex flex-col gap-4">
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
          placeholder="메모 (선택사항)"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="border px-4 py-2 rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white w-full py-3 rounded-md font-semibold"
        >
          송금
        </button>

        {message && <p className="mt-4 text-red-500 text-sm text-center">{message}</p>}
      </form>
    </div>
  );
}
