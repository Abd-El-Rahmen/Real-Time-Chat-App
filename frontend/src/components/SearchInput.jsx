import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchInput = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleOnChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for someone"
        className="input input-bordered w-full max-w-xs"
        value={searchQuery}
        onChange={handleOnChange}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};

export default SearchInput;
