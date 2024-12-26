import { api } from "./api";

export const getWalletBalance = async (): Promise<{ balance: number }| undefined> => {
    try{
        const {data} = await api.get("/wallet/get_balance/");
        return data;
    }
  catch (error:any) {
   alert(error.response.data.error || 'Server Error')
  }
};

export const requestRecharge = async (req: { amount: number, external_payment_id: string  }) => {
  try{
    const {data} = await api.post("/wallet/request_recharge/", req);
    return data;
  }
  catch (error:any) {
    alert(error.response.data.error || 'Server Error')
  }
};