"use client";
/* eslint-disable @next/next/no-img-element */

import { ChangeEvent, useEffect, useMemo, useState } from "react";

type DressCard = {
  id: number;
  name: string;
  image: string;
};

const DRESS_CARDS: DressCard[] = [
  {
    id: 1,
    name: "Wedding Dress 1",
    image:
      "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=720&q=80",
  },
  {
    id: 2,
    name: "Wedding Dress 2",
    image:
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=720&q=80",
  },
  {
    id: 3,
    name: "Wedding Dress 3",
    image:
      "https://images.pexels.com/photos/291759/pexels-photo-291759.jpeg?auto=compress&cs=tinysrgb&w=720",
  },
  {
    id: 4,
    name: "Wedding Dress 4",
    image:
      "https://images.unsplash.com/photo-1585241936939-be4099591252?auto=format&fit=crop&w=720&q=80",
  },
  {
    id: 5,
    name: "Wedding Dress 5",
    image:
      "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=720&q=80",
  },
  {
    id: 6,
    name: "Wedding Dress 6",
    image:
      "https://images.unsplash.com/photo-1525328437458-0c4d4db7cab4?auto=format&fit=crop&w=720&q=80",
  },
];

export default function HomePage() {
  const [selectedDressId, setSelectedDressId] = useState<number>(
    DRESS_CARDS[0].id,
  );
  const [zoom, setZoom] = useState<number>(1);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [photoActionsOpen, setPhotoActionsOpen] = useState<boolean>(false);

  const selectedDress = useMemo(
    () =>
      DRESS_CARDS.find((item) => item.id === selectedDressId) ?? DRESS_CARDS[0],
    [selectedDressId],
  );

  useEffect(() => {
    return () => {
      if (uploadedImage) {
        URL.revokeObjectURL(uploadedImage);
      }
    };
  }, [uploadedImage]);

  const onUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }

    const nextImage = URL.createObjectURL(file);
    setUploadedImage(nextImage);
    setPhotoActionsOpen(false);
  };

  const removePhoto = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }
    setUploadedImage(null);
    setPhotoActionsOpen(false);
  };

  return (
    <main className="virtual-page">
      <section className="virtual-top-band">
        Guest at the largest and most beautiful outfitter in Germany.
      </section>

      <header className="virtual-header">
        <div className="virtual-logo-wrap">
          <p className="virtual-logo-mark">WW</p>
          <p className="virtual-logo-text">WEDDING WORLD</p>
        </div>
        <nav className="virtual-actions">
          <button type="button">BACK TO WEDDING WORLD</button>
          <button type="button">VIEW 2026 COLLECTION</button>
          <button type="button">BOOK APPOINTMENT</button>
        </nav>
      </header>

      <section className="virtual-stage">
        <div className="virtual-stage-title">
          The Wedding World Virtual Bridal Experience
        </div>

        <div className="virtual-grid">
          <aside className="upload-panel">
            <h1>
              SEE YOURSELF AS A <span>bride</span>
            </h1>
            <p>
              Curious how your dream dress looks on you? Try on your favorite
              dress now in our virtual fitting room. Upload a photo of yourself
              and get a first impression of your fitting.
            </p>

            <input
              id="upload-photo"
              accept="image/*"
              type="file"
              className="hidden-input"
              onChange={onUpload}
            />

            <label className="upload-box" htmlFor="upload-photo">
              {!uploadedImage ? (
                <>
                  <span className="upload-icon">⇪</span>
                  <span>Upload your photo</span>
                </>
              ) : (
                <>
                  <img
                    src={uploadedImage}
                    alt="Uploaded user"
                    className="uploaded-preview"
                  />
                  <button
                    className="photo-open-hotspot"
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      setPhotoActionsOpen((current) => !current);
                    }}
                    aria-label="Open photo actions"
                  >
                    ☝
                  </button>
                  {photoActionsOpen ? (
                    <div className="photo-actions">
                      <label htmlFor="upload-photo">Change photo</label>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          removePhoto();
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : null}
                </>
              )}
            </label>

            <button type="button" className="try-on-button">
              ✨ TRY ON
            </button>
          </aside>

          <section className="catalog-panel">
            <h2>Wedding Dresses</h2>
            <ul>
              <li>
                Silhouette <strong>A-Line</strong>
              </li>
              <li>Mermaid</li>
              <li>Fit &amp; Flare</li>
              <li>Straight / Column</li>
              <li>Princess</li>
            </ul>

            <div className="catalog-thumbs">
              {DRESS_CARDS.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  className={
                    card.id === selectedDressId ? "thumb active" : "thumb"
                  }
                  onClick={() => setSelectedDressId(card.id)}
                >
                  <img src={card.image} alt={card.name} />
                </button>
              ))}
            </div>
          </section>

          <section className="preview-panel">
            <div className="preview-frame">
              <img
                src={selectedDress.image}
                alt={selectedDress.name}
                style={{ transform: `scale(${zoom})` }}
              />
            </div>

            <div className="zoom-controls">
              <button
                type="button"
                aria-label="Zoom in"
                onClick={() =>
                  setZoom((value) =>
                    Math.min(2.4, Number((value + 0.15).toFixed(2))),
                  )
                }
              >
                +
              </button>
              <button
                type="button"
                aria-label="Zoom out"
                onClick={() =>
                  setZoom((value) =>
                    Math.max(1, Number((value - 0.15).toFixed(2))),
                  )
                }
              >
                -
              </button>
            </div>
          </section>

          <aside className="side-panel">
            <div className="side-list">
              {DRESS_CARDS.slice(0, 3).map((card) => (
                <button
                  key={`side-${card.id}`}
                  type="button"
                  onClick={() => setSelectedDressId(card.id)}
                >
                  <img src={card.image} alt={card.name} />
                  <span>{card.name}</span>
                </button>
              ))}
            </div>

            <div className="email-box">
              <h3>Send me my photos via email.</h3>
              <input type="email" placeholder="EMAIL" />
              <button type="button">SEND</button>
              <button type="button">BOOK APPOINTMENT</button>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
