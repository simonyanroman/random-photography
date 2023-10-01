import { useEffect, useState } from "react";

const navigationItems = [
  { title: "Gallery 1", link: "#", isActive: true, id: 0 },
  { title: "Gallery 2", link: "#", isActive: false, id: 1 },
  { title: "Gallery 3", link: "#", isActive: false, id: 2 },
  { title: "Gallery 4", link: "#", isActive: false, id: 3 },
];

function seed() {
  return Math.floor(Math.random() * 100000);
}

let galleryItems0 = new Array(9).fill(null).map(() => ({
  author: "",
  id: "",
  seed: seed(),
  whidth: 600,
  height: 400,
}));

let galleryItems1 = new Array(9).fill(null).map(() => ({
  author: "",
  id: "",
  seed: seed(),
  whidth: 600,
  height: 400,
}));

let galleryItems2 = new Array(9).fill(null).map(() => ({
  author: "",
  id: "",
  seed: seed(),
  whidth: 600,
  height: 400,
}));

let galleryItems3 = new Array(9).fill(null).map(() => ({
  author: "",
  id: "",
  seed: seed(),
  whidth: 600,
  height: 400,
}));

export default function App() {
  const [currentPage, setCurrentPage] = useState(0);

  const galleryItemsArrays = [galleryItems0, galleryItems1, galleryItems2, galleryItems3];

  return (
    <>
      <Header>
        {/* <Logo /> */}
        <Title />
      </Header>
      <Navigation
        currentPage={currentPage}
        onSetPage={setCurrentPage}
      />
      <Gallery
        currentPage={currentPage}
        galleryItemsArrays={galleryItemsArrays}
      />
      <Footer />
    </>
  );
}

function Header({ children }) {
  return <header>{children}</header>;
}

function Logo() {
  return (
    <img
      src='https://place-hold.it/120x60.png'
      alt='Logo'
    />
  );
}

function Title() {
  return <h1>Random Photography</h1>;
}

function Navigation({ currentPage, onSetPage }) {
  return (
    <nav>
      <ul>
        {navigationItems.map((navigationItem, id) => (
          <NavigationItem
            navigationItem={navigationItem}
            key={id}
            currentPage={currentPage}
            onSetPage={onSetPage}
          />
        ))}
      </ul>
    </nav>
  );
}

function NavigationItem({ navigationItem, onSetPage, currentPage }) {
  function setPage() {
    navigationItems[currentPage].isActive = false;
    navigationItem.isActive = true;
    onSetPage(navigationItem.id);
  }

  return (
    <li>
      {navigationItem.isActive ? (
        <span className='current-page'>{navigationItem.title}</span>
      ) : (
        <a
          href={navigationItem.link}
          onClick={setPage}
        >
          {navigationItem.title}
        </a>
      )}
    </li>
  );
}

function Gallery({ currentPage, galleryItemsArrays }) {
  const activeGallery = galleryItemsArrays[currentPage];

  return (
    <main>
      {activeGallery.map((galleryItem, id) => (
        <GalleryItem
          galleryItem={galleryItem}
          key={id}
          currentPage={currentPage}
        />
      ))}
    </main>
  );
}

function GalleryItem({ galleryItem, currentPage }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchImage() {
        try {
          setIsLoading(true);
          setError("");
          const response = await fetch(
            `https://picsum.photos/seed/${galleryItem.seed}/info`,
            {
              sugnal: controller.signal,
            }
          );

          if (!response.ok) throw new Error("Something went wrong with fetching data.");

          const data = await response.json();
          if (data.Response === "False") throw new Error("Data not found.");

          galleryItem.id = data.id;
          galleryItem.author = data.author;
        } catch (error) {
          if (error.name !== "AbortError") setError(error.message);
        } finally {
          setIsLoading(false);
        }
      }

      fetchImage();

      return function () {
        controller.abort();
      };
    },
    [galleryItem, error, isLoading]
  );

  return (
    <div
      className='image-thumbnail'
      key={currentPage}
    >
      {galleryItem.id ? (
        <img
          src={`https://picsum.photos/id/${galleryItem.id}/${galleryItem.whidth}/${galleryItem.height}`}
          alt={`Captured by ${galleryItem.author}`}
        />
      ) : (
        <p>Loading...</p>
      )}

      <div className='image-caption'>
        {galleryItem.author ? (
          <p className='caption-title'>{galleryItem.author}</p>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer>
      <p>&copy; 2023 Random Photography</p>
      {/* <p>
        <a href='#'>Facebook</a>
      </p>
      <p>
        <a href='#'>Twitter</a>
      </p>
      <p>
        <a href='#'>Instagram</a>
      </p> */}
    </footer>
  );
}
