import { api } from "./api"; 

export const getBanners = async () => {
  try{
    const {data} = await api.get("/banner/get_banners/");
    return data; 

  }
  catch (error:any) {
   alert(error.response.data.error)
  }
};