import { useState } from "react";
import { Button, Container, Input, Row, Col, Spinner, Alert } from "reactstrap";
import "./Kontakt.css";
import emailjs from "emailjs-com";

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

  //                                                        EMAIL INIT API KEY
  
  //                                                        EMAIL INIT API KEY
  const refreshPage = () => {
    // Obnovit stránku
    window.location.reload();
  };
  const handleAlertSuccess = () => {
    setIsDisabled(true);
    setVisibilitySuccess(true);

    setTimeout(() => {
      setVisibilitySuccess(false);
      refreshPage();
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

    if (!firstName || !lastName || !isValidMail || !message) {
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
      
      .then((response) => {
        // console.log("E-mail byl úspěšně odeslán!", response);
        handleAlertSuccess();
      })
      .catch((error) => {
        // console.error("Chyba při odesílání e-mailu:", error);
        handleAlert();
        setAlertMessage(
          "Vaše zpráva nebyla odeslána - chyba kontaktního formuláře"
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="gray">
      <h2 className="heading" id="kontakt">
        Kontakt
      </h2>

      <hr className="cara" />
      <Container>
        <Row>
          <Col sm={0} md={1}></Col>
          <Col md={4}>
            <p>Ing. Miroslav Procházka</p>
            <br />
            <p>
              M:{" "}
              <a href="tel:739658874" className="linknormal">
                739 658 874
              </a>
            </p>
            <p>
              E:{" "}
              <a href="mailto:prochazka@arapro.cz" className="linknormal">
                prochazka@arapro.cz
              </a>
            </p>
          </Col>
          <Col md={6}>
            <Row>
              <Col>
                <form className="margin10" onSubmit={formSubmit}>
                  <Input
                    type="text"
                    placeholder="Jméno"
                    value={firstName}
                    valid={isValidName === true}
                    invalid={isValidName === false}
                    onChange={(event) => setFirstName(event.target.value)}
                  ></Input>
                </form>
              </Col>
              <Col>
                <form className="margin10" onSubmit={formSubmit}>
                  <Input
                    type="text"
                    placeholder="Příjmení"
                    value={lastName}
                    valid={isValidLName === true}
                    invalid={isValidLName === false}
                    onChange={(event) => setLastName(event.target.value)}
                  ></Input>
                </form>
              </Col>
            </Row>
            <Input
              className="margin10"
              type="text"
              placeholder="Předmět (nepovinné)"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
            ></Input>
            <Input
              className="margin10"
              type="email"
              placeholder="E-mail"
              value={mail}
              valid={isValidMail === true}
              invalid={isValidMail === false}
              onChange={handleEmailChange}
            ></Input>
            <Input
              className="margin10"
              type="textarea"
              placeholder="Zpráva"
              value={message}
              valid={isValidMessage === true}
              invalid={isValidMessage === false}
              onChange={(event) => setMessage(event.target.value)}
            ></Input>
            <Button
              className="margin10 yellow"
              type="submit"
              onClick={formSubmit}
              disabled={(isLoading, disabled)}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" /> Odesílání...
                </>
              ) : (
                "Odeslat"
              )}
            </Button>
            <Alert color="danger" isOpen={visibility}>
              {alertMessage}
            </Alert>
            <Alert color="success" isOpen={visibilitySuccess}>
              Váš dotaz byl úspěšně odeslán !
            </Alert>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default Kontakt;
