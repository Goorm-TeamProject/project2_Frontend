import React, { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";  
import { useNavigate } from "react-router-dom";

interface Transaction {
  fromAccountNumber: string;
  toAccountNumber?: string;
  amount: number;
  balanceAfter: number;
  type: string;
  memo: string;
  status: string;
  createdAt: string;
}

interface Account {
  accountNumber: string;
  balance: number;
  createdAt: string;
}

export default function TransactionPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accountInfo, setAccountInfo] = useState<Account | null>(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // 🧾 로그아웃
  const handleLogout = async () => {
    try {
      await axiosInstance.post("users/logout"); 
      navigate("/");
    } catch (err) {
      console.error("❌ 로그아웃 실패:", err);
      alert("로그아웃 중 문제가 발생했어요.");
    }
  };

 useEffect(() => {
  console.log("🔔 [TransactionPage] mounted");

  console.log("👉 [TransactionPage] fetching GET /accounts/me");
  axiosInstance
    .get<Account[]>("/accounts/me")    // ← Account[]라고 명시
    .then((res) => {
      console.log("✅ /accounts/me:", res.data);
      setAccountInfo(res.data[0]);
    })
    .catch(/* … */);

  console.log("👉 [TransactionPage] fetching GET /transactions");
  axiosInstance
    .get<Transaction[]>("/transactions")  
    .then((res) => {
      console.log("✅ /transactions:", res.data);
      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setTransactions(sorted);
    })
    .catch(/* … */);
}, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 relative">
        {/* 우측 상단 고정 버튼 */}
        <div className="fixed top-6 right-6 flex gap-3 z-50">
          <button onClick={() => navigate("/deposit")} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
            입금
          </button>
          <button onClick={() => navigate("/withdraw")} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg">
            출금
          </button>
          <button onClick={() => navigate("/transfer")} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
            송금
          </button>
          <button onClick={handleLogout} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
            로그아웃
          </button>
        </div>

        {/* 계좌 정보 표시 */}
        {accountInfo && (
          <div className="mb-6 text-lg font-medium text-gray-700">
            계좌번호: <span className="font-bold">{accountInfo.accountNumber}</span> | 잔액: <span className="text-blue-700 font-bold">{accountInfo.balance.toLocaleString()}원</span>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4">📋 거래 내역</h2>

        {transactions.length === 0 ? (
          <p className="text-gray-600">거래 내역이 없습니다.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {transactions.map((tx, index) => (
              <li key={index} className="py-4">
                <p className="font-semibold">
                  <strong>{tx.type}</strong> | {tx.amount.toLocaleString()}원 | 잔액: {tx.balanceAfter.toLocaleString()}원 |{" "}
                  {new Date(tx.createdAt).toLocaleString()}
                </p>
                {tx.memo && (
                  <p className="text-sm text-gray-500">메모: {tx.memo}</p>
                )}
              </li>
            ))}
          </ul>
        )}
        {message && <p className="text-red-600 mt-4">{message}</p>}
      </div>
    </div>
  );
}
