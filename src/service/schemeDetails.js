import { schemeAxios } from "../api/schemeAxios";

export const getSchemeDetails = async (params) => {

    const response = await schemeAxios.get(
        "/schemedesc/filter",
        {
            params,
        }
    );
    return response.data;
};
