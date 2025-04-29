import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Photo() {
  const images = [
    { src: "https://s3.animalia.bio/animals/photos/full/original/iberian-lynx-endrino05jpg.webp", alt: 'Рисі в траві' },
    { src: "https://s3.animalia.bio/animals/photos/full/original/iberian-lynx-endrino03jpg.webp", alt: 'Рисі в полі' },
    { src: "https://s3.animalia.bio/animals/photos/full/original/eurasian-lynx-in-winter-coat.webp", alt: 'Європейський заєць' },
    { src: "https://s3.animalia.bio/animals/photos/full/original/bavarian-forest-national-park-lynx-14.webp", alt: 'Рисі в лісі' },
    { src: "https://s3.animalia.bio/animals/photos/full/original/eurasian-lynx-lynx-lynxjpegjpeg.webp", alt: 'Молодий рись' },
    { src: "https://s3.animalia.bio/animals/photos/full/original/male-lynx-lynx-resting-in-treejpg.webp", alt: 'Рись на дереві' }
  ];

  return (
    <main className="container px-4 py-4 flex-grow-1">
      <article>
        <h2 className="h2 text-success mb-4">Фотогалерея Рисів</h2>
        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-current={index === 0 ? "true" : "false"}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>
          <div className="carousel-inner">
            {images.map((image, index) => (
              <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                <a href={image.src} target="_blank" rel="noopener noreferrer">
                  <img src={image.src} className="d-block w-100" alt={image.alt} />
                </a>
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </article>
    </main>
  );
}

export default Photo;