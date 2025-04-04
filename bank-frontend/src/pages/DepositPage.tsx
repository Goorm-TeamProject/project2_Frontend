// 💰 입금 페이지

import React, { useEffect, useState } from "react";
import axios from "../lib/axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface DepositResponse {
  transactionId: string;
  toAccountNumber: string;
  amount: number;
  type: string;
  memo: string;
  status: string;
  balanceAfter: number;
  createdAt: string;
}

interface GetMyAccountResponse {
    accountNumber: string;
    balance: number;
    createdAt: string;
  }
  

interface DecodedToken {
  accountNumber: string;
  [key: string]: any;
}



export default function DepositPage() {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
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
          setAccountNumber(res.data[0].accountNumber); // ✅ 첫 번째 계좌
        })
        .catch(() => setMessage("❌ 계좌 정보를 가져오지 못했습니다."));      
    }
  }, []);
  
  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
  
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setMessage("❌ 인증 토큰이 없습니다. 다시 로그인 해주세요.");
        return;
      }
  
      const res = await axios.post<DepositResponse>(
        "/transactions/deposit",
        {
          toAccountNumber: accountNumber,
          amount: Number(amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      navigate("/transactions");

      setMessage(`✅ 입금 성공! 새로운 잔액: ${res.data.balanceAfter.toLocaleString()}원`);
    } catch (err: any) {
      console.error("💥 입금 오류:", err);
  
      const status = err.response?.status;
  
      if (status === 403) {
        setMessage("❌ 본인의 계좌만 입금할 수 없습니다.");
      } else if (status === 404) {
        setMessage("❌ 계좌를 찾을 수 없습니다.");
      } else if (status === 400) {
        setMessage("❌ 요청 형식이 잘못되었습니다.");
      } else {
        setMessage("❌ 입금 중 오류가 발생했습니다. 나중에 다시 시도해주세요.");
      }
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h2 className="text-3xl font-bold mb-6">💰 입금하기</h2>

      <form onSubmit={handleDeposit} className="flex flex-col gap-4 w-full max-w-md">
        <div className="flex flex-col">
          <label htmlFor="accountNumber" className="mb-1 text-sm text-gray-600">
            내 계좌 번호
          </label>
          <input
            id="accountNumber"
            type="text"
            placeholder="계좌 번호"
            className="border px-4 py-2 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
            value={accountNumber}
            readOnly
          />
        </div>

        <input
          type="number"
          placeholder="금액"
          className="border px-4 py-2 rounded-md"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <button type="submit" className="bg-blue-800 text-white py-3 rounded-md text-lg font-semibold">
          입금하기
        </button>

        {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
      </form>
    </div>
  );
}
