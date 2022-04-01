import { useState } from 'react';
import {notification} from 'antd';

export default function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token
  };

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    try{
    sessionStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken.token);
    }catch{
      notification.error({ message: 'Error'});
    }
  };

  return {
    setToken: saveToken,
    token
  }
}