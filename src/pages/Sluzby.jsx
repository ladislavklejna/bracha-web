import { FiCompass, FiLayers, FiClipboard, FiEye } from "react-icons/fi";
import "./Sluzby.css";

const services = [
  {
    num: "01",
    icon: <FiCompass />,
    title: "Architektonická studie",
    desc: "Váš záměr přetavíme do konkrétní podoby ještě před zahájením projektu. Studie prověří prostorové možnosti pozemku a navrhne optimální řešení šité na míru vašim požadavkům.",
    features: [
      "Hmotová a dispoziční studie",
      "Vizualizace exteriéru a interiéru",
      "Konzultace s budoucím uživatelem",
      "Podklady pro cenovou kalkulaci",
    ],
  },
  {
    num: "02",
    icon: <FiLayers />,
    title: "Projektová dokumentace",
    desc: "Kompletní projektová dokumentace ve stupni odpovídajícím vašim potřebám — od záměru přes územní řízení až po dokumentaci pro provádění stavby.",
    features: [
      "DUR, DSP, DPS, DSPS",
      "Novostavby i rekonstrukce",
      "Pasport stavby (skutečné provedení)",
      "Koordinace profesí TZB a statiky",
    ],
  },
  {
    num: "03",
    icon: <FiClipboard />,
    title: "Stavební povolení",
    desc: "Orientujeme se v předpisech a zajistíme hladký průchod žádosti stavebním úřadem. Postaráme se o veškerou administrativu, abyste se mohli soustředit na svůj záměr.",
    features: [
      "Průzkum podmínek územního plánu",
      "Kompletní administrativní podpora",
      "Komunikace se stavebním úřadem",
      "Koordinace dotčených orgánů",
    ],
  },
  {
    num: "04",
    icon: <FiEye />,
    title: "Dozor a konzultace",
    desc: "Hlídáme soulad stavby s projektem a chráníme vaše zájmy na staveništi. Jsme vaším nezávislým odborným pohledem po celou dobu realizace.",
    features: [
      "Autorský dozor projektanta",
      "Technický dozor stavebníka",
      "Statické posouzení konstrukcí",
      "Odborné konzultace kdykoliv",
    ],
  },
];

const Sluzby = () => {
  return (
    <section className="sluzby-section">
      <h2 id="sluzby" className="heading">
        Služby
      </h2>
      <hr className="cara sluzby-cara" />
      <p className="sluzby-intro">
        Kompletní projekční servis od první skici až po klíče v ruce.
      </p>

      <div className="services-grid">
        {services.map((s) => (
          <div className="svc-card" key={s.num}>
            <span className="svc-bg-num">{s.num}</span>

            <div className="svc-header">
              <div className="svc-icon-wrap">{s.icon}</div>
              <span className="svc-num-label">{s.num}</span>
            </div>

            <h3 className="svc-title">{s.title}</h3>
            <p className="svc-desc">{s.desc}</p>

            <ul className="svc-features">
              {s.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Sluzby;
