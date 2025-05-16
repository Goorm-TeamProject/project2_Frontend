// src/components/ProtectedRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../lib/axios";

interface Props {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // 서버에 계좌 조회 요청을 던져서 인증 여부를 확인
    axiosInstance
      .get("/accounts/me")
      .then(() => {
        setAuthenticated(true);
      })
      .catch(() => {
        setAuthenticated(false);
      })
      .then(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>로딩 중…</div>;
  }

  if (!authenticated) {
    alert("로그인이 필요합니다.");
    return <Navigate to="/" replace />;
  }

  return children;
}
