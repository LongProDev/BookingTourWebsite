import React, { useRef } from "react";
import "./search-bar.css";
import { Col, Form, FormGroup } from "reactstrap";

import { BASE_URL } from "../utils/config.js";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const locationRef = useRef("");
  const startLocationRef = useRef("");
  const priceRef = useRef(0);
  const navigate = useNavigate();

  const searchHandler = async () => {
    const location = locationRef.current.value;
    const startLocation = startLocationRef.current.value;
    const price = priceRef.current.value;

    if (location === "" && startLocation === "" && price === "") {
      return alert("Please fill at least one field!");
    }

    try {
      const res = await fetch(
        `${BASE_URL}/tours/search/getTourBySearch?location=${location}&startLocation=${startLocation}&price=${price}`
      );

      if (!res.ok) {
        alert("Something went wrong");
        return;
      }

      const result = await res.json();
      navigate(
        `/tours/search?location=${location}&startLocation=${startLocation}&price=${price}`,
        { state: result.data }
      );
    } catch (err) {
      alert("Something went wrong: " + err.message);
    }
  };

  return (
    <Col lg="12">
      <div className="search_bar">
        <Form className="d-flex flex-column flex-sm-row align-items-center gap-4">
          <FormGroup className="d-flex gap-3 form__group form__group-fast">
            <span><i className="ri-map-pin-line"></i></span>
            <div>
              <h6>Start Location</h6>
              <input type="text" placeholder="From where?" ref={startLocationRef} />
            </div>
          </FormGroup>
          <FormGroup className="d-flex gap-3 form__group form__group-fast">
            <span><i className="ri-map-pin-line"></i></span>
            <div>
              <h6>Location</h6>
              <input type="text" placeholder="Where to?" ref={locationRef} />
            </div>
          </FormGroup>
          <FormGroup className="d-flex gap-3 form__group form__group-last">
            <span><i className="ri-money-dollar-circle-line"></i></span>
            <div>
              <h6>Max Price</h6>
              <input type="number" placeholder="0" ref={priceRef} />
            </div>
          </FormGroup>
          <span className="search__icon" type="submit" onClick={searchHandler}>
            <i className="ri-search-line"></i>
          </span>
        </Form>
      </div>
    </Col>
  );
};


export default SearchBar;
