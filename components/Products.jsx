import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    image: '',
    price: '',
  });
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Obtener todos los productos al cargar la página
  useEffect(() => {
    axios
      .get('https://barac-technologt-plataforma.onrender.com/api/products')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error(error));
  }, []);

  // Manejar cambios en el formulario de creación de productos
  function handleNewProductChange(event) {
    setNewProduct({ ...newProduct, [event.target.name]: event.target.value });
  }

  // Crear un nuevo producto
  function createProduct(event) {
    event.preventDefault();
    axios
      .post(
        'https://barac-technologt-plataforma.onrender.com/api/products',
        newProduct
      )
      .then((response) => {
        setProducts([...products, response.data]);
        setNewProduct({ name: '', description: '', image: '', price: '' });
      })
      .catch((error) => console.error(error));
  }

  // Manejar cambios en el formulario de edición de productos
  function handleSelectedProductChange(event) {
    setSelectedProduct({
      ...selectedProduct,
      [event.target.name]: event.target.value,
    });
  }

  // Actualizar un producto
  function updateProduct(event) {
    event.preventDefault();
    axios
      .patch(
        `https://barac-technologt-plataforma.onrender.com/api/products/${selectedProduct._id}`,
        selectedProduct
      )
      .then((response) => {
        const updatedProductIndex = products.findIndex(
          (product) => product._id === response.data._id
        );
        const updatedProducts = [...products];
        updatedProducts[updatedProductIndex] = response.data;
        setProducts(updatedProducts);
        setSelectedProduct(null);
      })
      .catch((error) => console.error(error));
  }

  // Eliminar un producto
  function deleteProduct(id) {
    axios
      .delete(
        `https://barac-technologt-plataforma.onrender.com/api/products/${id}`
      )
      .then(() => {
        const updatedProducts = products.filter(
          (product) => product._id !== id
        );
        setProducts(updatedProducts);
      })
      .catch((error) => console.error(error));
  }

  return (
    <div>
      <h1>Productos</h1>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <img src={product.image} alt={product.name} />
            <p>Precio: ${product.price}</p>
            <button onClick={() => setSelectedProduct(product)}>Editar</button>
            <button onClick={() => deleteProduct(product._id)}>Eliminar</button>
          </li>
        ))}
      </ul>
      <h2>Agregar un nuevo producto</h2>
      <form onSubmit={createProduct}>
        <label>
          Nombre:
          <input
            type="text"
            name="name"
            value={newProduct.name}
            onChange={handleNewProductChange}
          />
        </label>
        <br />
        <label>
          Descripción:
          <input
            type="text"
            name="description"
            value={newProduct.description}
            onChange={handleNewProductChange}
          />
        </label>
        <br />
        <label>
          Imagen:
          <input
            type="text"
            name="image"
            value={newProduct.image}
            onChange={handleNewProductChange}
          />
        </label>
        <br />
        <label>
          Precio:
          <input
            type="number"
            name="price"
            value={newProduct.price}
            onChange={handleNewProductChange}
          />
        </label>
        <br />
        <button type="submit">Crear</button>
      </form>
      {selectedProduct && (
        <div>
          <h2>Editar producto</h2>
          <form onSubmit={updateProduct}>
            <label>
              Nombre:
              <input
                type="text"
                name="name"
                value={selectedProduct.name}
                onChange={handleSelectedProductChange}
              />
            </label>
            <br />
            <label>
              Descripción:
              <input
                type="text"
                name="description"
                value={selectedProduct.description}
                onChange={handleSelectedProductChange}
              />
            </label>
            <br />
            <label>
              Imagen:
              <input
                type="text"
                name="image"
                value={selectedProduct.image}
                onChange={handleSelectedProductChange}
              />
            </label>
            <br />
            <label>
              Precio:
              <input
                type="number"
                name="price"
                value={selectedProduct.price}
                onChange={handleSelectedProductChange}
              />
            </label>
            <br />
            <button type="submit">Actualizar</button>
            <button onClick={() => setSelectedProduct(null)}>Cancelar</button>
          </form>
        </div>
      )}
    </div>
  );
}
