import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate, useSearchParams } from "react-router";
import useCategories from "../../Hooks/useCategories";

const CATALOG_PATH = "/product-categories";

const SearchBox = ({ onSearch }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { categories, loading } = useCategories();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") ?? "");
  const [categoryId, setCategoryId] = useState(searchParams.get("category_id") ?? "");

 
  useEffect(() => {
    setSearchTerm(searchParams.get("search") ?? "");
    setCategoryId(searchParams.get("category_id") ?? "");
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const term = searchTerm.trim();
    const params = new URLSearchParams();
    if (term) params.set("search", term);
    if (categoryId) params.set("category_id", categoryId);

    const qs = params.toString();
    navigate(qs ? `${CATALOG_PATH}?${qs}` : CATALOG_PATH);

    if (onSearch) onSearch({ searchTerm: term, categoryId });
  };

  return (
    <div className="search-box">
      <Form
        onSubmit={handleSubmit}
        role="search"
        className="d-flex align-items-center search-form"
      >
        <Form.Select
  aria-label="Category"
  className="search-category w-auto border-0 flex-shrink-0 backGroung-white"
  
  value={categoryId}
  onChange={(e) => setCategoryId(e.target.value)}
  disabled={loading && categories.length === 0}
>
  <option value="">All categories</option>
  {categories.map((cat) => (
    <option key={cat.id} value={cat.id}>{cat.name}</option>
  ))}
</Form.Select>

<input
  type="search"
  placeholder="Search products..."
  className="me-2 p-2 w-100 border-0 rounded-2 bg-transparent"
  style={{ minWidth: 140 }}
  aria-label="Search"
  enterKeyHint="search"
  autoComplete="off"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
        <Button
          type="submit"
          className="search-button text-white p-2 border-0 ms-auto"
          variant="primary"
        >
          Search
        </Button>
      </Form>
    </div>
  );
};

export default SearchBox;
