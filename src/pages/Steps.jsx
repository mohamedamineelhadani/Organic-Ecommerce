import React from "react";

const Steps = () => {
  return (
    <section className="steps">
      <div className="steps-bg">
        <h2 className="steps-title">
          Steps To Start Your <br /> Products Collection
        </h2>

        <div className="steps-container">
          <div className="steps-card">
            <div className="steps-card-number">01</div>
            <h3 className="steps-card-title">Choose Product</h3>
            <p className="steps-card-description">
              We have many types of fruits and vegetables that you can choose from.
            </p>
          </div>

          <div className="steps-card">
            <div className="steps-card-number">02</div>
            <h3 className="steps-card-title">Place an order</h3>
            <p className="steps-card-description">
              Once your order is set, we move to the next step which is the
              shipping.
            </p>
          </div>

          <div className="steps-card">
            <div className="steps-card-number">03</div>
            <h3 className="steps-card-title">Receive your products</h3>
            <p className="steps-card-description">
              Our delivery process is easy; you receive the products directly to your doorstep.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Steps;
