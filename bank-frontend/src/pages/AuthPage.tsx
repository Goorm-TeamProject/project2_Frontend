import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../lib/axios";
import { LoginResponse, JoinResponse } from "../src/auth";
import QRCode from "react-qr-code";

export default function AuthPage() {
  const [token, setToken] = useState<string>("");
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [mfaStep, setMfaStep] = useState(false);
  const [otpUrl, setOtpUrl] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (isLogin) {
      mfaStep ? await handleMfaVerify() : await handleLogin();
    } else {
      await handleRegister();
    }
  };

    const handleLogin = async () => {
    console.log("👉 [AuthPage] About to call POST /login", { email, password });
    try {
      const res = await axiosInstance.post<LoginResponse>(
        "/login",
        { email, password },
        { withCredentials: true }
      );
      console.log("✅ [AuthPage] login response data:", res.data);

      console.log("👉 [AuthPage] About to call GET /mfa/setup");
      const otpRes = await axiosInstance.get<{ otpUrl: string }>(
        "/mfa/setup",
        { withCredentials: true }
      );
      console.log("✅ [AuthPage] /mfa/setup response:", otpRes.data);

      setOtpUrl(otpRes.data.otpUrl);
      setMfaStep(true);
      console.log("✅ [AuthPage] MFA step entered");
    } catch (err) {
      console.error("❌ [AuthPage] login or setup error:", err);
      handleAxiosError(err, {
        403: "접근이 거부되었습니다. 인증되지 않은 사용자입니다.",
        default: "로그인 실패: 이메일 또는 비밀번호를 확인해주세요.",
      });
    }
  };

  const handleMfaVerify = async () => {
    console.log("👉 [AuthPage] About to call POST /mfa/verify", {
      email,
      code: parseInt(mfaCode, 10),
    });
    try {
      const res = await axiosInstance.post(
        "/mfa/verify",
        { email, code: parseInt(mfaCode, 10) },
        { withCredentials: true }
      );
      console.log("✅ [AuthPage] /mfa/verify response:", res);
      console.log("👉 [AuthPage] navigating to /transactions");
      navigate("/transactions");
    } catch (err) {
      console.error("❌ [AuthPage] MFA verify error:", err);
      handleAxiosError(err, {
        default: "MFA 인증에 실패했습니다. 코드를 확인해주세요.",
      });
    }
  };

  const handleRegister = async () => {
    try {
      const res = await axiosInstance.post<JoinResponse>("/join", { name, email, password });
      console.log("✅ 회원가입 성공:", res.data);
      alert("회원가입 성공! 로그인해주세요.");
      setIsLogin(true);
    } catch (err) {
      handleAxiosError(err, {
        403: "접근이 거부되었습니다. 관리자에게 문의해주세요.",
        default: "회원가입 실패: 입력 정보를 확인해주세요.",
      });
    }
  };

  const handleAxiosError = (
    err: any,
    messages: { [key: number]: string; default: string }
  ) => {
    const status = err?.response?.status;
    const message = status && messages[status] ? messages[status] : messages.default;
    setError(message);
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
            onClick={() => {
              setIsLogin(false);
              setMfaStep(false);
            }}
            className={`transition duration-150 ${!isLogin ? 'text-black' : 'text-gray-400'}`}
          >
            Register
          </button>
          <button
            onClick={() => {
              setIsLogin(true);
              setMfaStep(false);
            }}
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
          {mfaStep && (
            <input
              type="text"
              placeholder="Enter MFA Code"
              className="border px-4 py-2 rounded-md"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
            />
          )}
          <button type="submit" className="bg-blue-800 text-white py-3 rounded-md text-lg font-semibold">
            {mfaStep ? "Verify MFA" : isLogin ? 'Sign in' : 'Register'}
          </button>
        </form>

        {otpUrl && (
          <div className="mt-4 p-4 bg-white rounded shadow">
            <p className="mb-2 font-medium">MFA 등록을 위해 QR 코드를 스캔하세요:</p>
            <QRCode value={otpUrl} />
            <p className="mt-2 text-sm text-gray-600 break-all">{otpUrl}</p>
          </div>
        )}

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
}
