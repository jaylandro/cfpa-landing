const paymentForm = new SqPaymentForm({
  //TODO: Replace with your sandbox application ID
  applicationId: "sq0idp-5rZb-kKv0uPBJw0vP4rNIg",
  inputClass: "sq-input",
  autoBuild: false,
  inputStyles: [
    {
      fontSize: "16px",
      lineHeight: "24px",
      padding: "16px",
      placeholderColor: "#a0a0a0",
      backgroundColor: "transparent"
    }
  ],
  cardNumber: {
    elementId: "sq-card-number",
    placeholder: "Card Number"
  },
  cvv: {
    elementId: "sq-cvv",
    placeholder: "CVV"
  },
  expirationDate: {
    elementId: "sq-expiration-date",
    placeholder: "MM/YY"
  },
  postalCode: {
    elementId: "sq-postal-code",
    placeholder: "Postal"
  },
  callbacks: {
    /*
     * callback function: cardNonceResponseReceived
     * Triggered when: SqPaymentForm completes a card nonce request
     */
    cardNonceResponseReceived: function(errors, nonce, cardData) {
      if (errors) {
        // Log errors from nonce generation to the browser developer console.
        console.error("Encountered errors:");
        errors.forEach(function(error) {
          console.error("  " + error.message);
        });
        alert(
          "Encountered errors, check browser developer console for more details"
        );
        return;
      }
      var amount = document.getElementById("sq-amount").value;

      fetch("https://cfpa-landing.netlify.com/.netlify/functions/process-payment", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nonce: nonce,
          amount: amount
        })
      })
        .catch(err => {
          alert("Network error: " + err);
        })
        .then(response => {
          if (!response.ok) {
            return response.text().then(errorInfo => Promise.reject(errorInfo));
          }
          return response.text();
        })
        .then(data => {
          console.log(JSON.stringify(data));
          window.location.href = "/thank-you.html"
          // alert(
          //   "Payment complete successfully!\n Thank you for your Donation."
          // );
        })
        .catch(err => {
          console.error(err);
          alert(
            "Payment failed to complete!\nCheck browser developer console for more details"
          );
        });
    }
  }
});
paymentForm.build();

function onGetCardNonce(event) {
  event.preventDefault();
  paymentForm.requestCardNonce();
}
