import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useFilms } from "../../hooks";
import { Error, Loading, MovieCard, Pagination } from "../../components";

import styles from "./Catalog.module.css";

export const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get("q") || "";
  const initialPage = parseInt(searchParams.get("page") || "1");

  const [inputValue, setInputValue] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(
    isNaN(initialPage) ? 1 : initialPage,
  );

  const isSearching = activeQuery !== "";

  const { films, loading, error, totalPages } = useFilms({
    type: isSearching ? "search" : "popular",
    query: activeQuery,
    page: currentPage,
    enabled: true,
  });

  const updateUrl = (query: string, page: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (page > 1) params.set("page", page.toString());
    setSearchParams(params, { replace: true });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setActiveQuery(inputValue);
      setCurrentPage(1);
      updateUrl(inputValue, 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleClear = () => {
    setInputValue("");
    setActiveQuery("");
    setCurrentPage(1);
    updateUrl("", 1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    updateUrl(activeQuery, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading && films.length === 0) {
    return <Loading />;
  }

  if (error) return <Error message={error} />;

  const noResults = !loading && films.length === 0;

  return (
    <div className={styles.catalog}>
      <h1>
        {isSearching ? `Search Results for "${activeQuery}"` : "All Movies"}
      </h1>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Search movies..."
          value={inputValue}
          onChange={handleInputChange}
          className={styles.searchInput}
        />

        <button type="submit" className={styles.searchButton}>
          Search
        </button>

        {isSearching && (
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearButton}
          >
            Clear
          </button>
        )}
      </form>

      {!isSearching && !loading && noResults && (
        <div className={styles.noResults}>No movies available</div>
      )}

      <div className={styles.grid}>
        {films.map((film) => (
          <MovieCard key={film.id} film={film} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      )}

      {isSearching && !loading && noResults && (
        <div className={styles.noResults}>
          No movies found for "{activeQuery}"
        </div>
      )}
    </div>
  );
};
