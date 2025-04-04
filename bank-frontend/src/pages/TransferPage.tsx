import React, { useState } from "react";
import axios from "../lib/axios";

export default function TransferPage() {
  const [toAccountNumber, setToAccountNumber] = useState("");
  const [amount, setAmount] = useState(0);
  const [memo, setMemo] = useState("");
  const fromAccountNumber = localStorage.getItem("userId");

  const handleTransfer = async () => {
    try {
      const res = await axios.post("/transactions/transfer", {
        fromAccountNumber,
        toAccountNumber,
        amount,
        memo,
      });
      alert("송금 완료!");
      console.log("✅ 송금 응답:", res.data);
    } catch (err) {
      alert("송금 실패!");
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">💳 송금하기</h1>
      <input
        type="text"
        placeholder="받는 사람 계좌번호"
        value={toAccountNumber}
        onChange={(e) => setToAccountNumber(e.target.value)}
        className="border px-4 py-2 rounded-md mr-2"
      />
      <input
        type="number"
        placeholder="송금 금액"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="border px-4 py-2 rounded-md mr-2"
      />
      <input
        type="text"
        placeholder="메모"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        className="border px-4 py-2 rounded-md mr-2"
      />
      <button onClick={handleTransfer} className="bg-blue-700 text-white px-6 py-2 rounded-md">
        송금
      </button>
    </div>
  );
}
