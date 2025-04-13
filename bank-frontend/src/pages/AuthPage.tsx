import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import { LoginResponse, JoinResponse } from "../src/auth";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        const res = await axios.post<LoginResponse>("/login", { email, password });
        const token = res.data.accessToken;

        localStorage.setItem("accessToken", token);

        try {
          // 💡 axios 인스턴스에서 자동으로 토큰 붙이므로 headers 제거
          await axios.post("/accounts", { balance: 100000 });
        } catch (err) {
          console.log("⚠️ 계좌 생성 실패 또는 이미 존재", err);
        }

        navigate("/transactions");
      } else {
        const res = await axios.post<JoinResponse>("/join", { name, email, password });
        console.log("✅ 회원가입 성공:", res.data);
        alert("회원가입 성공! 로그인해주세요.");
        setIsLogin(true);
      }
    } catch (err) {
      setError("❌ 오류가 발생했습니다. 이메일 또는 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="text-left w-full max-w-md mb-6">
        <h1 className="text-4xl font-bold">
          <span className="text-blue-800">euoil</span> Banking
        </h1>
      </div>

      <div className="w-full max-w-md bg-white shadow-lg p-8 rounded-xl">
        <div className="flex justify-between mb-6 text-xl font-semibold">
          <button
            onClick={() => setIsLogin(false)}
            className={`transition duration-150 ${!isLogin ? 'text-black' : 'text-gray-400'}`}
          >
            Register
          </button>
          <button
            onClick={() => setIsLogin(true)}
            className={`transition duration-150 ${isLogin ? 'text-black' : 'text-gray-400'}`}
          >
            Sign in
          </button>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              className="border px-4 py-2 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="border px-4 py-2 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border px-4 py-2 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="bg-blue-800 text-white py-3 rounded-md text-lg font-semibold">
            {isLogin ? 'Sign in' : 'Register'}
          </button>
        </form>

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
}
