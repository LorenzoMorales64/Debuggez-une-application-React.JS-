import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";
import "./style.css";

const PER_PAGE = 9; // Nombre d'événements par page
const EventList = () => {
  const { data, error } = useData(); // Récupère les données et les erreurs
  const [type, setType] = useState(null); // Type de catégorie sélectionnée (par défaut null)
  const [currentPage, setCurrentPage] = useState(1); // Page actuelle
  // Fonction pour filtrer les événements par catégorie
  const filteredEvents = (data?.events || [])
    .filter((event) => !type || event.type === type) // Filtrer par catégorie
    .filter(
      (_, index) =>
        (currentPage - 1) * PER_PAGE <= index && PER_PAGE * currentPage > index // Filtrer par pagination
    );
  // Fonction pour changer la catégorie sélectionnée
  const changeType = (evtType) => {
    setCurrentPage(1); // Réinitialise à la première page lorsque la catégorie change
    setType(evtType); // Met à jour la catégorie sélectionnée
  };
  // Calcul du nombre total de pages après filtrage
  const pageNumber = Math.ceil(
    (data?.events?.filter((event) => !type || event.type === type).length || 0) / PER_PAGE
  );
  // Liste des catégories uniques
  const typeList = new Set(data?.events?.map((event) => event.type));
  return (
    <>
      {error && <div>An error occurred</div>}
      {data === null ? (
        "Loading..."
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={[...Array.from(typeList)]} 
            onChange={(value) => changeType(value)} // Mise à jour de la catégorie sélectionnée
            name="eventCategory"
            label="Choisissez une catégorie"
          />
          <div id="events" className="ListContainer">
            {filteredEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          {pageNumber > 1 && (
            <div className="Pagination">
              {[...Array(pageNumber)].map((_, n) => (
                <a key={`page-${n+1}`} href="#events" onClick={() => setCurrentPage(n + 1)}>
                  {n + 1}
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
};
export default EventList;