import { FC, useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db, storage } from '../../config/firebase.config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { IProducts } from '../../types/productsType';
import './AdminManagement.css';
import { serverTimestamp } from "firebase/firestore";
const ProductManagement: FC = () => {
  const [products, setProducts] = useState<IProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<IProducts | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<IProducts>>({
    name: '',
    price: 0,
    catagory: '',
    description: '',
    discountPercent: 0,
    features: [],
    inStock: true,
    quantity: 0,
    selectedSize: 'M',
    imageUrls: [""]
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Cargar productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as IProducts[];
        setProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products: ", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Manejar edición
  const handleEdit = (product: IProducts) => {
    setEditingProduct(product);
    setIsAddingNew(false);
  };

  // Manejar cambios en edición
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editingProduct) return;
    
    const { name, value } = e.target;
    
    setEditingProduct({
      ...editingProduct,
      [name]: name === 'price' || name === 'discountPercent' || name === 'quantity' 
        ? Number(value) 
        : name === 'inStock' 
          ? (e.target as HTMLInputElement).checked 
          : name === 'features'
            ? value.split(',')
            : value
    });
  };

  // Guardar cambios
  const handleSave = async () => {
    if (!editingProduct) return;
    
    try {
      const productRef = doc(db, 'products', editingProduct.id);
      const { id, timeStamp, ...productData } = editingProduct;
await updateDoc(productRef, productData as any);
      
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product: ", error);
    }
  };

  // Eliminar producto
  const handleDelete = async (productId: string, imageUrls: string[]) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        // Eliminar imágenes de storage
        for (const url of imageUrls) {
          const imageRef = ref(storage, url);
          await deleteObject(imageRef).catch(error => {
            console.error("Error deleting image: ", error);
          });
        }
        
        // Eliminar documento de Firestore
        await deleteDoc(doc(db, 'products', productId));
        setProducts(products.filter(p => p.id !== productId));
      } catch (error) {
        console.error("Error deleting product: ", error);
      }
    }
  };

  // Manejar nuevo producto
  const handleNewProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setNewProduct({
      ...newProduct,
      [name]: name === 'price' || name === 'discountPercent' || name === 'quantity' 
        ? Number(value) 
        : name === 'inStock' 
          ? (e.target as HTMLInputElement).checked 
          : name === 'features'
            ? value.split(',')
            : value
    });
  };

  const handleCreateProduct = async () => {
    try {
      // Filtrar las URLs válidas (no vacías)
      const validImageUrls = newProduct.imageUrls?.filter(url => url.trim() !== '') || [];
      
      if (validImageUrls.length === 0) {
        alert('Debes proporcionar al menos una imagen URL');
        return;
      }
  
      // Crear documento en Firestore con el timestamp del servidor
      const productData = {
        ...newProduct,
        imageUrls: validImageUrls,
        timeStamp: {   // <-- Aquí está la corrección
          seconds: Math.floor(Date.now() / 1000),
          nanoseconds: 0
        }
      };
  
      const docRef = await addDoc(collection(db, 'products'), productData);
      
      // Actualizar lista de productos
      setProducts([...products, { 
        ...productData, 
        id: docRef.id,
        timeStamp: {   // <-- También aquí para consistencia
          seconds: Math.floor(Date.now() / 1000),
          nanoseconds: 0
        }
      } as IProducts]);
      
      // Resetear formulario
      setNewProduct({
        name: '',
        price: 0,
        catagory: '',
        description: '',
        discountPercent: 0,
        features: [],
        inStock: true,
        quantity: 0,
        selectedSize: 'M',
        imageUrls: ['', '']
      });
      setIsAddingNew(false);
    } catch (error) {
      console.error("Error creating product: ", error);
    }
  };

  if (loading) {
    return <div>Cargando productos...</div>;
  }

  return (
    <div className="product-management">
      <h1>Gestión de Productos</h1>
      
      <button 
        className="add-product-btn" 
        onClick={() => {
          setIsAddingNew(true);
          setEditingProduct(null);
        }}
      >
        Añadir Nuevo Producto
      </button>

      {isAddingNew && (
        <div className="product-form">
          <h2>Nuevo Producto</h2>
          <div className="form-group">
            <label>Nombre:</label>
            <input 
              type="text" 
              name="name" 
              value={newProduct.name || ''} 
              onChange={handleNewProductChange} 
            />
          </div>
          <div className="form-group">
            <label>Precio:</label>
            <input 
              type="number" 
              name="price" 
              value={newProduct.price || 0} 
              onChange={handleNewProductChange} 
            />
          </div>
          <div className="form-group">
            <label>Categoría:</label>
            <input 
              type="text" 
              name="catagory" 
              value={newProduct.catagory || ''} 
              onChange={handleNewProductChange} 
            />
          </div>
          <div className="form-group">
            <label>Descripción:</label>
            <textarea 
              name="description" 
              value={newProduct.description || ''} 
              onChange={handleNewProductChange} 
            />
          </div>
          <div className="form-group">
            <label>Descuento (%):</label>
            <input 
              type="number" 
              name="discountPercent" 
              value={newProduct.discountPercent || 0} 
              onChange={handleNewProductChange} 
              min="0"
              max="100"
            />
          </div>
          <div className="form-group">
            <label>Características (separadas por comas):</label>
            <input 
              type="text" 
              name="features" 
              value={newProduct.features?.join(',') || ''} 
              onChange={handleNewProductChange} 
            />
          </div>
          <div className="form-group">
            <label>En stock:</label>
            <input 
              type="checkbox" 
              name="inStock" 
              checked={newProduct.inStock || false} 
              onChange={handleNewProductChange} 
            />
          </div>
          <div className="form-group">
            <label>Cantidad:</label>
            <input 
              type="number" 
              name="quantity" 
              value={newProduct.quantity || 0} 
              onChange={handleNewProductChange} 
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Talla seleccionada:</label>
            <select 
              name="selectedSize" 
              value={newProduct.selectedSize || 'M'} 
              onChange={handleNewProductChange}
            >
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>
          <div className="form-group">
  <label>URL de Imágenes:</label>
  {newProduct.imageUrls?.map((url, index) => (
    <input
      key={index}
      type="text"
      placeholder={`URL de la imagen ${index + 1}`}
      value={url}
      onChange={(e) => {
        const updatedUrls = [...(newProduct.imageUrls || [])];
        updatedUrls[index] = e.target.value;
        setNewProduct({
          ...newProduct,
          imageUrls: updatedUrls
        });
      }}
    />
  ))}
  <small>Puedes agregar hasta 2 URLs de imágenes</small>
</div>
          <div className="form-actions">
            <button onClick={handleCreateProduct}>Guardar</button>
            <button onClick={() => setIsAddingNew(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {editingProduct && (
        <div className="product-form">
          <h2>Editar Producto</h2>
          <div className="form-group">
            <label>Nombre:</label>
            <input 
              type="text" 
              name="name" 
              value={editingProduct.name} 
              onChange={handleEditChange} 
            />
          </div>
          <div className="form-group">
            <label>Precio:</label>
            <input 
              type="number" 
              name="price" 
              value={editingProduct.price} 
              onChange={handleEditChange} 
            />
          </div>
          <div className="form-group">
            <label>Categoría:</label>
            <input 
              type="text" 
              name="catagory" 
              value={editingProduct.catagory} 
              onChange={handleEditChange} 
            />
          </div>
          <div className="form-group">
            <label>Descripción:</label>
            <textarea 
              name="description" 
              value={editingProduct.description} 
              onChange={handleEditChange} 
            />
          </div>
          <div className="form-group">
            <label>Descuento (%):</label>
            <input 
              type="number" 
              name="discountPercent" 
              value={editingProduct.discountPercent} 
              onChange={handleEditChange} 
              min="0"
              max="100"
            />
          </div>
          <div className="form-group">
            <label>Características (separadas por comas):</label>
            <input 
              type="text" 
              name="features" 
              value={editingProduct.features.join(',')} 
              onChange={handleEditChange} 
            />
          </div>
          <div className="form-group">
            <label>En stock:</label>
            <input 
              type="checkbox" 
              name="inStock" 
              checked={editingProduct.inStock} 
              onChange={handleEditChange} 
            />
          </div>
          <div className="form-group">
            <label>Cantidad:</label>
            <input 
              type="number" 
              name="quantity" 
              value={editingProduct.quantity} 
              onChange={handleEditChange} 
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Talla seleccionada:</label>
            <select 
              name="selectedSize" 
              value={editingProduct.selectedSize} 
              onChange={handleEditChange}
            >
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>
          <div className="form-group">
            <label>Imágenes:</label>
            <div className="image-preview">
              {editingProduct.imageUrls.map((url, index) => (
                <img key={index} src={url} alt={`Imagen ${index + 1}`} />
              ))}
            </div>
          </div>
          <div className="form-actions">
            <button onClick={handleSave}>Guardar Cambios</button>
            <button onClick={() => setEditingProduct(null)}>Cancelar</button>
          </div>
        </div>
      )}

      <div className="products-list">
        <h2>Lista de Productos</h2>
        <table>
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>
                  {product.imageUrls.length > 0 && (
                    <img 
                      src={product.imageUrls[0]} 
                      alt={product.name} 
                      className="product-thumbnail"
                    />
                  )}
                </td>
                <td>{product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.catagory}</td>
                <td>{product.inStock ? 'Disponible' : 'Agotado'}</td>
                <td>
                  <button onClick={() => handleEdit(product)}>Editar</button>
                  <button 
                    onClick={() => handleDelete(product.id, product.imageUrls)}
                    className="delete-btn"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;