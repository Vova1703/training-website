function Morphology() {
  return (
    <main className="container px-4 py-4">
      <article>
        <section>
          <h3 className="h3 text-success">Зовнішній вигляд</h3>
          <p>Рись — це хижий ссавець із родини котових, відомий своїм гострим зором і спритністю. Вона має густе хутро, яке змінюється залежно від пори року.</p>
        </section>
        <section>
          <h3 className="h3 text-success">Особливості будови</h3>
          <ul>
            <li>Рись має компактне м’язисте тіло (55–70 см), короткий хвіст (8–12 см) і важить 4–10 кг.</li>
            <li>Гострий зір – рись може помічати дрібну здобич на великій відстані, навіть у сутінках</li>
            <li>Забарвлення – жовтувато-коричневе з темними плямами, що допомагає зливатися з довкіллям</li>
          </ul>
        </section>
        <figure className="text-center">
          <img src="https://surl.li/ngskfv" alt="Рисі на лузі" className="img-fluid rounded my-4"/>
          <figcaption className="text-muted">Молодий рись</figcaption>
        </figure>
      </article>
    </main>
  );
}

export default Morphology;