import axiosRequest from "../api/axiosRequest";

import {
    _transformAllManga,
    _transformPagination,
    _transformOneManga,
} from "../utils/dataTransformation";

const _jikanAllMangaUrlBase = "https://api.jikan.moe/v4/manga";

const jikanService = () => {
    const getAllManga = async (
        newPageNumber,
        sortTerm,
        dateRange,
        filterByType,
        sfw,
        mangaStatus
    ) => {
        // Сhecking and generating get request parameters. All this in order not to clog the request URL.
        newPageNumber
            ? (newPageNumber = `&page=${newPageNumber}`)
            : (newPageNumber = "");
        sortTerm ? (sortTerm = `&order_by=${sortTerm}`) : (sortTerm = "");
        dateRange.length > 0
            ? (dateRange = `&start_date=${dateRange[0]}&end_date=${dateRange[1]}`)
            : (dateRange = "");
        filterByType
            ? (filterByType = `&type=${filterByType}`)
            : (filterByType = "");
        sfw ? (sfw = "&sfw") : (sfw = "");
        mangaStatus
            ? (mangaStatus = `&status=${mangaStatus}`)
            : (mangaStatus = "");

        const res = await axiosRequest(
            `${_jikanAllMangaUrlBase}?limit=20${newPageNumber}${sortTerm}${dateRange}${filterByType}${mangaStatus}${sfw}`
        );

        return {
            mangaData: res.data.data.map((manga) => {
                return _transformAllManga(manga);
            }),
            paginationData: _transformPagination(res.data.pagination),
        };
    };

    const getOneManga = async (id) => {
        const res = await axiosRequest(`${_jikanAllMangaUrlBase}/${id}`);
        return _transformOneManga(res.data.data);
    };

    const getRandomManga = async () => {
        const res = await axiosRequest(`https://api.jikan.moe/v4/random/manga`)
        return _transformOneManga(res.data.data);
    }

    return {getAllManga, getOneManga, getRandomManga};
};

export default jikanService;
