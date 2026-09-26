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

      {/* ========================================================
          POPUP WHITE BORDER / FRAME STYLE
          ONLY MODAL THEME IS CHANGED
      ======================================================== */}
      <style>
        {`

          /* Dark blurred background */
          .commerce-modal-overlay {
            position: fixed !important;
            inset: 0 !important;
            width: 100vw !important;
            height: 100vh !important;

            display: flex !important;
            align-items: center !important;
            justify-content: center !important;

            background: rgba(3, 10, 18, 0.72) !important;

            backdrop-filter: blur(8px) !important;
            -webkit-backdrop-filter: blur(8px) !important;

            z-index: 99999 !important;

            padding: 24px !important;
            box-sizing: border-box !important;
          }


          /* ====================================================
             WHITE OUTER FRAME
             This is the exact white border you asked for.
          ==================================================== */
          .commerce-modal {
            width: 540px !important;
            max-width: calc(100vw - 48px) !important;

            max-height: calc(100vh - 48px) !important;

            box-sizing: border-box !important;

            /* WHITE BORDER */
            border: 12px solid #ffffff !important;

            border-radius: 18px !important;

            background: #071c21 !important;

            overflow: hidden !important;

            box-shadow:
              0 30px 80px rgba(0, 0, 0, 0.65),
              0 10px 35px rgba(0, 0, 0, 0.35) !important;

            animation: commerceModalIn 0.18s ease-out !important;
          }


          @keyframes commerceModalIn {
            from {
              opacity: 0;
              transform: translateY(8px) scale(0.98);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }


          /* ====================================================
             MODAL HEADER
          ==================================================== */
          .commerce-modal-header {
            background: #071c21 !important;

            padding: 20px 20px 18px !important;

            border-bottom: 1px solid #18343b !important;

            display: flex !important;
            align-items: flex-start !important;
            justify-content: space-between !important;

            gap: 16px !important;
          }


          .commerce-modal-header h3 {
            margin: 0 !important;

            color: #f8fafc !important;

            font-size: 20px !important;
            font-weight: 700 !important;

            line-height: 1.25 !important;
          }


          .commerce-modal-header p {
            margin: 6px 0 0 !important;

            color: #91a4ad !important;

            font-size: 12px !important;
            line-height: 1.5 !important;
          }


          /* ====================================================
             CLOSE BUTTON
          ==================================================== */
          .commerce-modal-close {
            width: 34px !important;
            height: 34px !important;

            min-width: 34px !important;

            display: flex !important;
            align-items: center !important;
            justify-content: center !important;

            border: 1px solid #ffffff !important;

            border-radius: 7px !important;

            background: #ffffff !important;

            color: #071c21 !important;

            font-size: 20px !important;
            font-weight: 600 !important;

            line-height: 1 !important;

            cursor: pointer !important;

            transition: 0.15s ease !important;
          }


          .commerce-modal-close:hover {
            background: #f1f5f9 !important;
            transform: scale(1.03) !important;
          }


          /* ====================================================
             FORM
          ==================================================== */
          .commerce-form {
            background: #071c21 !important;

            padding: 20px !important;
          }


          .commerce-form label {
            display: block !important;

            margin: 0 0 7px !important;

            color: #91a4ad !important;

            font-size: 12px !important;
            font-weight: 600 !important;
          }


          .commerce-form input,
          .commerce-form textarea,
          .commerce-form select {
            width: 100% !important;

            box-sizing: border-box !important;

            border: 1px solid #29434a !important;

            border-radius: 7px !important;

            background: #1d3037 !important;

            color: #e5edf0 !important;

            outline: none !important;

            font-size: 13px !important;

            font-family: inherit !important;

            transition: border-color 0.15s ease,
                        box-shadow 0.15s ease !important;
          }


          .commerce-form input {
            height: 40px !important;

            padding: 0 12px !important;

            margin-bottom: 16px !important;
          }


          .commerce-form textarea {
            min-height: 92px !important;

            padding: 11px 12px !important;

            resize: vertical !important;

            margin-bottom: 16px !important;
          }


          .commerce-form select {
            height: 40px !important;

            padding: 0 12px !important;

            margin-bottom: 0 !important;

            cursor: pointer !important;
          }


          .commerce-form input::placeholder,
          .commerce-form textarea::placeholder {
            color: #71848c !important;
          }


          .commerce-form input:focus,
          .commerce-form textarea:focus,
          .commerce-form select:focus {
            border-color: #8b5cf6 !important;

            box-shadow:
              0 0 0 2px rgba(139, 92, 246, 0.15) !important;
          }


          /* PRICE + CATEGORY */
          .commerce-form-row {
            display: grid !important;

            grid-template-columns: 1fr 1fr !important;

            gap: 12px !important;

            margin-bottom: 16px !important;
          }


          .commerce-form-row > div {
            min-width: 0 !important;
          }


          .commerce-form-row input {
            margin-bottom: 0 !important;
          }


          /* ====================================================
             MODAL FOOTER
          ==================================================== */
          .commerce-modal-footer {
            background: #071c21 !important;

            border-top: 1px solid #18343b !important;

            padding: 14px 20px !important;

            display: flex !important;

            align-items: center !important;

            justify-content: flex-end !important;

            gap: 10px !important;
          }


          /* CANCEL */
          .commerce-cancel-btn {
            height: 38px !important;

            padding: 0 16px !important;

            border: 1px solid #dbe4e8 !important;

            border-radius: 7px !important;

            background: #ffffff !important;

            color: #334155 !important;

            font-size: 12px !important;

            font-weight: 600 !important;

            cursor: pointer !important;

            transition: 0.15s ease !important;
          }


          .commerce-cancel-btn:hover {
            background: #f1f5f9 !important;
          }


          /* SAVE PRODUCT */
          .commerce-save-btn {
            height: 38px !important;

            padding: 0 18px !important;

            border: none !important;

            border-radius: 7px !important;

            background: linear-gradient(
              135deg,
              #8b5cf6,
              #7c3aed
            ) !important;

            color: #ffffff !important;

            font-size: 12px !important;

            font-weight: 700 !important;

            cursor: pointer !important;

            box-shadow:
              0 6px 18px rgba(124, 58, 237, 0.25) !important;

            transition: 0.15s ease !important;
          }


          .commerce-save-btn:hover {
            transform: translateY(-1px) !important;

            box-shadow:
              0 8px 22px rgba(124, 58, 237, 0.35) !important;
          }


          .commerce-save-btn:active {
            transform: translateY(0) !important;
          }


          /* ====================================================
             MOBILE
          ==================================================== */
          @media (max-width: 600px) {

            .commerce-modal-overlay {
              padding: 14px !important;
            }

            .commerce-modal {
              width: 100% !important;

              max-width: 100% !important;

              border-width: 8px !important;

              border-radius: 14px !important;
            }

            .commerce-modal-header {
              padding: 16px !important;
            }

            .commerce-form {
              padding: 16px !important;
            }

            .commerce-modal-footer {
              padding: 12px 16px !important;
            }

            .commerce-form-row {
              grid-template-columns: 1fr !important;

              gap: 0 !important;
            }

          }

        `}
      </style>

    </div>
  );
}

export default CommercePage;