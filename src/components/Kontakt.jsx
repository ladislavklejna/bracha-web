import { useState, useEffect } from "react";
import { Input, Row, Col, Spinner, Alert } from "reactstrap";
import "./Kontakt.css";
import emailjs from "@emailjs/browser";

// kontola pismen
// const validateText = (text) => {
//   // Regulární výraz pro povolená písmena a písmena s diakritikou
//   const textRegex = /^[a-zA-ZáčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ\s]+$/;

//   return textRegex.test(text);
// };

const validateEmail = (email) => {
  // Regulární výraz pro kontrolu platnosti e-mailové adresy
  const Regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return Regex.test(email);
};

const Kontakt = () => {
  // obsah formularu
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [subject, setSubject] = useState("");
  const [mail, setMail] = useState("");
  const [message, setMessage] = useState("");

  // Promenne validity vyplneni formularu
  const [isValidName, setIsValidName] = useState(null);
  const [isValidLName, setIsValidLName] = useState(null);
  const [isValidMail, setIsValidMail] = useState(null);
  const [isValidMessage, setIsValidMessage] = useState(null);

  const [alertMessage, setAlertMessage] = useState("");
  const [visibility, setVisibility] = useState(false);
  const [visibilitySuccess, setVisibilitySuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [disabled, setIsDisabled] = useState(false);

  useEffect(() => {
    emailjs.init({ publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY });
  }, []);

  const handleAlertSuccess = () => {
    setIsDisabled(true);
    setVisibilitySuccess(true);

    setTimeout(() => {
      setVisibilitySuccess(false);
      // Reset formuláře místo reload celé stránky
      setFirstName("");
      setLastName("");
      setSubject("");
      setMail("");
      setMessage("");
      setIsValidName(null);
      setIsValidLName(null);
      setIsValidMail(null);
      setIsValidMessage(null);
      setIsDisabled(false);
    }, 5000);
  };

  const handleAlert = () => {
    setAlertMessage("Vše není řádně vyplněno");
    setVisibility(true);

    setTimeout(() => {
      setVisibility(false);
    }, 5000);
  };
  // validace emailu
  const handleEmailChange = (event) => {
    const emailValue = event.target.value;
    setMail(emailValue);
    setIsValidMail(validateEmail(emailValue));

    if (validateEmail(emailValue)) {
      setIsValidMail(true);
    } else {
      setIsValidMail(false);
    }
  };
  // Podminky zda je formular vyplnen spravne
  const formSubmit = (event) => {
    event.preventDefault();
    // JMENO
    if (firstName.trim() === "") {
      setIsValidName(false);
    } else {
      setIsValidName(true);
    }
    // PRIJMENI
    if (lastName.trim() === "") {
      setIsValidLName(false);
    } else {
      setIsValidLName(true);
    }
    // ZPRAVA
    if (message.trim() === "") {
      setIsValidMessage(false);
    } else {
      setIsValidMessage(true);
    }

    if (!firstName.trim() || !lastName.trim() || isValidMail !== true || !message.trim()) {
      // pokud je jedna z promennych false
      //   console.log("Alespoň jedna z proměnných je `false`.");
      setVisibility(true);
      handleAlert(true);
    } else {
      //pokud jsou vsechny true
      //   console.log("vsechny jsou true");
      setIsLoading(true); // Spustit spinner
      sendEmail();
    }
  };

  // ODESLAT EMAIL
  const sendEmail = () => {
    const emailParams = {
      from_name: firstName + " " + lastName,
      to_name: "ARAPRO",
      subject: subject,
      email: mail,
      message: message,
    };

    emailjs
      //.send( service_id, template_ID)
      .send("service_5j7p9wf", "template_qpoe784", emailParams)
      .then((response) => {
        // console.log("E-mail byl úspěšně odeslán!", response);
        handleAlertSuccess();
      })
      .catch((error) => {
        // console.error("Chyba při odesílání e-mailu:", error);
        handleAlert();
        setAlertMessage(
          <>
            Vaše zpráva nebyla odeslána – chyba kontaktního formuláře.
            <br />
            Prosím kontaktujte nás na e-mailu{" "}
            <a href="mailto:prochazka@arapro.cz">prochazka@arapro.cz</a>.
          </>
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="kontakt-section">
      <h2 className="heading" id="kontakt">
        Kontakt
      </h2>
      <hr className="cara" />

      <Row className="g-0">
        {/* ── Dark info panel ── */}
        <Col md={4}>
          <div className="kontakt-info-panel">
            <h3>Ing. Miroslav Procházka</h3>
            <p className="kontakt-role">Projektant pozemních staveb</p>
            <div className="kontakt-accent-bar" />
            <p className="kontakt-line">
              <a href="tel:+420739658874">+420 739 658 874</a>
            </p>
            <p className="kontakt-line">
              <a href="mailto:prochazka@arapro.cz">prochazka@arapro.cz</a>
            </p>
          </div>
        </Col>

        {/* ── Form panel ── */}
        <Col md={8}>
          <div className="kontakt-form-panel">
            <Row>
              <Col sm={6}>
                <Input
                  type="text"
                  placeholder="Jméno"
                  value={firstName}
                  valid={isValidName === true}
                  invalid={isValidName === false}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Col>
              <Col sm={6} className="margin10 mt-sm-0">
                <Input
                  type="text"
                  placeholder="Příjmení"
                  value={lastName}
                  valid={isValidLName === true}
                  invalid={isValidLName === false}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Col>
            </Row>
            <Input
              className="margin10"
              type="text"
              placeholder="Předmět (nepovinné)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <Input
              className="margin10"
              type="email"
              placeholder="E-mail"
              value={mail}
              valid={isValidMail === true}
              invalid={isValidMail === false}
              onChange={handleEmailChange}
            />
            <Input
              className="margin10"
              type="textarea"
              rows={4}
              placeholder="Zpráva"
              value={message}
              valid={isValidMessage === true}
              invalid={isValidMessage === false}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="btn-submit"
              onClick={formSubmit}
              disabled={isLoading || disabled}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" /> &nbsp;Odesílání…
                </>
              ) : (
                "Odeslat zprávu →"
              )}
            </button>
            <Alert color="danger" isOpen={visibility} className="margin10">
              {alertMessage}
            </Alert>
            <Alert color="success" isOpen={visibilitySuccess} className="margin10">
              Váš dotaz byl úspěšně odeslán!
            </Alert>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default Kontakt;
