import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useFilms } from "../../hooks";
import { Error, Loading, MovieCard, Pagination } from "../../components";

import styles from "./Catalog.module.css";

export const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [currentPage, setCurrentPage] = useState(() => {
    const page = parseInt(searchParams.get("page") || "1");
    return isNaN(page) ? 1 : page;
  });

  const [isSearching, setIsSearching] = useState(() => !!searchParams.get("q"));

  const { films, loading, error, totalPages } = useFilms({
    type: isSearching ? "search" : "popular",
    query: searchQuery,
    page: currentPage,
    enabled: true,
  });

  useEffect(() => {
    const params: Record<string, string> = {};

    if (isSearching && searchQuery) {
      params.q = searchQuery;
    }
    if (currentPage > 1) {
      params.page = currentPage.toString();
    }

    setSearchParams(params, { replace: true });
  }, [isSearching, searchQuery, currentPage, setSearchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      setCurrentPage(1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClear = () => {
    setSearchQuery("");
    setIsSearching(false);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); //скролл
  };

  if (loading && films.length === 0) {
    return <Loading />;
  }

  if (error) return <Error message={error} />;

  const noResults = !loading && films.length === 0;

  return (
    <>
      <h1>
        {isSearching ? `Search Results for "${searchQuery}"` : "All Movies"}
      </h1>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
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
          No movies found for "{searchQuery}"
        </div>
      )}
    </>
  );
};
