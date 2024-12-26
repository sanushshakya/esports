import { api } from './api';

export const loginUser = async (email: string, password: string) => {
  try {
    const {data} = await api.post('/auth/login/', {
      email,
      password,
    });
    console.log(data)
    return data;
  } catch (error:any) {
    alert(error.response.data.error);
  }
};


export const sendOtp = async (email: string) => {
    try {
      const {data} = await api.post('/auth/send_otp/', { email });
      return data;
    } catch (error:any) {
      alert(error.response.data.error);
    }
  };
  

  export const verifyOtp = async (email: string, otp: string) => {
    try {
      const {data} = await api.post('/auth/verify_otp/', { email, otp });
      return data;
    } catch (error:any) {
      alert(error.response.data.error);
    }
  };
  
  export const registerUser = async (
    first_name: string,
    last_name: string,
    email: string,
    username: string,
    password: string,
    phone_number: string,
    token: string
  ) => {
    try {
      const {data} = await api.post(
        `/auth/register/`,
        { first_name, last_name, email, username, password, phone_number, token },
      );
      return data;
    } catch (error:any) {
      alert(error.response.data.error);
    }
  };


export const getUserProfile = async () => {
  try{
    const {data} = await api.get("/auth/profile/");
    return data;
  }
  catch (error) {
    console.error("Failed to fetch profile:", error);
  }
};

export const updateUserProfile = async (userData: any) => {
  try {
    const {data} = await api.put("/auth/update_user/", userData);
    return data;
  }
  catch (error) {
    alert("There was an issue updating your profile.");
  }

};


// Send OTP to user's email
export const sendPasswordOtp = async (req: { email: string }) => {
  try{
    const {data} = await api.post("/auth/forget_password/", req);
    return data;
  }
  catch (error:any) {
    alert(error.response.data.error)
  }
};

// Verify OTP and proceed to password reset
export const verifyPasswordOtp = async (req: { email: string; otp: string }) => {
  try{
    const {data} = await api.post("/auth/verify_forget_password_otp/", req);
    return data;
  }
  catch (error:any) {
    alert(error.response.data.error)
  }
};

export const resetPassword = async (req: { new_password: string; confirm_password: string; token: string }) => {
 try{
  const {data} = await api.post("/auth/reset_password/", req);
  return data;
 }
  catch (error:any) {
    alert(error.response.data.error)
  }
};