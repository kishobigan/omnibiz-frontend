"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Input from "@/app/widgets/input/Input";
import Dropdown from "@/app/widgets/dropdown/dropdown";
import FormHandler from "@/app/utils/FormHandler/Formhandler";
import { validate, inventorySchema } from "@/app/utils/Validation/validations";
import Cookies from "js-cookie";
import { ACCESS_TOKEN } from "@/app/utils/Constants/constants";
import { useParams } from "next/navigation";
import api from "@/app/utils/Api/api";
import Button from "@/app/widgets/Button/Button";
import Loader from "@/app/widgets/loader/loader";
import AddItemForm from "@/app/components/Inventory/addItemForm/addItem";
import AddCategoryForm from "@/app/components/Inventory/addCategoryForm/addCategory";

interface CreateInventoryProps {
  type: "Add" | "Edit" | "View";
  show: boolean;
  onHide: () => void;
  selectedInventory?: any;
  update?: () => void;
}

const CreateInventoryForm: React.FC<CreateInventoryProps> = ({
  type,
  show,
  onHide,
  selectedInventory,
  update,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [items, setItems] = useState<{ value: string; label: string }[]>([]);
  const [suppliers, setSuppliers] = useState<
    { value: string; label: string }[]
  >([]);
  const token = Cookies.get(ACCESS_TOKEN);
  const { business_id } = useParams();

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCreateInventoryModal, setShowCreateInventoryModal] =
    useState(show);

  type FormElements =
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement;

  const initValues = {
    item: "",
    category: "",
    quantity: "",
    buyingPrice: "",
    sellingPrice: "",
    suppliers: "",
  };

  const { handleChange, handleSubmit, values, setValue, errors, initForm } =
    FormHandler(() => setIsSubmit(true), validate, inventorySchema, initValues);

  useEffect(() => {
    if (type === "Edit" && selectedInventory) {
      initForm(selectedInventory);
    }
  }, [initForm, selectedInventory, type]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get(
          `inventory/list-category/${business_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          console.log("Categories fetched:", response.data);
          const fetchedCategories = response.data.map((category: any) => ({
            value: category.category_id,
            label: category.name,
          }));
          setCategories(fetchedCategories);
          console.log("Fetched categories", fetchedCategories);
        } else {
          setErrorMessage("Failed to fetch categories.");
        }
      } catch (error) {
        setErrorMessage("Failed to fetch categories.");
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [business_id, token, update]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get(`inventory/list-item/${business_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          console.log("Items fetched:", response.data);
          const fetchedItems = response.data.map((item: any) => ({
            value: item.item_id,
            label: item.name,
          }));
          setItems(fetchedItems);
          console.log("Fetched items", fetchedItems);
        } else {
          setErrorMessage("Failed to fetch items.");
        }
      } catch (error) {
        setErrorMessage("Failed to fetch items.");
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, [business_id, token, update]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await api.get(
          `suppliers/get-supplier/${business_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          console.log("Suppliers fetched:", response.data);
          const fetchedSuppliers = response.data.map((supplier: any) => ({
            value: supplier.supplier_id,
            label: supplier.supplier_name,
          }));
          setSuppliers(fetchedSuppliers);
          console.log("Fetched suppliers", fetchedSuppliers);
        } else {
          setErrorMessage("Failed to fetch suppliers.");
        }
      } catch (error) {
        setErrorMessage("Failed to fetch suppliers.");
        console.error("Error fetching suppliers:", error);
      }
    };
    fetchSuppliers();
  }, [business_id, token, update]);

  useEffect(() => {
    const submitData = async () => {
      if (!isSubmit) return;
      setLoading(true);
      try {
        const requestData = {
          business_id: business_id,
          suppliers: values.suppliers,
          inventory_items: [
            {
              item: parseInt(values.item, 10),
              category: parseInt(values.category, 10),
              quantity: values.quantity,
              buying_price: values.buyingPrice,
              selling_price: values.sellingPrice,
            },
          ],
        };
        if (type === "Add") {
          const response = await api.post(
            "inventory/create-inventory",
            requestData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.status === 201) {
            console.log("Inventory created successfully", response.data);
            onHide();
            if (update) update();
          } else {
            setErrorMessage("Oops! something went wrong.");
            console.log("Error in creating inventory", response.data.message);
          }
        } else if (type === "Edit") {
          const response = await api.put(``, requestData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status === 200) {
            console.log("Business updated successfully", response.data);
            if (update) update();
            onHide();
          } else {
            console.log("Error in updating ");
            setErrorMessage("Oops! something went wrong.");
          }
        }
      } catch (error) {
        console.log("Error in submitting inventory data", error);
        setErrorMessage("Oops! Something went wrong, try again later.");
      } finally {
        setLoading(false);
        setIsSubmit(false);
        initForm(initValues);
      }
    };
    submitData();
  }, [isSubmit, update]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    handleChange({
      target: {
        name: "category",
        value: value,
      } as unknown as FormElements,
    } as React.ChangeEvent<FormElements>);
  };
  const handleItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    handleChange({
      target: {
        name: "item",
        value: value,
      } as unknown as FormElements,
    } as React.ChangeEvent<FormElements>);
  };
  const handleFormSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    handleSubmit({
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>);
  };

  const handleAddCategoryHide = () => {
    setShowCategoryModal(false);
    setShowCreateInventoryModal(true);
  };

  const handleAddItemHide = () => {
    setShowItemModal(false);
    setShowCreateInventoryModal(true);
  };

  useEffect(() => {
    setShowCreateInventoryModal(show);
  }, [show]);

  const errorStyle = {
    color: "red",
    fontSize: "13px",
    marginTop: "5px",
    marginBottom: "10px",
  };

  return (
    <>
      <Modal
        show={showCreateInventoryModal}
        onHide={() => {
          if (type !== "View") initForm(initValues);
          onHide();
          setErrorMessage(null);
        }}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {type === "Add" && <div>Create Inventory</div>}
            {type === "View" && <div>View Inventory</div>}
            {type === "Edit" && <div>Edit Inventory</div>}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="row g-3 ms-5 me-5">
            <div className="col-md-6">
              <div className="form-group">
                <Dropdown
                  label="Item"
                  options={items}
                  value={values.item}
                  onChange={handleItemChange}
                  name="item"
                />
                {errors.item && <span style={errorStyle}>{errors.item}</span>}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <Dropdown
                  label="Category"
                  options={categories}
                  value={values.category}
                  onChange={handleCategoryChange}
                  name="category"
                />
                {errors.category && (
                  <span style={errorStyle}>{errors.category}</span>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <Input
                  label="Quantity"
                  placeholder="Enter quantity"
                  type={"Number"}
                  name="quantity"
                  value={values.quantity}
                  onChange={handleChange}
                />
                {errors.quantity && (
                  <span style={errorStyle}>{errors.quantity}</span>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <Input
                  label="Buying Price"
                  placeholder="Enter buying price"
                  type={"text"}
                  name="buyingPrice"
                  value={values.buyingPrice}
                  onChange={handleChange}
                />
                {errors.buyingPrice && (
                  <span style={errorStyle}>{errors.buyingPrice}</span>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <Input
                  label="Selling Price"
                  placeholder="Enter selling price"
                  type={"text"}
                  name="sellingPrice"
                  value={values.sellingPrice}
                  onChange={handleChange}
                />
                {errors.sellingPrice && (
                  <span style={errorStyle}>{errors.sellingPrice}</span>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <Dropdown
                  label="Suppliers"
                  options={suppliers}
                  value={values.suppliers}
                  onChange={handleChange}
                  name="suppliers"
                />
                {errors.suppliers && (
                  <span style={errorStyle}>{errors.suppliers}</span>
                )}
              </div>
            </div>
            {errorMessage && <p className="error">{errorMessage}</p>}
          </form>
          <div className="row g-3 ms-5 me-5">
            <div className="d-flex justify-content-end mt-3">
              <div className="col-6 d-flex justify-content-end">
                <Button
                  onClick={() => {
                    setShowCategoryModal(true);
                    setShowCreateInventoryModal(false);
                  }}
                  variant="light"
                  className="me-2 buttonWithPadding"
                >
                  Add Category
                </Button>
                <Button
                  onClick={() => {
                    setShowItemModal(true);
                    setShowCreateInventoryModal(false);
                  }}
                  variant="light"
                  className="buttonWithPadding"
                >
                  Add Item
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="light"
            onClick={() => {
              if (type !== "View") initForm(initValues);
              onHide();
              setErrorMessage(null);
            }}
          >
            Cancel
          </Button>
          {type !== "View" && (
            <Button variant="dark" onClick={handleFormSubmit}>
              {loading ? <Loader /> : type === "Add" ? "Create" : "Update"}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <AddCategoryForm
        show={showCategoryModal}
        onHide={handleAddCategoryHide}
      />
      <AddItemForm show={showItemModal} onHide={handleAddItemHide} />
    </>
  );
};

export default CreateInventoryForm;
