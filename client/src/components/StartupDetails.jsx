import React from "react";

import "../styles/StartupDetails.css";

import { useParams, useNavigate } from "react-router-dom";
import {
  BiArrowBack,
  BiGlobe,
  BiRocket,
  BiDollarCircle,
  BiCheckShield,
  BiMap,
} from "react-icons/bi";

function StartupDetails({ startups }) {
  const { id } = useParams(); //Grabing the id from the url
  const navigate = useNavigate();

  const startup = startups.find((startup) => startup.id == id); //important to use == instead of === in case tgat te ID is a string in the url but a number in a data

  if (!startup) {
    return (
      <div className="loader-div">
        <p>Loading startup intelligence...</p>
        <button onClick={() => navigate("/list")} className="reset-btn-simple">
          Back to List
        </button>
      </div>
    );
  }
}

export default StartupDetails;
