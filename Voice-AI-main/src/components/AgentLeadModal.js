import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AgentLeadModal({ agent, closeModal }) {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    company: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* VALIDATION */

  const validate = () => {

    const nameRegex = /^[A-Za-z ]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(form.name)) {
      alert("Name should contain letters only");
      return false;
    }

    if (!phoneRegex.test(form.phone)) {
      alert("Phone number must be 10 digits");
      return false;
    }

    if (!emailRegex.test(form.email)) {
      alert("Invalid email address");
      return false;
    }

    return true;
  };

  /* SUBMIT */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {

      await fetch("/save_lead.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...form,
          agent
        })
      });

      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        navigate(`/marketplace/${agent}`);
      }, 1500);

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
      setLoading(false);
    }

  };

  return (

    <div className="lead-overlay">

      <div className="lead-modal">

        {!success ? (

          <>
            <h2>Access Agent</h2>

            <p className="lead-subtitle">
              Enter your details to continue
            </p>

            <form onSubmit={handleSubmit}>

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="company"
                placeholder="Company Name"
                value={form.company}
                onChange={handleChange}
                required
              />

              {/* BUTTONS */}

              <div className="lead-buttons">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Continue"}
                </button>

              </div>

            </form>

          </>

        ) : (

          <div className="success-message">
            ✅ Details submitted successfully!
          </div>

        )}

      </div>

    </div>

  );
}

export default AgentLeadModal;