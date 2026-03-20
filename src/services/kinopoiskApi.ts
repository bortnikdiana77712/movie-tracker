import axios from "axios";
import type { PopularResponse, SearchResponse } from "../types/movie.types";

const API_KEY = import.meta.env.VITE_KINOPOISK_API_KEY;
const BASE_URL = "https://kinopoiskapiunofficial.tech/api";

const kinopoiskApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "X-API-KEY": API_KEY,
    "Content-Type": "application/json",
  },
});

export const searchFilms = async (
  keyword: string,
  page: number = 1,
): Promise<SearchResponse> => {
  const response = await kinopoiskApi.get("/v2.2/films", {
    params: { keyword, page },
  });
  return response.data;
};

export const getFilmDetails = async (id: number) => {
  const response = await kinopoiskApi.get(`/v2.2/films/${id}`);
  return response.data;
};

export const getPopularFilms = async (
  page: number = 1,
): Promise<PopularResponse> => {
  const response = await kinopoiskApi.get("/v2.2/films/top", {
    params: { type: "TOP_100_POPULAR_FILMS", page },
  });
  return response.data;
};
