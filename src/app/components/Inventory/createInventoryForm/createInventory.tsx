import React, { useState, useEffect } from "react";
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
  selectedInventory?: any;
  update?: () => void;
}

const CreateInventoryForm: React.FC<CreateInventoryProps> = ({
  type,
  selectedInventory,
  update,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [items, setItems] = useState<{ value: string; label: string }[]>([]);
  const [suppliers, setSuppliers] = useState<{ value: string; label: string }[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [updateState, setUpdate] = useState<boolean>(false); // Added update state
  const [selectedSupplier, setSelectedSupplier] = useState<string>(""); // Track selected supplier

  const token = Cookies.get(ACCESS_TOKEN);
  const { business_id } = useParams();

  const initValues = {
    item: "",
    category: "",
    quantity: "",
    buyingPrice: "",
    sellingPrice: "",
    suppliers: selectedSupplier, // Initialize with selected supplier
  };

  const { handleChange, handleSubmit, values, setValue, errors, initForm } = FormHandler(
    () => setIsSubmit(true),
    validate,
    inventorySchema,
    initValues
  );

  useEffect(() => {
    if (type === "Edit" && selectedInventory) {
      initForm(selectedInventory);
      setSelectedSupplier(selectedInventory.suppliers); // Set selected supplier for edit
    }
  }, [initForm, selectedInventory, type]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get(`inventory/list-category/${business_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          const fetchedCategories = response.data.map((category: any) => ({
            value: category.category_id,
            label: category.name,
          }));
          setCategories(fetchedCategories);
        } else {
          setErrorMessage("Failed to fetch categories.");
        }
      } catch (error) {
        setErrorMessage("Failed to fetch categories.");
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [business_id, token, updateState]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get(`inventory/list-item/${business_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          const fetchedItems = response.data.map((item: any) => ({
            value: item.item_id,
            label: item.name,
          }));
          setItems(fetchedItems);
        } else {
          setErrorMessage("Failed to fetch items.");
        }
      } catch (error) {
        setErrorMessage("Failed to fetch items.");
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, [business_id, token, updateState]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await api.get(`suppliers/get-supplier/${business_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          const fetchedSuppliers = response.data.map((supplier: any) => ({
            value: supplier.supplier_id,
            label: supplier.supplier_name,
          }));
          setSuppliers(fetchedSuppliers);
        } else {
          setErrorMessage("Failed to fetch suppliers.");
        }
      } catch (error) {
        setErrorMessage("Failed to fetch suppliers.");
        console.error("Error fetching suppliers:", error);
      }
    };
    fetchSuppliers();
  }, [business_id, token, updateState]);

  useEffect(() => {
    const submitData = async () => {
      if (!isSubmit) return;
      setLoading(true);
      try {
        const requestData = {
          business_id: business_id,
          suppliers: selectedSupplier, // Use selected supplier here
          inventory_items: inventoryItems.map((item) => ({
            item: parseInt(item.item, 10),
            category: parseInt(item.category, 10),
            quantity: item.quantity,
            buying_price: item.buyingPrice,
            selling_price: item.sellingPrice,
          })),
        };
        if (type === "Add") {
          const response = await api.post("inventory/create-inventory", requestData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status === 201) {
            if (update) update();
          } else {
            setErrorMessage("Oops! something went wrong.");
          }
        } else if (type === "Edit") {
          const response = await api.put(`inventory/update-inventory/${selectedInventory?.id}`, requestData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status === 200) {
            if (update) update();
          } else {
            setErrorMessage("Oops! something went wrong.");
          }
        }
      } catch (error) {
        setErrorMessage("Oops! Something went wrong, try again later.");
      } finally {
        setLoading(false);
        setIsSubmit(false);
        initForm(initValues);
        setInventoryItems([]);
        setSelectedSupplier(""); // Reset selected supplier
      }
    };
    submitData();
  }, [isSubmit, update, inventoryItems, updateState, selectedSupplier]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange(e);
  };
  
  const handleItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleChange(e);
  };

  const handleAddInventoryItem = () => {
    setInventoryItems([
      ...inventoryItems,
      {
        item: values.item,
        category: values.category,
        quantity: values.quantity,
        buyingPrice: values.buyingPrice,
        sellingPrice: values.sellingPrice,
      },
    ]);
    setValue({ ...initValues, suppliers: selectedSupplier });
  };

  const handleFormSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    handleSubmit({
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>);
  };

  const handleAddCategoryHide = () => {
    setShowCategoryModal(false);
  };

  const handleAddItemHide = () => {
    setShowItemModal(false);
  };

  const errorStyle = {
    color: "red",
    fontSize: "13px",
    marginTop: "5px",
  };

  return (
      <div className="create-inventory-form col-md-8 justify-contents-center align-items-center">
      <div className="mt-4 mb-3">
          <Button onClick={() => setShowCategoryModal(true)} variant="dark" className="me-2">
            Add Category
          </Button>
          <Button onClick={() => setShowItemModal(true)} variant="dark">
            Add Item
          </Button>
        </div>

        <form>
          <div className="row">
            <div className="col-md-6">
              <Dropdown
                label="Supplier"
                options={suppliers}
                value={selectedSupplier} // Display the selected supplier
                onChange={(e) => setSelectedSupplier(e.target.value)} // Update selected supplier
                name="suppliers"
              />
              {errors.suppliers && <span style={errorStyle}>{errors.suppliers}</span>}
            </div>
            <div className="col-md-6">
              <Dropdown
                label="Category"
                options={categories}
                value={values.category}
                onChange={handleCategoryChange}
                name="category"
              />
              {errors.category && <span style={errorStyle}>{errors.category}</span>}
            </div>
            <div className="col-md-6">
              <Dropdown
                label="Item"
                options={items}
                value={values.item}
                onChange={handleItemChange}
                name="item"
              />
              {errors.item && <span style={errorStyle}>{errors.item}</span>}
            </div>
            <div className="col-md-6">
              <Input
                label="Quantity"
                type="number"
                value={values.quantity}
                onChange={handleChange}
                name="quantity"
              />
              {errors.quantity && <span style={errorStyle}>{errors.quantity}</span>}
            </div>
            <div className="col-md-6">
              <Input
                label="Buying Price"
                type="number"
                value={values.buyingPrice}
                onChange={handleChange}
                name="buyingPrice"
              />
              {errors.buyingPrice && <span style={errorStyle}>{errors.buyingPrice}</span>}
            </div>
            <div className="col-md-6">
              <Input
                label="Selling Price"
                type="number"
                value={values.sellingPrice}
                onChange={handleChange}
                name="sellingPrice"
              />
              {errors.sellingPrice && <span style={errorStyle}>{errors.sellingPrice}</span>}
            </div>
            <div className="col-md-12">
              <Button onClick={handleAddInventoryItem} variant="light">
                Add 
              </Button>
              <Button onClick={handleFormSubmit} variant="light" className="ms-2">
                {type === "Add" ? "Create" : "Update"}
              </Button>
              {loading && <Loader />}
              {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
            </div>
          </div>

          
        </form>

  {/* Display Inventory Items */}
  {inventoryItems.length > 0 && (
            <div className="mt-4">
              <h3>Inventory Items</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Buying Price</th>
                    <th>Selling Price</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.item}</td>
                      <td>{item.category}</td>
                      <td>{item.quantity}</td>
                      <td>{item.buyingPrice}</td>
                      <td>{item.sellingPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        
        <AddCategoryForm
          show={showCategoryModal}
          onHide={handleAddCategoryHide}
          update={() => setUpdate(prev => !prev)}
        />
        <AddItemForm
          show={showItemModal}
          onHide={handleAddItemHide}
          update={() => setUpdate(prev => !prev)}
        />
      
      </div>
    
  );
};

export default CreateInventoryForm;



