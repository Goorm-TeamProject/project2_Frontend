import React, { useState } from "react";
import axios from "../lib/axios";

export default function WithdrawPage() {
  const [amount, setAmount] = useState(0);
  const userId = localStorage.getItem("userId");

  const handleWithdraw = async () => {
    try {
      const res = await axios.post("/transactions/withdraw", {
        fromAccountNumber: userId,
        amount,
      });
      alert("출금 완료!");
      console.log("✅ 출금 응답:", res.data);
    } catch (err) {
      alert("출금 실패!");
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">💸 출금하기</h1>
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
    </div>
  );
}
