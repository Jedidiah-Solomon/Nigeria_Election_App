import React, { useState } from "react";
import axios from "axios";

// List of allowed party names
const ALLOWED_PARTIES = [
  "Adc",
  "Adp",
  "Apc",
  "Apga",
  "Lp",
  "Nnpp",
  "Pdp",
  "Sdp",
  "Ypp",
  "Zlp",
];

// Utility function to convert a string to sentence case
const toSentenceCase = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const GovernorshipElection = () => {
  const [formData, setFormData] = useState({
    electionName: "Governorship",
    state: "",
    candidates: [{ firstName: "", lastName: "", position: "", partyName: "" }],
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: toSentenceCase(value),
    }));
  };

  const handleCandidateChange = (index, e) => {
    const { name, value } = e.target;
    const newCandidates = [...formData.candidates];
    newCandidates[index] = {
      ...newCandidates[index],
      [name]: toSentenceCase(value),
    };
    setFormData((prevData) => ({
      ...prevData,
      candidates: newCandidates,
    }));
  };

  const validatePartyName = (partyName) => {
    return ALLOWED_PARTIES.includes(partyName);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all candidates' party names
    const invalidPartyNames = formData.candidates
      .map((candidate) => candidate.partyName)
      .filter((partyName) => !validatePartyName(partyName));

    if (invalidPartyNames.length > 0) {
      setErrorMessage(
        "Invalid party name(s) entered. Please use one of the allowed party names."
      );
      setSuccessMessage("");
      return;
    }

    try {
      const voterNIN = sessionStorage.getItem("voterNIN");
      if (!voterNIN) {
        throw new Error("Voter NIN is not found in session storage.");
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/governorship-elections/create`,
        { ...formData, voterNIN }
      );
      console.log("Election created successfully:", response.data);

      // Set success message
      setSuccessMessage("Voting successful!");
      setErrorMessage("");

      // Clear success message after 10 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 10000);

      // Reset the form after successful submission
      setFormData({
        electionName: "Governorship",
        state: "",
        candidates: [
          { firstName: "", lastName: "", position: "", partyName: "" },
        ],
      });
    } catch (error) {
      console.error("Error creating election:", error);
      // Set error message
      setErrorMessage(error.response?.data?.message || error.message);
      setSuccessMessage("");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Governorship Election
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="hidden"
          name="electionName"
          value={formData.electionName}
        />

        <label className="block text-lg font-medium text-gray-700">
          Select State:
          <select
            name="state"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            value={formData.state}
            onChange={handleFormChange}
            required
          >
            <option value="" disabled>
              Choose a state
            </option>
            <option value="Lagos">Lagos</option>
            <option value="Rivers">Rivers</option>
            {/* Add more states as needed */}
          </select>
        </label>

        {formData.candidates.map((candidate, index) => (
          <div key={index} className="space-y-2">
            <label className="block text-lg font-medium text-gray-700">
              First Name:
              <input
                type="text"
                name="firstName"
                placeholder="Enter contestant's first name"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                value={candidate.firstName}
                onChange={(e) => handleCandidateChange(index, e)}
                required
              />
            </label>
            <label className="block text-lg font-medium text-gray-700">
              Last Name:
              <input
                type="text"
                name="lastName"
                placeholder="Enter contestant's last name"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                value={candidate.lastName}
                onChange={(e) => handleCandidateChange(index, e)}
                required
              />
            </label>
            <label className="block text-lg font-medium text-gray-700">
              Position:
              <input
                type="text"
                name="position"
                placeholder="Governor"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                value={candidate.position}
                onChange={(e) => handleCandidateChange(index, e)}
                required
              />
            </label>
            <label className="block text-lg font-medium text-gray-700">
              Party Name:
              <input
                type="text"
                name="partyName"
                placeholder="e.g PDP, APC"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                value={candidate.partyName}
                onChange={(e) => handleCandidateChange(index, e)}
                required
              />
            </label>
          </div>
        ))}

        <button
          type="submit"
          className="bg-customGreen-dark text-white py-2 px-4 rounded"
        >
          Submit Vote
        </button>
      </form>

      {/* Conditionally render the success message */}
      {successMessage && (
        <p className="mt-4 text-green-600 font-semibold text-center">
          {successMessage}
        </p>
      )}

      {/* Conditionally render the error message */}
      {errorMessage && (
        <p className="mt-4 text-red-600 font-semibold text-center">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default GovernorshipElection;
