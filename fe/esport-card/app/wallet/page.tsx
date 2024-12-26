"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { getWalletBalance, requestRecharge } from "../services/wallet";

interface WalletData {
  balance: number;
}

const WalletPage = () => {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const { register, handleSubmit, reset } = useForm<{
    amount: number;
    external_payment_id: string;
  }>();

  useEffect(() => {
    const fetchWalletBalance = async () => {
      const cachedBalance = sessionStorage.getItem("wallet_balance");
      if (cachedBalance) {
        setWallet({ balance: Number(cachedBalance) });
      } else {
        const res = await getWalletBalance();
        if (res) {
          setWallet(res);
          sessionStorage.setItem("wallet_balance", res.balance.toString());
        }
      }
    };

    fetchWalletBalance();
  }, []);

  const onSubmit = async (data: {
    amount: number;
    external_payment_id: string;
  }) => {
    const res = await requestRecharge(data);
    if (res) {
      alert("Recharge request submitted successfully!");
    }
    reset();
  };

  return (
    <div className="pt-20 px-5 md:px-16 lg:pt-36 lg:px-96">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Your Esport Wallet
      </h1>

      {wallet && (
        <div className="mb-6">
          <h2 className="text-lg font-medium">Available Balance</h2>
          <p className="text-2xl font-bold">Rs.{wallet.balance}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Recharge Amount</label>
          <InputField
            type="number"
            placeholder="Enter amount to recharge"
            name="amount"
            register={register}
          />
          <label className="block text-sm font-medium">Transcation Id</label>
          <InputField
            type="text"
            placeholder="Enter your payment transcation id"
            name="external_payment_id"
            register={register}
          />
        </div>
        <Button type="submit" className="hover:bg-teal-500">
          Request Recharge
        </Button>
      </form>
    </div>
  );
};

export default WalletPage;
