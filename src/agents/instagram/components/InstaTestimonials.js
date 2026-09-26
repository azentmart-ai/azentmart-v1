import React from "react";

export default function InstaTestimonials() {
  const testimonials = [
    {
      name: "Aarav Mehta",
      role: "E-commerce Founder",
      text: "Our Instagram replies are now instant. We saw a 40% increase in conversions within weeks!",
    },
    {
      name: "Sneha Kapoor",
      role: "Fashion Brand Owner",
      text: "This agent handles all DMs automatically. I barely open Instagram now 😄",
    },
    {
      name: "Rahul Sharma",
      role: "Digital Marketer",
      text: "Lead capture through DMs is insane. It feels like having a 24/7 sales team.",
    },
    {
      name: "Priya Nair",
      role: "Coach & Creator",
      text: "My audience engagement doubled. Replies are fast, smart, and natural.",
    },
    {
      name: "Karan Verma",
      role: "Startup Founder",
      text: "We automated FAQs, bookings, and product queries — saves hours daily!",
    },
    {
      name: "Ananya Reddy",
      role: "Influencer",
      text: "Finally something that actually converts followers into customers 💜",
    },
  ];

  return (
    <section className="insta-testimonials">
      <div className="container">

        {/* HEADING */}
        <h2>
          Loved by <span>Instagram Businesses</span>
        </h2>

        {/* GRID */}
        <div className="row g-4 mt-4">
          {testimonials.map((t, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div className="testimonial-card">

                <div className="quote">“</div>

                <p>{t.text}</p>

                <div className="user">
                  <div className="avatar"></div>
                  <div>
                    <h5>{t.name}</h5>
                    <span>{t.role}</span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}