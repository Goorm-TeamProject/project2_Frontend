import React, { useEffect, useState } from "react";
import axios from "../lib/axios";
import { useNavigate } from "react-router-dom";

interface Transaction {
    fromAccountNumber: string;
    toAccountNumber?: string; // 송금일 경우
    amount: number;
    balanceAfter: number;
    type: string;
    memo: string;
    status: string;
    createdAt: string;
}

export default function TransactionPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            axios
                .get<Transaction[]>("/transactions", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    const sorted = res.data.sort(
                        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                    setTransactions(sorted);
                })
                .catch((err) => {
                    console.error("💥 거래 내역 오류:", err);
                    setMessage("❌ 거래 내역을 불러오지 못했습니다.");
                });
        }
    }, []);


    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">📋 거래 내역</h2>

                {transactions.length === 0 ? (
                    <p className="text-gray-600">거래 내역이 없습니다.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {transactions.map((tx, index) => (
                            <li key={index} className="py-4">
                                <p>
                                    <strong>{tx.type}</strong> | {tx.amount.toLocaleString()}원 | {new Date(tx.createdAt).toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-500">메모: {tx.memo}</p>
                            </li>
                        ))}
                    </ul>
                )}

                {message && <p className="text-red-600 mt-4">{message}</p>}

                {/* 👉 버튼 고정: 우측 상단 */}
                <div className="fixed top-6 right-6 flex gap-3 z-50">
                    <button
                        onClick={() => navigate("/deposit")}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                        입금
                    </button>
                    <button
                        onClick={() => navigate("/withdraw")}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                    >
                        출금
                    </button>
                    <button
                        onClick={() => navigate("/transfer")}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        송금
                    </button>
                </div>
            </div>
        </div>
    );
}
