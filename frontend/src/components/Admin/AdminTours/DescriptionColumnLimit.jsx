import React, { useState } from "react";

const MAX_DESCRIPTION_LENGTH = 100; // Số ký tự tối đa

const DescriptionColumn = ({ description }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleShowFullDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const displayDescription = showFullDescription
    ? description
    : `${description.slice(0, MAX_DESCRIPTION_LENGTH)}${
        description.length > MAX_DESCRIPTION_LENGTH ? "..." : ""
      }`;

  return (
    <div>
      <p>{displayDescription}</p>
      {description.length > MAX_DESCRIPTION_LENGTH && (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            toggleShowFullDescription();
          }}
          style={{ color: "blue", cursor: "pointer" }}
        >
          {showFullDescription ? "Hide" : "Click Here to Show All"}
        </a>
      )}
    </div>
  );
};

export default DescriptionColumn;
