import React from "react";

export default function FBTestimonials() {
  const testimonials = [
    {
      name: "Rakesh Shetty",
      role: "Gym Owner",
      text: "People comment on my posts and instantly get details in Messenger. My membership inquiries doubled.",
    },
    {
      name: "Tanvi Desai",
      role: "Home Bakery",
      text: "Now every Facebook message gets an instant reply with menu and pricing. Customers love the quick response.",
    },
    {
      name: "Imran Khan",
      role: "Car Dealer",
      text: "All my car inquiries from Facebook now come directly into inbox with proper details. Saves a lot of time.",
    },
    {
      name: "Lavanya Krishnan",
      role: "Online Tutor",
      text: "Students who comment on my posts automatically get course info in Messenger. Super smooth experience.",
    },
    {
      name: "Harshit Bansal",
      role: "E-commerce Seller",
      text: "Handling product queries manually was hectic. Now everything is automated and conversions improved.",
    },
    {
      name: "Neeraj Gupta",
      role: "Digital Agency",
      text: "We use this for multiple clients. Engagement and lead flow from Facebook improved consistently.",
    },
  ];

  return (
    <section className="fb-testimonials">
      <div className="container">

        {/* HEADING */}
        <h2>
          Loved by <span>Facebook Businesses</span>
        </h2>

        {/* GRID */}
        <div className="row g-4 mt-4">
          {testimonials.map((t, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div className="fb-testimonial-card">

                <div className="fb-quote">“</div>

                <p>{t.text}</p>

                <div className="fb-user">
                  <div className="fb-avatar"></div>
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