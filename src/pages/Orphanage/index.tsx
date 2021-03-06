import React, { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { FiClock, FiInfo } from 'react-icons/fi';
import { Map, Marker, TileLayer } from 'react-leaflet';

import mapIcon from '../../utils/mapIcon';

import { Container, OrphanageDetails, OrphanageDetailsContent } from './styles';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import { useParams } from 'react-router-dom';

interface Orphanage {
  name: string;
  about: string;
  whatsapp: string;
  instructions: string;
  latitude: number;
  longitude: number;
  opening_hours: string;
  open_on_weekends: boolean;
  images: Array<{
    id: string;
    url: string;
  }>;
}

interface OrphanageParams {
  id: string;
}

const Orphanage = () => {
  const params = useParams<OrphanageParams>();
  const [orphanage, setOrphanage] = useState<Orphanage>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    api.get(`orphanages/${params.id}`).then(response => {
      setOrphanage(response.data);
    });
  }, [params.id]);

  if (!orphanage) {
    return <p>Carregando...</p>;
  }

  return (
    <Container>
      <Sidebar />

      <main>
        <OrphanageDetails>
          <img
            src={orphanage.images[activeImageIndex].url}
            alt={orphanage.name}
          />

          <div className="images">
            {orphanage.images.map((image, index) => {
              return (
                <button
                  key={image.id}
                  className={activeImageIndex === index ? 'active' : ''}
                  type="button"
                  onClick={() => {
                    setActiveImageIndex(index);
                  }}
                >
                  <img src={image.url} alt="" />
                </button>
              );
            })}
          </div>

          <OrphanageDetailsContent>
            <h1>{orphanage.name}</h1>
            <p>{orphanage.about}</p>

            <div className="map-container">
              <Map
                center={[orphanage.latitude, orphanage.longitude]}
                zoom={16}
                style={{ width: '100%', height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <TileLayer
                  url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                />
                <Marker
                  interactive={false}
                  icon={mapIcon}
                  position={[orphanage.latitude, orphanage.longitude]}
                />
              </Map>

              <footer>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`}
                >
                  Ver rotas no Google Maps
                </a>
              </footer>
            </div>

            <hr />

            <h2>Instruções para visita</h2>
            <p>{orphanage.instructions}</p>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                {orphanage.opening_hours}
              </div>
              {orphanage.open_on_weekends ? (
                <div className="open-on-weekends">
                  <FiInfo size={32} color="#39CC83" />
                  Atendemos <br />
                  fim de semana
                </div>
              ) : (
                <div className="open-on-weekends not-open">
                  <FiInfo size={32} color="#ff669d" />
                  Não Atendemos <br />
                  fim de semana
                </div>
              )}
            </div>

            <a
              target="_blank"
              rel="noopener noreferrer"
              className="contact-button"
              href={`https://wa.me/${orphanage.whatsapp}`}
            >
              <FaWhatsapp size={20} color="#FFF" />
              Entrar em contato
            </a>
          </OrphanageDetailsContent>
        </OrphanageDetails>
      </main>
    </Container>
  );
};

export default Orphanage;
