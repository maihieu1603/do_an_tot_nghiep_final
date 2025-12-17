import { parseJwt } from "../components/function";
import { getRefreshToken, setAccessToken, setRefreshToken } from "../components/token";
import { check, get, login, post, refresh } from "../utils/request";

export const loginUser = async(options) => {
    const result = await login("auth/login",options);
    return result;
}

export const refreshToken = async() => {
    const refreshToken = getRefreshToken();
    const result = await refresh (`auth/refresh-token`,refreshToken);
    return result;
}

export const saveToken = (token, refresh) => {
    setAccessToken(token);
    setRefreshToken(refresh);
}

export const checkEmail = async(option) => {
    const result = await check("users/check-email",option);
    return result;
}

export const checkCode = async(option) => {
    const result = await check("studentprofiles/create",option);
    return result;
}

export const checkCodeTeacher = async(option) => {
    const result = await check("verify/otp",option);
    return result;
}

export const getUser = async() => {
    const refreshToken = getRefreshToken();
    const obj = parseJwt(refreshToken);
    console.log(obj);
    const email=obj.email;
    const result = await get (`user/${email}`);
    return result;
}

export const updateUser = async() => {
    const refreshToken = getRefreshToken();
    const obj = parseJwt(refreshToken);
    console.log(obj);
    const email=obj.email;
    const result = await get (`user/${email}`);
    return result;
}