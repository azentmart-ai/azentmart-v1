import React, { useEffect, useState } from "react";

import {
    FaStar,
    FaQuoteLeft,
    FaChevronLeft,
    FaChevronRight
} from "react-icons/fa";

const testimonials = [

    {
        id: 1,
        name: "Sarah Johnson",
        role: "Software Engineer",
        company: "Google",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 5,
        review:
            "AzentMart transformed my interview preparation. The live transcription and AI-generated answers felt like having a personal interview coach beside me. I landed my dream role after just a few weeks of practice."
    },

    {
        id: 2,
        name: "David Miller",
        role: "Data Engineer",
        company: "Microsoft",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 5,
        review:
            "The AI understood every technical question in real time and suggested structured answers instantly. It dramatically improved my confidence during interviews."
    },

    {
        id: 3,
        name: "Emily Carter",
        role: "Product Manager",
        company: "Amazon",
        image: "https://randomuser.me/api/portraits/women/65.jpg",
        rating: 5,
        review:
            "The interview performance report helped me identify communication gaps and improve quickly. It's one of the most useful AI tools I've used."
    }

];

const TestimonialsSection = () => {

    const [current, setCurrent] = useState(0);

    useEffect(() => {

        const timer = setInterval(() => {

            setCurrent((prev) =>
                prev === testimonials.length - 1 ? 0 : prev + 1
            );

        }, 5000);

        return () => clearInterval(timer);

    }, []);
        const nextSlide = () => {

        setCurrent((prev) =>
            prev === testimonials.length - 1 ? 0 : prev + 1
        );

    };

    const prevSlide = () => {

        setCurrent((prev) =>
            prev === 0 ? testimonials.length - 1 : prev - 1
        );

    };

    const testimonial = testimonials[current];

    return (

<section className="testimonials-section">

<div className="testimonials-container">

<div className="testimonials-header">

<span className="section-badge">

Testimonials

</span>

<h2>

Loved By Professionals Worldwide

</h2>

<p>

Thousands of candidates trust AzentMart AI to prepare for interviews,
boost confidence, and land their dream jobs.

</p>

</div>

<div className="testimonial-card">

<div className="quote-icon">

<FaQuoteLeft />

</div>

<div className="stars">

{

Array.from({ length: testimonial.rating }).map((_, index) => (

<FaStar key={index} />

))

}

</div>

<p className="testimonial-review">

"{testimonial.review}"

</p>

<div className="testimonial-user">

<img

src={testimonial.image}

alt={testimonial.name}

/>

<div>

<h4>

{testimonial.name}

</h4>

<span>

{testimonial.role}

</span>

<p>

{testimonial.company}

</p>

</div>

</div>
</div>
<div className="testimonial-navigation">

    <button
        className="nav-btn"
        onClick={prevSlide}
    >

        <FaChevronLeft />

    </button>

    <div className="testimonial-dots">

        {

            testimonials.map((_, index) => (

                <span

                    key={index}

                    className={
                        current === index
                            ? "dot active"
                            : "dot"
                    }

                    onClick={() => setCurrent(index)}

                />

            ))

        }

    </div>

    <button
        className="nav-btn"
        onClick={nextSlide}
    >

        <FaChevronRight />

    </button>

</div>

</div>

</section>

);

};

export default TestimonialsSection;