import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import TransactionPage from "./pages/TransactionPage";
import "./index.css";
import DepositPage from "./pages/DepositPage";
import WithdrawPage from "./pages/WithdrawPage";
import TransferPage from "./pages/TransferPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/transactions" element={<TransactionPage />} />
      <Route path="/deposit" element={<DepositPage />} />
      <Route path="/withdraw" element={<WithdrawPage />} />
      <Route path="/transfer" element={<TransferPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
