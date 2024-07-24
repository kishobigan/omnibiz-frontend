"use client";
import React from "react";
import { FaFoursquare } from "react-icons/fa";
import "./searchBar.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

interface SearchBarProps {
  searchText: string;
  setSearchText: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchText, setSearchText }) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  return (
    <div className="input-group search-bar-container">
      <span className="input-group-text search-icon" id="search-icon">
        <i className="fas fa-search"></i>
      </span>
      <input
        type="text"
        value={searchText}
        onChange={handleSearchChange}
        placeholder="Search here..."
        className="form-control search-bar-input"
        aria-describedby="search-icon"
      />
    </div>
  );
};

export default SearchBar;
