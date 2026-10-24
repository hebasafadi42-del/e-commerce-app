import { useState } from "react";
import { NavDropdown } from "react-bootstrap";
import { NavLink } from "react-router";
import useCategories from "../../Hooks/useCategories";


const CategoryDropdown = () => {
  const [selectedItem, setSelectedItem] = useState("All Categories");
  const { categories} = useCategories();

  return (
    <>
      <NavDropdown
        title={selectedItem}
        id="basic-nav-dropdown"
        className="no-caret-dropdown fw-semibold"
      >
        <NavDropdown.Item
          as={NavLink}
          to="/product-categories"
          onClick={() => setSelectedTitle("All category")}
        >
          All category
        </NavDropdown.Item>
        {categories.map((item) => (
          <NavDropdown.Item
            key={item.id}
            as={NavLink}
            to="/product-categories"
            onClick={() => setSelectedItem(item.name)}
          >
            {item.name}
          </NavDropdown.Item>
        ))}
      </NavDropdown>
    </>
  );
};

export default CategoryDropdown;
