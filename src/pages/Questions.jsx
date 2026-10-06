import React, { useState } from "react";
import { Plus } from "lucide-react";
const Questions = () => {
  const data = [
    {
      id: 1,
      question: "What does 'certified organic' mean?",
      answer:
        "Our products meet strict USDA standards: grown without synthetic pesticides, GMOs, or chemical fertilizers. Farms are inspected annually, ensuring sustainable practices from soil to shelf. It's a verified commitment to purity and transparency.",
    },
    {
      id: 2,
      question: "How fresh is your produce?",
      answer:
        "Harvested at peak ripeness and delivered within 24-48 hours. We use temperature-controlled delivery and never use artificial ripening agents. Most items are picked just 1-2 days before reaching you—fresher than any grocery store.",
    },
    {
      id: 3,
      question: "Why are your prices competitive?",
      answer:
        "By partnering directly with farmers, we eliminate middlemen—you get better prices while farmers earn fair wages. Our subscription plans save up to 30%, and higher nutrient density means better value for your health.",
    },
    {
      id: 4,
      question: "What's your return policy?",
      answer:
        "100% satisfaction guarantee with 'No Questions Asked' returns within 7 days. We offer full refunds or replacements and even pick up unwanted items for composting. Subscription boxes can be modified or canceled anytime.",
    },
    {
      id: 5,
      question: "Do you deliver sustainably?",
      answer:
        "Yes! Carbon-neutral delivery in reusable, insulated totes with compostable liners. We use electric vehicles and offset emissions through reforestation. Choose from next-day, express, or free weekly subscription delivery.",
    },
    {
      id: 6,
      question: "How should I store organic produce?",
      answer:
        "Keep tomatoes/potatoes at room temperature. Refrigerate greens in airtight containers. Don't wash berries until eating. Store herbs in water. We include storage cards with every order and offer digital guides with preservation tips!",
    },
  ];

  const [expandedItems, setExpandedItems] = useState([]);

  const toggleQuestions = (itemId) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((item) => item !== itemId)
        : [...prev, itemId]
    );
  };

  const isItemExpanded = (itemId) => {
    return expandedItems.includes(itemId);
  };

  return (
    <section className="questions" id="faqs">
      <h2 className="questions-title">
        Some common questions <br /> were often asked
      </h2>

      <div className="questions-container">
        {data.map((q) => (
          <div
            className={`questions-item ${isItemExpanded(q.id) ? "active" : ""}`}
            key={q.id}
          >
            <header className="questions-header">
              <button
                className="question-toggle"
                onClick={() => toggleQuestions(q.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && toggleQuestions(q.id)}
              >
                <Plus className="icon" />
              </button>

              <h3 className="questions-item-title">
                {q.id} : {q.question}
              </h3>
            </header>

            <div className="questions-content">
              <p className="questions-description">{q.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Questions;
