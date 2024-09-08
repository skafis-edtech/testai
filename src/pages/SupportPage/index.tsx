const SupportPage: React.FC = () => {
  return (
    <div className="view-page-container">
      <h1>Prisidėk</h1>
      <div className="text-center text-xl flex flex-col gap-4">
        <h3>Kuriant šį tinklapį buvo įdėta daug darbo...</h3>
        <h3>
          Ir bus įdėta dar daugiau! Vardan kokybiško švietimo ir kokybiškų jame
          naudojamų technologijų.
        </h3>
        <h3>
          Šis projektas yra nekomercinis, nesiekiantis pelno. Prisidėti galite
          programos kodu, idėjomis, bendradarbiavimu arba, paprasčiausiai,
          pinigais. Ačiū labai!
        </h3>
        <h1 className="mt-8">MB SKAFIS LT737300010188621353</h1>
        <h1 className="mb-8">
          Pervedimo paskirtis: testai.skafis.lt savanoriška parama + Jūsų žinutė
        </h1>
        <h3>
          Tinklapio kodas:{" "}
          <a href="https://github.com/naglissul/testai-skafis" target="_blank">
            https://github.com/naglissul/testai-skafis
          </a>
        </h3>
      </div>
    </div>
  );
};

export default SupportPage;
