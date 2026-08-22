import React, { useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaShoppingCart,
  FaEdit,
  FaTrash,
  FaPowerOff,
  FaBox,
  FaChartLine,
} from "react-icons/fa";

function CommercePage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Products");

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Premium WhatsApp Package",
      description: "WhatsApp automation package for businesses.",
      price: 4999,
      category: "Services",
      sales: 42,
      status: "Active",
    },
    {
      id: 2,
      name: "AI Customer Support",
      description: "AI-powered customer support solution.",
      price: 7999,
      category: "AI Services",
      sales: 28,
      status: "Active",
    },
    {
      id: 3,
      name: "Marketing Automation",
      description: "Automated WhatsApp marketing solution.",
      price: 5499,
      category: "Marketing",
      sales: 16,
      status: "Inactive",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    status: "Active",
  });

  // ============================================================
  // OPEN CREATE MODAL
  // ============================================================
  const openCreateModal = () => {
    setEditingProduct(null);

    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      status: "Active",
    });

    setShowModal(true);
  };

  // ============================================================
  // OPEN EDIT MODAL
  // ============================================================
  const openEditModal = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      status: product.status,
    });

    setShowModal(true);
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================
  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);

    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      status: "Active",
    });
  };

  // ============================================================
  // FORM CHANGE
  // ============================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ============================================================
  // SAVE PRODUCT
  // ============================================================
  const saveProduct = () => {
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.price ||
      !formData.category.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (editingProduct) {
      // UPDATE EXISTING PRODUCT
      setProducts((current) =>
        current.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                category: formData.category,
                status: formData.status,
              }
            : product
        )
      );
    } else {
      // CREATE NEW PRODUCT
      const newProduct = {
        id: Date.now(),
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        sales: 0,
        status: formData.status,
      };

      setProducts((current) => [
        ...current,
        newProduct,
      ]);
    }

    closeModal();
  };

  // ============================================================
  // TOGGLE PRODUCT STATUS
  // ============================================================
  const toggleProduct = (id) => {
    setProducts((current) =>
      current.map((product) =>
        product.id === id
          ? {
              ...product,
              status:
                product.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : product
      )
    );
  };

  // ============================================================
  // DELETE PRODUCT
  // ============================================================
  const deleteProduct = (id) => {
    const product = products.find(
      (item) => item.id === id
    );

    const confirmed = window.confirm(
      `Delete "${product?.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setProducts((current) =>
      current.filter((product) => product.id !== id)
    );
  };

  // ============================================================
  // SEARCH + FILTER
  // ============================================================
  const filteredProducts = products.filter((product) => {
    const matchesSearch = Object.values(product)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All Products" ||
      product.status === filter;

    return matchesSearch && matchesFilter;
  });

  // ============================================================
  // SUMMARY
  // ============================================================
  const activeProducts = products.filter(
    (product) => product.status === "Active"
  ).length;

  const totalSales = products.reduce(
    (total, product) => total + product.sales,
    0
  );

  // ============================================================
  // UI
  // ============================================================
  return (
    <div className="commerce-page">

      {/* ========================================================
          HEADER
      ======================================================== */}
      <div className="commerce-header">
        <div>
          <h2>Commerce</h2>

          <p>
            Manage your products, services and WhatsApp commerce.
          </p>
        </div>

        <button
          className="commerce-create-btn"
          onClick={openCreateModal}
        >
          <FaPlus />
          Add Product
        </button>
      </div>

      {/* ========================================================
          SUMMARY
      ======================================================== */}
      <div className="commerce-summary">

        <div className="commerce-stat-card">
          <div className="commerce-stat-icon">
            <FaBox />
          </div>

          <div>
            <span>Total Products</span>
            <strong>{products.length}</strong>
          </div>
        </div>

        <div className="commerce-stat-card">
          <div className="commerce-stat-icon active">
            <FaPowerOff />
          </div>

          <div>
            <span>Active Products</span>
            <strong>{activeProducts}</strong>
          </div>
        </div>

        <div className="commerce-stat-card">
          <div className="commerce-stat-icon sales">
            <FaChartLine />
          </div>

          <div>
            <span>Total Sales</span>
            <strong>{totalSales}</strong>
          </div>
        </div>

        <div className="commerce-stat-card">
          <div className="commerce-stat-icon orders">
            <FaShoppingCart />
          </div>

          <div>
            <span>Orders</span>
            <strong>{totalSales}</strong>
          </div>
        </div>

      </div>

      {/* ========================================================
          SEARCH + FILTER
      ======================================================== */}
      <div className="commerce-toolbar">

        <div className="commerce-search">
          <FaSearch />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <select
          className="commerce-filter"
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
        >
          <option value="All Products">
            All Products
          </option>

          <option value="Active">
            Active
          </option>

          <option value="Inactive">
            Inactive
          </option>
        </select>

      </div>

      {/* ========================================================
          PRODUCT LIST
      ======================================================== */}
      <div className="commerce-list">

        {filteredProducts.length === 0 ? (
          <div className="commerce-empty">

            <FaBox />

            <h3>No products found</h3>

            <p>
              Try changing your search or filter.
            </p>

            <button
              className="commerce-create-btn"
              onClick={openCreateModal}
            >
              <FaPlus />
              Add Product
            </button>

          </div>
        ) : (
          filteredProducts.map((product) => (

            <div
              className="commerce-item"
              key={product.id}
            >

              {/* LEFT */}
              <div className="commerce-item-left">

                <div className="commerce-avatar">
                  <FaShoppingCart />
                </div>

                <div className="commerce-info">

                  <div className="commerce-title-row">

                    <h3>
                      {product.name}
                    </h3>

                    <span
                      className={`commerce-status ${
                        product.status === "Active"
                          ? "commerce-status-active"
                          : "commerce-status-inactive"
                      }`}
                    >
                      {product.status}
                    </span>

                  </div>

                  <p>
                    {product.description}
                  </p>

                  <div className="commerce-details">

                    <span>
                      <strong>Price:</strong>{" "}
                      ₹
                      {Number(
                        product.price
                      ).toLocaleString("en-IN")}
                    </span>

                    <span>
                      <strong>Category:</strong>{" "}
                      {product.category}
                    </span>

                    <span>
                      <strong>Sales:</strong>{" "}
                      {product.sales}
                    </span>

                  </div>

                </div>

              </div>

              {/* ACTIONS */}
              <div className="commerce-actions">

                <button
                  className="commerce-action-btn"
                  title="Toggle product"
                  onClick={() =>
                    toggleProduct(product.id)
                  }
                >
                  <FaPowerOff />
                </button>

                <button
                  className="commerce-action-btn"
                  title="Edit product"
                  onClick={() =>
                    openEditModal(product)
                  }
                >
                  <FaEdit />
                </button>

                <button
                  className="commerce-action-btn delete"
                  title="Delete product"
                  onClick={() =>
                    deleteProduct(product.id)
                  }
                >
                  <FaTrash />
                </button>

              </div>

            </div>

          ))
        )}

      </div>

      {/* ========================================================
          FOOTER
      ======================================================== */}
      <div className="commerce-footer">
        Showing {filteredProducts.length} of{" "}
        {products.length} products
      </div>

      {/* ========================================================
          ADD / EDIT PRODUCT MODAL
      ======================================================== */}
      {showModal && (

        <div
          className="commerce-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="commerce-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}
            <div className="commerce-modal-header">

              <div>
                <h3>
                  {editingProduct
                    ? "Edit Product"
                    : "Add Product"}
                </h3>

                <p>
                  {editingProduct
                    ? "Update product details."
                    : "Create a new product for WhatsApp commerce."}
                </p>
              </div>

              <button
                className="commerce-modal-close"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            {/* FORM */}
            <div className="commerce-form">

              <label>
                Product Name *
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleChange}
              />

              <label>
                Description *
              </label>

              <textarea
                name="description"
                placeholder="Enter product description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />

              <div className="commerce-form-row">

                <div>
                  <label>
                    Price *
                  </label>

                  <input
                    type="number"
                    name="price"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label>
                    Category *
                  </label>

                  <input
                    type="text"
                    name="category"
                    placeholder="e.g. Services"
                    value={formData.category}
                    onChange={handleChange}
                  />
                </div>

              </div>

              <label>
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>

            </div>

            {/* MODAL FOOTER */}
            <div className="commerce-modal-footer">

              <button
                className="commerce-cancel-btn"
                onClick={closeModal}
              >
                Cancel
              </button>

              <button
                className="commerce-save-btn"
                onClick={saveProduct}
              >
                {editingProduct
                  ? "Update Product"
                  : "Save Product"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default CommercePage;