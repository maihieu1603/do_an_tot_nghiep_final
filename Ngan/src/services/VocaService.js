import { get } from "../utils/request";

export const getListSuggest = async(word) => {
    const result = await get(`dictionary/suggestion?word=${word}`);
    return result;
}