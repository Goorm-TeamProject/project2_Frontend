import React from "react";
import { useNavigate } from "react-router-dom";

export default function TransactionPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">결제 내역</h2>

        {/* 거래 리스트는 여기에 map으로 추가할 예정 */}

        {/* 👉 버튼 라인 */}
        <div className="flex justify-end gap-4 mt-8">
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
