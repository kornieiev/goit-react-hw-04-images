import React, { useState, useEffect } from 'react';
import Loader from 'components/Loader/Loader';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Modal from './Modal/Modal';
import Button from './Button/Button';
import fetchPhotos from '../components/services/searchPhoto-api';
import { GeneralWrap } from './App.styled';

export default function App() {
  const [query, setquery] = useState(''); // значение ввода инпута
  const [loading, setLoading] = useState(false); // статус отображения загружчика
  const [images, setImages] = useState([]); // данные из Api
  const [showModal, setShowModal] = useState(false); // статус отображения модалки
  const [largeImageURL, setLargeImageURL] = useState(''); // id выбранного фото
  const [totalPhotos, setTotalPhotos] = useState(0); // всего фото в коллекции
  const [page, setPage] = useState(1); // страница загрузки с Api

  useEffect(() => {
    if (!query) {
      return;
    }
    setLoading(true);
    fetchPhotos(query, page)
      .then(data => {
        setTotalPhotos(data.total);
        if (data.total < 1) {
          toast.info('УПС! 🫤 Відсутні фото за Вашим пошуком 🤷🏻');
        } else {
          setImages(prevImages => [...prevImages, ...data.hits]);
          setTotalPhotos(data.total);
          setLoading(false);
        }
      })
      .catch(error => {
        console.log(error);
        console.error('There was a problem with the fetch operation:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query, page]);

  const handleSubmit = newQuery => {
    // setquery(newQuery);
    setquery(`${Date.now()}/${newQuery}`);
    setLoading(true);
    setImages([]);
    setPage(1);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const currentPhoto = largeImageURL => {
    setLargeImageURL(largeImageURL);
    toggleModal();
  };

  const renderMore = async () => {
    setLoading(true);
    setPage(page + 1);
  };

  return (
    <GeneralWrap>
      <Searchbar
        onSubmit={handleSubmit}
        totalPhotos={totalPhotos}
        showedPhotos={images.length}
      />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {loading && <Loader />}

      <ImageGallery images={images} onClick={currentPhoto} />

      {images.length < totalPhotos && (
        <Button onClick={renderMore}>Load more</Button>
      )}

      {showModal && (
        <Modal onClose={toggleModal} largeImageURL={largeImageURL}></Modal>
      )}
    </GeneralWrap>
  );
}
