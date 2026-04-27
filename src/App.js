import React, { useEffect, useMemo, useRef, useState } from "react";
import { Home, Maximize, PlayCircle, Star, Tv } from "lucide-react";
import { Link, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";

const RU_SEASON_NAMES = [
  "Сезон 1: Магия дружбы",
  "Сезон 2: Возвращение гармонии",
  "Сезон 3: Кристальная империя",
  "Сезон 4: Принцесса дружбы",
  "Сезон 5: Карта квестов",
  "Сезон 6: Новая ответственность",
  "Сезон 7: Семейные тайны",
  "Сезон 8: Школа дружбы",
  "Сезон 9: Последняя глава"
];

const ORIGINAL_EPISODE_TITLES = {
  1: [
    "Дружба — это чудо. Часть 1",
    "Дружба — это чудо. Часть 2",
    "Мастер билетов",
    "Яблочный сезон",
    "Грифон за гранью",
    "Хвастунишки",
    "Драконья робость",
    "Прежде чем уснуть",
    "Сплетни в уздечке",
    "Рой века",
    "Зимняя уборка",
    "Зов метки",
    "Осенние друзья",
    "Наряды к успеху",
    "Пинки знает лучше",
    "Сверхзвуковой радужный рывок",
    "Взгляд мастера",
    "Провал шоу",
    "Собачье-пони шоу",
    "Зелёный — не твой цвет",
    "За бочонком",
    "Птица в копыте",
    "Хроники меток",
    "Совиная история",
    "Вечеринка для одной",
    "Лучшая ночь"
  ],
  2: Array.from({ length: 26 }, (_, i) => `Сезон 2 — серия ${i + 1}`),
  3: Array.from({ length: 26 }, (_, i) => `Сезон 3 — серия ${i + 1}`),
  4: Array.from({ length: 26 }, (_, i) => `Сезон 4 — серия ${i + 1}`),
  5: Array.from({ length: 26 }, (_, i) => `Сезон 5 — серия ${i + 1}`),
  6: Array.from({ length: 26 }, (_, i) => `Сезон 6 — серия ${i + 1}`),
  7: Array.from({ length: 26 }, (_, i) => `Сезон 7 — серия ${i + 1}`),
  8: Array.from({ length: 26 }, (_, i) => `Сезон 8 — серия ${i + 1}`),
  9: Array.from({ length: 26 }, (_, i) => `Сезон 9 — серия ${i + 1}`)
};

const BASE_GENRES = ["Приключения", "Комедия", "Фэнтези", "Драма", "Музыкальный", "Семейный"];

const buildEpisodes = (seasonNumber) =>
  ORIGINAL_EPISODE_TITLES[seasonNumber].map((title, idx) => {
    const id = idx + 1;
    return {
      id,
      title,
      genre: BASE_GENRES[(idx + seasonNumber) % BASE_GENRES.length],
      duration: "22 мин",
      description: `Оригинальная история серии «${title}» из сезона ${seasonNumber}.`
    };
  });

const buildSeasonData = () =>
  RU_SEASON_NAMES.reduce((acc, seasonTitle, seasonIndex) => {
    const seasonNumber = seasonIndex + 1;
    acc[seasonNumber] = {
      title: seasonTitle,
      shortTitle: `С${seasonNumber}`,
      description: `Полный список серий сезона ${seasonNumber}. Выбери эпизод и начни просмотр.`,
      episodes: buildEpisodes(seasonNumber)
    };
    return acc;
  }, {});

const CONSTANTS = {
  APP_NAME: "Brony video",
  TOTAL_SEASONS: 9,
  SEASONS: buildSeasonData()
};

const getPageFromPath = (path) => {
  if (path.startsWith("/player")) {
    return "player";
  }
  if (path.startsWith("/season")) {
    return "season";
  }
  return "home";
};

function Sidebar({ currentSeason, currentPage }) {
  return (
    <aside className="sidebar">
      <Link to="/" className={`nav-pill ${currentPage === "home" ? "active" : ""}`}>
        <Home size={16} />
        <span>Главная</span>
      </Link>
      {Array.from({ length: CONSTANTS.TOTAL_SEASONS }, (_, index) => index + 1).map((season) => (
        <Link
          key={season}
          to={`/season/${season}`}
          className={`nav-pill ${currentSeason === season && currentPage === "season" ? "active" : ""}`}
        >
          <Tv size={16} />
          <span>С{season}</span>
        </Link>
      ))}
    </aside>
  );
}

function HomePage() {
  const topEpisodes = [
    { season: 1, episode: 1, rating: "9.6" },
    { season: 1, episode: 2, rating: "9.5" },
    { season: 1, episode: 26, rating: "9.4" }
  ];

  return (
    <div className="home-layout">
      <section className="panel hero-card">
        <div className="hero-thumb" />
        <div>
          <h1>{CONSTANTS.APP_NAME}</h1>
          <p className="description">
            Уютный видеохостинг в пастельном стиле: выбирай сезон, открывай серию и смотри без лишних кликов.
          </p>
          <div className="button-row">
            <Link className="primary-btn" to="/season/1">
              Открыть сезоны
            </Link>
          </div>
        </div>
      </section>

      <section className="panel quick-list rating-center">
        <div className="quick-list-head centered">
          <h2>Рейтинг лучших серий</h2>
        </div>
        {topEpisodes.map((item) => {
          const ep = CONSTANTS.SEASONS[item.season].episodes[item.episode - 1];
          return (
            <Link className="compact-episode" to={`/player/${item.season}/${item.episode}`} key={`${item.season}-${item.episode}`}>
              <div className="episode-main">
                <h3>{ep.title}</h3>
                <p className="muted">Сезон {item.season} • Рейтинг {item.rating}</p>
              </div>
              <span className="rating-pill">
                <Star size={14} />
                {item.rating}
              </span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}

function SeasonPage({ setCurrentSeason }) {
  const { seasonId } = useParams();
  const navigate = useNavigate();
  const season = Number(seasonId || 1);
  const safeSeason = season >= 1 && season <= CONSTANTS.TOTAL_SEASONS ? season : 1;

  useEffect(() => {
    setCurrentSeason(safeSeason);
    if (season !== safeSeason) {
      navigate(`/season/${safeSeason}`, { replace: true });
    }
  }, [navigate, safeSeason, season, setCurrentSeason]);

  const seasonData = CONSTANTS.SEASONS[safeSeason];
  const episodes = seasonData?.episodes || [];

  return (
    <section className="panel">
      <div className="season-banner">
        <h2>{seasonData?.title || `Сезон ${safeSeason}`}</h2>
        <p className="muted">{seasonData?.description}</p>
      </div>
      <div className="episode-list scrollable">
        {episodes.map((episode) => (
          <Link
            className="episode-card"
            key={episode.id}
            to={`/player/${safeSeason}/${episode.id}`}
            state={{ episode }}
          >
            <div className="episode-thumb" aria-hidden="true" />
            <div className="episode-main">
              <h3>{episode.title}</h3>
              <p className="muted meta-row">
                {episode.genre} | {episode.duration}
              </p>
              <p className="muted">{episode.description}</p>
            </div>
            <span className="primary-btn small">
              <PlayCircle size={16} />
              <span>Play</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function PlayerPage({ setCurrentSeason }) {
  const { seasonId, episodeId } = useParams();
  const location = useLocation();
  const season = Number(seasonId || 1);
  const episode = Number(episodeId || 1);
  const safeSeason = season >= 1 && season <= CONSTANTS.TOTAL_SEASONS ? season : 1;
  const episodes = CONSTANTS.SEASONS[safeSeason]?.episodes || [];
  const routeEpisode = location.state?.episode;
  const selectedEpisode = routeEpisode || episodes.find((item) => item.id === episode) || episodes[0];
  const nextEpisodes = episodes.filter((item) => item.id > (selectedEpisode?.id || 0)).slice(0, 5);
  const playerRef = useRef(null);

  useEffect(() => {
    setCurrentSeason(safeSeason);
  }, [safeSeason, setCurrentSeason]);

  const openFullscreen = async () => {
    const playerNode = playerRef.current;
    if (!playerNode) {
      return;
    }

    try {
      if (playerNode.requestFullscreen) {
        await playerNode.requestFullscreen();
      } else if (playerNode.webkitRequestFullscreen) {
        playerNode.webkitRequestFullscreen();
      } else if (playerNode.msRequestFullscreen) {
        playerNode.msRequestFullscreen();
      }
    } catch (error) {
      // Fail silently if fullscreen is blocked by browser policy.
    }
  };

  return (
    <section className="panel player-panel">
      <h2>
        Плеер | Сезон {safeSeason}, серия {selectedEpisode?.id || 1}
      </h2>
      <div ref={playerRef} className="video-placeholder video-large">
        Video Player Placeholder
      </div>
      <h3>{selectedEpisode?.title || "Серия недоступна"}</h3>
      <p className="muted">{selectedEpisode?.description || "Описание недоступно."}</p>
      <div className="button-row">
        <button type="button" className="primary-btn" onClick={openFullscreen}>
          <Maximize size={16} />
          <span>На весь экран</span>
        </button>
        <Link className="secondary-btn" to={`/season/${safeSeason}`}>
          Назад к сезону
        </Link>
      </div>
      <div className="next-videos">
        <h3>Следующие видео</h3>
        {nextEpisodes.length === 0 ? (
          <p className="muted">Это последняя серия сезона.</p>
        ) : (
          nextEpisodes.map((item) => (
            <Link
              key={item.id}
              className="next-video-card"
              to={`/player/${safeSeason}/${item.id}`}
              state={{ episode: item }}
            >
              <div className="episode-thumb" aria-hidden="true" />
              <div className="episode-main">
                <h3>
                  Серия {item.id}: {item.title}
                </h3>
                <p className="muted">
                  {item.genre} | {item.duration}
                </p>
              </div>
              <PlayCircle size={18} />
            </Link>
          ))
        )}
      </div>
    </section>
  );
}

export default function App() {
  const location = useLocation();
  const [currentSeason, setCurrentSeason] = useState(1);
  const [currentPage, setCurrentPage] = useState("home");

  useEffect(() => {
    setCurrentPage(getPageFromPath(location.pathname));
  }, [location.pathname]);

  const content = useMemo(
    () => (
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/season/:seasonId" element={<SeasonPage setCurrentSeason={setCurrentSeason} />} />
        <Route path="/player/:seasonId/:episodeId" element={<PlayerPage setCurrentSeason={setCurrentSeason} />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    ),
    []
  );

  return (
    <div className="page-frame">
      <div className="video-blur video-blur-left" />
      <div className="video-blur video-blur-right" />
      <div className="app-shell">
        <Sidebar currentSeason={currentSeason} currentPage={currentPage} />
        <main className="content">{content}</main>
      </div>
    </div>
  );
}
