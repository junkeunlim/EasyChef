import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchFilterChange = (event) => {
    setSearchFilter(event.target.value);
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get("http://127.0.0.1:8000/recipes/search/", {
        params: {
          search: searchTerm,
          search_filter: searchFilter,
        },
      });
      setRecipes(response.data);
      if (response.data.length > 0) {
        navigate(`/recipes/${response.data[0].id}`); // Redirect to first recipe details page
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="d-flex align-items-center justify-content-center">
      <input
        type="text"
        className="form-control"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchTermChange}
        style={{ height: "40%", fontSize: "110%", width: "60%" }}
      ></input>
      <select
        className="form-control"
        id="searchFilter"
        value={searchFilter}
        onChange={handleSearchFilterChange}
        style={{ height: "40%", fontSize: "110%", width: "10%" }}
      >
        <option value="" disabled>
          Filter by...
        </option>
        <option value="name">Recipe Name</option>
        <option value="ingredients__name">Ingredients</option>
        <option value="owner__username">Owner Username</option>
      </select>
      <button
        className="btn btn-primary"
        type="submit"
        style={{ height: "50%", fontSize: "120%" }}
      >
        <span className="material-icons d-flex align-items-center justify-content-center">
          search
        </span>
      </button>
    </form>
  );
};

export default Search;
