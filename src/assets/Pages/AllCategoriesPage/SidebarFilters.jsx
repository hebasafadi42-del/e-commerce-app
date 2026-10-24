import { Col, Row } from "react-bootstrap";
import FilterSection from "./FilterSection";
import { useState } from "react";
import { Form } from "react-bootstrap";
import RatingsFilter from "./RatingsFilter";
import CategoryDropdown from "../../components/Header/CategoryDropdown";
import useCategories from "../../Hooks/useCategories";

import PriceRangeFilter from "./PriceRangeFilter";

const SideBar = ({ setFilters }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  // const [selectedBrands, setSelectedBrands] = useState([]);
  // const [selectedFeatures, setSelectedFeatures] = useState([]);
  // const [selectedCondition, setSelectedCondition] = useState("Any");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 99999 });
  const { categories } = useCategories();

  // const brands = ["Apple", "Samsung", "Xiaomi", "Poco", "Realme", "Sony"];

  // const features = [
  //   "Metallic",
  //   "Plastic cover",
  //   "8GB Ram",
  //   "Super power",
  //   "Large Memory",
  // ];

  // const conditions = ["Any", "Refurbished", "Brand new", "Old items"];

  const handleCategoryClick = (cat) => {
    const newId = activeCategory === cat.id ? null : cat.id;
    setActiveCategory(newId);
    if (setFilters) setFilters((prev) => ({ ...prev, categoryId: newId }));
  };

  // const handleBrandChange = (brand) => {
  //   const updated = selectedBrands.includes(brand)
  //     ? selectedBrands.filter((br) => br !== brand)
  //     : [...selectedBrands, brand];

  //   setSelectedBrands(updated);
  //   if (setFilters) setFilters((prev) => ({ ...prev, brands: updated }));
  // };

  // const handleFeaturesChange = (Feature) => {
  //   const updated = selectedFeatures.includes(Feature)
  //     ? selectedFeatures.filter((featu) => featu !== Feature)
  //     : [...selectedFeatures, Feature];

  //   setSelectedFeatures(updated);
  //   if (setFilters) setFilters((prev) => ({ ...prev, Features: updated }));
  // };

  // const handleConditionChange = (condition) => {
  //   setSelectedCondition(condition);
  //   if (setFilters) {
  //     setFilters((prev) => ({ ...prev, condition }));
  //   }
  // };

  const handlePriceApply = (range) => {
    setPriceRange(range);
    if (setFilters) {
      setFilters((prev) => ({ ...prev, priceRange: range }));
    }
  };

  // const [selectedRatings, setSelectedRatings] = useState([]);

  // const handleRatingChange = (ratings) => {
  //   setSelectedRatings(ratings);
  //   if (setFilters) {
  //     setFilters((prev) => ({ ...prev, ratings }));
  //   }
  // };

  console.log("Current Filters State:", {
    activeCategory,
    // selectedBrands,
    // selectedFeatures,
    // selectedCondition,
    priceRange,
    // selectedRatings,
  });

  return (
    <>
      <Row>
        <Col xs={6} sm={6} md={12} lg={12}>
          <div className=" border-top my-4 ">
            <FilterSection
              title="Category"
              items={categories}
              renderItem={(cat) => (
                <li
                  key={cat.id}
                  style={{
                    cursor: "pointer",
                    color: activeCategory === cat.id ? "#F0345D" : "#6c757d",
                    fontWeight: activeCategory === cat.id ? "500" : "normal",
                  }}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat.name}
                </li>
              )}
            />
          </div>
        </Col>
        {/* <Col xs={6} sm={6} md={12} lg={12}>
          <div className="border-top my-4">
            <FilterSection
              title="Brands"
              items={brands}
              renderItem={(brand, index) => (
                <li key={index} className="py-1 check-box-style">
                  <Form.Check
                    type="checkbox"
                    id={`brand-check-${index}`}
                    label={brand}
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                    className="text-secondary fs-6"
                    style={{ cursor: "pointer" }}
                  />
                </li>
              )}
            />
          </div>
        </Col> */}
        {/* <Col xs={6} sm={6} md={12} lg={12}>
          <div className="border-top my-4 ">
            <FilterSection
              title="Features"
              items={features}
              renderItem={(Feature, index) => (
                <li key={index} className="py-1 check-box-style">
                  <Form.Check
                    type="checkbox"
                    id={`Feature-check-${index}`}
                    label={Feature}
                    checked={selectedFeatures.includes(Feature)}
                    onChange={() => handleFeaturesChange(Feature)}
                    className="text-secondary fs-6"
                    style={{ cursor: "pointer" }}
                  />
                </li>
              )}
            />
          </div>
        </Col> */}
        <Col xs={6} sm={6} md={12} lg={12}>
          <div className="border-top my-4">
            <FilterSection title="Price range">
              <PriceRangeFilter onApplyPrice={handlePriceApply} />
            </FilterSection>
          </div>
        </Col>
        {/* <Col xs={6} sm={6} md={12} lg={12}>
          <div className="border-top my-4 ">
            <FilterSection
              title="Condition"
              items={conditions}
              renderItem={(cond, index) => (
                <li key={index} className="py-1">
                  <Form.Check
                    type="radio"
                    name="condition-group"
                    id={`condition-radio-${index}`}
                    label={cond}
                    checked={selectedCondition === cond}
                    onChange={() => handleConditionChange(cond)}
                    className="text-secondary fs-6"
                    style={{ cursor: "pointer" }}
                  />
                </li>
              )}
            />
          </div>
        </Col> */}
        {/* <Col xs={6} sm={6} md={12} lg={12}>
          <div className="border-top my-3 ">
            <FilterSection title="Ratings">
              <RatingsFilter onRatingChange={handleRatingChange} />
            </FilterSection>
          </div>
        </Col> */}
      </Row>
    </>
  );
};

export default SideBar;
