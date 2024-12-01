import React, { useEffect, useState } from "react";
import CommonSection from "../../shared/CommonSection";
import "./tours.css";
import TourCard from "../../shared/TourCard";
import SearchBar from "../../shared/SearchBar";
import Newsletter from "../../shared/Newsletter";
import { Container, Row, Col } from "reactstrap";
import tourService from "../../services/tourService";
import SortBox from '../../shared/SortBox';

const Tours = () => {
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const TOURS_PER_PAGE = 8;
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const response = await tourService.getAllTours(page, TOURS_PER_PAGE);
        if (response.success) {
          setTours(response.data);
          // Calculate total pages
          const total = response.totalTours || 0;
          setPageCount(Math.ceil(total / TOURS_PER_PAGE));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
    window.scrollTo(0, 0);
  }, [page]);

  const handleSort = (value) => {
    setSortBy(value);
    let sortedTours = [...tours];

    switch (value) {
      case 'price-high':
        sortedTours.sort((a, b) => b.price - a.price);
        break;
      case 'price-low':
        sortedTours.sort((a, b) => a.price - b.price);
        break;
      case 'date-near':
        sortedTours.sort((a, b) => {
          const aDate = a.schedules && a.schedules.length > 0 
            ? new Date(a.schedules[0].departureDate) 
            : new Date(9999, 11, 31);
          const bDate = b.schedules && b.schedules.length > 0 
            ? new Date(b.schedules[0].departureDate) 
            : new Date(9999, 11, 31);
          return aDate - bDate;
        });
        break;
      case 'newest':
        sortedTours.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setTours(sortedTours);
  };

  return (
    <>
      <CommonSection title={"All Tours"} />
      <section>
        <Container>
          <Row>
            <div className="tour__search-container">
              <SearchBar />
              
            </div>
          </Row>
        </Container>
      </section>
      <section className="pt-0">
        <SortBox onSortChange={handleSort} currentSort={sortBy} />
        <Container>
          {loading && <h4 className="text-center pt-5">Loading....</h4>}
          {error && <h4 className="text-center pt-5">{error}</h4>}
          {!loading && !error && (
            <Row>
              {tours?.map((tour) => (
                <Col lg="3" md="6" sm="6" className="mb-4" key={tour._id}>
                  <TourCard tour={tour} />
                </Col>
              ))}

              <Col lg="12">
                <div className="pagination d-flex align-items-center justify-content-center mt-4 gap-3">
                  {[...Array(pageCount).keys()].map((number) => (
                    <span
                      key={number}
                      onClick={() => setPage(number)}
                      className={page === number ? "active__page" : ""}
                    >
                      {number + 1}
                    </span>
                  ))}
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </section>
      <Newsletter />
    </>
  );
};

export default Tours;
