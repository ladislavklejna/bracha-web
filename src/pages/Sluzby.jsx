import "./Sluzby.css";

const services = [
  {
    num: "01",
    icon: "S",
    title: "Architektonická studie",
    desc: "Představuje individuální návrh stavebního záměru, který vychází z požadavků budoucích uživatelů a zároveň respektuje omezující limity území. Obsahuje nezbytné informace pro představu budoucí podoby stavby — navržené materiály, půdorysy, řezy, polohu stavby na pozemku, vizualizace, aj.",
    features: [],
  },
  {
    num: "02",
    icon: "D",
    title: "Projektová dokumentace staveb",
    desc: "Tvorba projektových dokumentací pozemních staveb různého charakteru. Nejčastěji projektujeme novostavby rodinných domů, modernizace a rekonstrukce stávajících staveb včetně dokumentace skutečného provedení (pasport stavby). Podrobnost vždy záleží na požadovaném stupni zpracování projektové dokumentace.",
    features: [],
  },
  {
    num: "03",
    icon: "T",
    title: "Povolení, dozor a statika",
    desc: "",
    features: [
      "Pomoc s vyřízením stavebního povolení",
      "Autorský, technický a stavební dozor",
      "Statické posouzení konstrukcí",
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

      <div className="services-grid">
        {services.map((s) => (
          <div className="svc-card" key={s.num}>
            <span className="svc-bg-num" aria-hidden="true">{s.num}</span>

            <div className="svc-header">
              <div className="svc-icon-wrap" aria-hidden="true">{s.icon}</div>
              <span className="svc-num-label">{s.num}</span>
            </div>

            <h3 className="svc-title">{s.title}</h3>
            {s.desc && <p className="svc-desc">{s.desc}</p>}

            {s.features.length > 0 && (
              <ul className="svc-features">
                {s.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Sluzby;
