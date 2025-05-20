import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { API_BASE_URL } from '../config/api';
import { Toast } from 'bootstrap';

// Компонент для управління риссю, яка перебуває на реабілітації, через API
function Rehabilitation() {
  const [lynxes, setLynxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lynxToDelete, setLynxToDelete] = useState(null);
  const [currentLynx, setCurrentLynx] = useState(null);
  const [toastMessage, setToastMessage] = useState({ text: '', type: 'success' });

  const toastRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    gender: 'male',
    description: ''
  });

  useEffect(() => {
    document.title = 'Реабілітація рисей - Сайт про рисей';
    fetchLynxes();
  }, []);

  useEffect(() => {
    if (toastMessage.text && toastRef.current) {
      const toastElement = new Toast(toastRef.current);
      toastElement.show();
    }
  }, [toastMessage]);

  const fetchLynxes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/rabbits`);
      setLynxes(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(`Помилка завантаження даних: ${err.message}`);
      console.error('Помилка при отриманні даних про рисей:', err);
      setLynxes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (['age', 'height', 'weight'].includes(name)) {
      processedValue = value === '' ? '' : Number(value);
    }
    setFormData({
      ...formData,
      [name]: processedValue
    });
  };

  const handleShowAddModal = () => {
    setFormData({
      name: '',
      age: '',
      height: '',
      weight: '',
      gender: 'male',
      description: ''
    });
    setShowAddModal(true);
  };

  const handleShowEditModal = (lynx) => {
    setCurrentLynx(lynx);
    setFormData({
      name: lynx.name,
      age: lynx.age,
      height: lynx.height,
      weight: lynx.weight,
      gender: lynx.gender,
      description: lynx.description || ''
    });
    setShowEditModal(true);
  };

  const handleAddLynx = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/rabbits`, formData);
      const newLynx = response.data;
      setLynxes([...lynxes, newLynx]);
      setShowAddModal(false);
      setToastMessage({ text: `Рись "${newLynx.name}" успішно додано!`, type: 'success' });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(`Помилка при створенні: ${errorMessage}`);
      setToastMessage({ text: `Помилка при створенні: ${errorMessage}`, type: 'danger' });
      console.error('Помилка при додаванні рисі:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLynx = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(`${API_BASE_URL}/rabbits/${currentLynx._id}`, formData);
      const updatedLynx = response.data;
      setLynxes(lynxes.map(lynx =>
        lynx._id === currentLynx._id ? updatedLynx : lynx
      ));
      setShowEditModal(false);
      setToastMessage({ text: `Дані про рись "${updatedLynx.name}" оновлено!`, type: 'success' });
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(`Помилка при оновленні: ${errorMessage}`);
      setToastMessage({ text: `Помилка при оновленні: ${errorMessage}`, type: 'danger' });
      console.error('Помилка при оновленні рисі:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowDeleteModal = (lynx) => {
    setLynxToDelete(lynx);
    setShowDeleteModal(true);
  };

  const handleDeleteLynx = async () => {
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/rabbits/${lynxToDelete._id}`);
      setLynxes(lynxes.filter(lynx => lynx._id !== lynxToDelete._id));
      setToastMessage({ text: `Рись "${lynxToDelete.name}" успішно видалено!`, type: 'success' });
      setShowDeleteModal(false);
      setLynxToDelete(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(`Помилка при видаленні: ${errorMessage}`);
      setToastMessage({ text: `Помилка при видаленні: ${errorMessage}`, type: 'danger' });
      console.error('Помилка при видаленні рисі:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('uk-UA', options);
  };

  return (
    <main className="container px-4 py-4">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 text-success">Реабілітація рисей</h1>
        <button
          className="btn btn-success"
          onClick={handleShowAddModal}
          disabled={loading}
        >
          Додати рись
        </button>
      </header>

      {error && (
        <section className="alert alert-danger mb-4" role="alert">
          {error}
        </section>
      )}

      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div
          ref={toastRef}
          className={`toast align-items-center text-white bg-${toastMessage.type} border-0`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          data-bs-delay="3000"
        >
          <div className="d-flex">
            <div className="toast-body">
              {toastMessage.text}
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Закрити"
            ></button>
          </div>
        </div>
      </div>

      {loading && !error && (
        <div className="text-center my-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Завантаження...</span>
          </div>
          <p className="mt-2">Завантаження записів рисей...</p>
        </div>
      )}

      {!loading && lynxes.length === 0 && (
        <section className="alert alert-info">
          Немає доступних записів про рисей у реабілітації. Додайте першу рись!
        </section>
      )}

      {!loading && lynxes.length > 0 && (
        <section className="table-responsive">
          <table className="table table-striped table-bordered table-hover vertical-align-middle">
            <thead>
              <tr>
                <th>Ім'я</th>
                <th>Вік (роки)</th>
                <th>Висота (см)</th>
                <th>Вага (кг)</th>
                <th>Стать</th>
                <th>Опис</th>
                <th>Дата додавання</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {lynxes.map(lynx => (
                <tr key={lynx._id}>
                  <td>{lynx.name}</td>
                  <td>{lynx.age}</td>
                  <td>{lynx.height}</td>
                  <td>{lynx.weight}</td>
                  <td>{lynx.gender === 'male' ? 'Самець' : 'Самка'}</td>
                  <td>{lynx.description}</td>
                  <td>{lynx.dateAdded ? formatDate(lynx.dateAdded) : 'Н/Д'}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => handleShowEditModal(lynx)}
                      disabled={loading}
                    >
                      Редагувати
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleShowDeleteModal(lynx)}
                      disabled={loading}
                    >
                      Видалити
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Модальне вікно для додавання нової рисі */}
      <div
        className={`modal fade ${showAddModal ? 'show' : ''}`}
        id="addLynxModal"
        tabIndex="-1"
        aria-labelledby="addLynxModalLabel"
        aria-hidden="true"
        style={{ display: showAddModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <header className="modal-header">
              <h2 className="modal-title h5" id="addLynxModalLabel">Додати нову рись</h2>
              <button type="button" className="btn-close" onClick={() => setShowAddModal(false)} aria-label="Закрити"></button>
            </header>
            <div className="modal-body">
              <form onSubmit={handleAddLynx}>
                <fieldset>
                  <div className="row mb-3">
                    <label htmlFor="name" className="col-sm-3 col-form-label">Ім'я</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="age" className="col-sm-3 col-form-label">Вік (роки)</label>
                    <div className="col-sm-9">
                      <input
                        type="number"
                        className="form-control"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="1"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="height" className="col-sm-3 col-form-label">Висота (см)</label>
                    <div className="col-sm-9">
                      <input
                        type="number"
                        className="form-control"
                        id="height"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="weight" className="col-sm-3 col-form-label">Вага (кг)</label>
                    <div className="col-sm-9">
                      <input
                        type="number"
                        className="form-control"
                        id="weight"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="gender" className="col-sm-3 col-form-label">Стать</label>
                    <div className="col-sm-9">
                      <select
                        className="form-select"
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="male">Самець</option>
                        <option value="female">Самка</option>
                      </select>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="description" className="col-sm-3 col-form-label">Опис</label>
                    <div className="col-sm-9">
                      <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                      ></textarea>
                    </div>
                  </div>
                </fieldset>
                <footer className="d-flex justify-content-end">
                  <button type="button" className="btn btn-secondary me-2" onClick={() => setShowAddModal(false)}>
                    Скасувати
                  </button>
                  <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Зачекайте...
                      </>
                    ) : 'Додати рись'}
                  </button>
                </footer>
              </form>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-backdrop fade show"
             onClick={() => setShowAddModal(false)}></div>
      )}

      {/* Модальне вікно для редагування існуючої рисі */}
      <div
        className={`modal fade ${showEditModal ? 'show' : ''}`}
        id="editLynxModal"
        tabIndex="-1"
        aria-labelledby="editLynxModalLabel"
        aria-hidden="true"
        style={{ display: showEditModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <header className="modal-header">
              <h2 className="modal-title h5" id="editLynxModalLabel">Редагувати рись</h2>
              <button type="button" className="btn-close" onClick={() => setShowEditModal(false)} aria-label="Закрити"></button>
            </header>
            <div className="modal-body">
              <form onSubmit={handleUpdateLynx}>
                <fieldset>
                  <div className="row mb-3">
                    <label htmlFor="edit-name" className="col-sm-3 col-form-label">Ім'я</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control"
                        id="edit-name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="edit-age" className="col-sm-3 col-form-label">Вік (роки)</label>
                    <div className="col-sm-9">
                      <input
                        type="number"
                        className="form-control"
                        id="edit-age"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="1"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="edit-height" className="col-sm-3 col-form-label">Висота (см)</label>
                    <div className="col-sm-9">
                      <input
                        type="number"
                        className="form-control"
                        id="edit-height"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="edit-weight" className="col-sm-3 col-form-label">Вага (кг)</label>
                    <div className="col-sm-9">
                      <input
                        type="number"
                        className="form-control"
                        id="edit-weight"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="edit-gender" className="col-sm-3 col-form-label">Стать</label>
                    <div className="col-sm-9">
                      <select
                        className="form-select"
                        id="edit-gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="male">Самець</option>
                        <option value="female">Самка</option>
                      </select>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="edit-description" className="col-sm-3 col-form-label">Опис</label>
                    <div className="col-sm-9">
                      <textarea
                        className="form-control"
                        id="edit-description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                      ></textarea>
                    </div>
                  </div>
                </fieldset>
                <footer className="d-flex justify-content-end">
                  <button type="button" className="btn btn-secondary me-2" onClick={() => setShowEditModal(false)}>
                    Скасувати
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Зачекайте...
                      </>
                    ) : 'Зберегти зміни'}
                  </button>
                </footer>
              </form>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="modal-backdrop fade show"
             onClick={() => setShowEditModal(false)}></div>
      )}

      {/* Модальне вікно для підтвердження видалення рисі */}
      <div
        className={`modal fade ${showDeleteModal ? 'show' : ''}`}
        id="deleteLynxModal"
        tabIndex="-1"
        aria-labelledby="deleteLynxModalLabel"
        aria-hidden="true"
        style={{ display: showDeleteModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <header className="modal-header">
              <h2 className="modal-title h5" id="deleteLynxModalLabel">Підтвердження видалення</h2>
              <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)} aria-label="Закрити"></button>
            </header>
            <div className="modal-body">
              {lynxToDelete && (
                <p>Ви впевнені, що хочете видалити рись <strong>{lynxToDelete.name}</strong>?</p>
              )}
            </div>
            <footer className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Скасувати
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteLynx}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Видалення...
                  </>
                ) : 'Видалити'}
              </button>
            </footer>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-backdrop fade show"
             onClick={() => setShowDeleteModal(false)}></div>
      )}
    </main>
  );
}

export default Rehabilitation;