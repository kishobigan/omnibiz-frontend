import isEmpty from "@/app/utils/utils";

type ValidationRule = {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string, formData: { [key: string]: any }) => string | null;
    minSelected?: number;
}

type ValidationSchema = {
    [field: string]: ValidationRule;
}

type ValidationErrors = {
    [field: string]: string;
}

export const validate = (formData: { [key: string]: any }, schema: ValidationSchema): ValidationErrors => {
    const errors: ValidationErrors = {};

    Object.keys(schema).forEach((field) => {
        const value = formData[field];
        const rules = schema[field];

        if (rules.required && isEmpty(value)) {
            errors[field] = 'This field is required.';
        } else if (value !== undefined) {
            if (rules.minLength && value.length < rules.minLength) {
                errors[field] = `Must be at least ${rules.minLength} characters long`;
            }

            if (rules.maxLength && value.length > rules.maxLength) {
                errors[field] = `Must be no more than ${rules.maxLength} characters long`;
            }

            if (rules.pattern && !rules.pattern.test(value)) {
                errors[field] = 'Invalid format';
            }

            if (rules.custom) {
                const customError = rules.custom(value, formData);
                if (customError) {
                    errors[field] = customError;
                }
            }
        }
    });
    return errors;
};


export const signupSchema: ValidationSchema = {
    email: {
        required: true,
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },
    password: {
        required: true,
        minLength: 5,
    },
    conPassword: {
        required: true,
        custom: (value, formData) => value !== formData.password ? 'Passwords do not match' : null,
    }
};

export const signinSchema: ValidationSchema = {
    email: {
        required: true,
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },
    password: {
        required: true,
    }
}

export const addSupplierSchema: ValidationSchema = {
    supplierName: {
        required: true,
    },
    supplierAddress: {
        required: true,
    },
    email: {
        required: true,
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },
    phone: {
        required: true,
        pattern: /^[0-9]{10,15}$/,
    },
    supplierWebsite: {
        required: true
    }
    // amount: {
    //     required: true,
    //     pattern: /^(?:[1-9]\d*|0)?(?:\.\d{1,2})?$/,
    // },
    // paybackPeriod: {
    //     required: true,
    // },
    // status: {
    //     required: true,
    // }
};

export const businessSchema: ValidationSchema = {
    business_name: {
        required: true,
    },

    business_address: {
        required: true,
    },
    phone_number: {
        required: true,
        pattern: /^[0-9]{10,15}$/,
    },
    initial: {
        required: true,
        pattern: /^(?:[1-9]\d*|0)?(?:\.\d{1,2})?$/,
    },
    logo: {
        required: false,
    }
};

export const staffSchema: ValidationSchema = {
    role_name: {
        required: true,
    },
    email: {
        required: true,
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },
};

export const createOwnerSchema: ValidationSchema = {
    firstname: {
        required: true,

    },
    lastname: {
        required: true,

    },
    phone: {
        required: true,
        pattern: /^[0-9]{10}$/,
    },
    email: {
        required: true,
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },


};

export const inventorySchema: ValidationSchema = {
    item: {
        required: true,
    },
    category: {
        required: true,
    },
    quantity: {
        required: true,
    },
    buyingPrice: {
        required: true,
        pattern: /^(?:[1-9]\d*|0)?(?:\.\d{1,2})?$/,
    },
    sellingPrice: {
        required: true,
        pattern: /^(?:[1-9]\d*|0)?(?:\.\d{1,2})?$/,
    },

    suppliers: {
        required: true,
    },

};

export const paymentSchema: ValidationSchema = {}

export const createOrderSchema: ValidationSchema = {
    delivery_date: {
        required: true,
        pattern: /^\d{4}-\d{2}-\d{2}$/,
    },
    amount_ordered: {
        required: true,
        pattern: /^(?:[1-9]\d*|0)?(?:\.\d{1,2})?$/,
    },
    amount_paid: {
        required: true,
        pattern: /^(?:[1-9]\d*|0)?(?:\.\d{1,2})?$/,
    },
    amount_due_date: {
        required: true,
        pattern: /^\d{4}-\d{2}-\d{2}$/,
    },
    supplier: {
        required: true,
        pattern: /^[a-zA-Z0-9]+$/, // Assuming supplier ID is alphanumeric
    }
}

export const highStaffSchema: ValidationSchema = {
    email: {
        required: true,
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },
    selectedBusinesses: {
        required: true,
        custom: (value) => (!value || value.length === 0 ? 'At least one business must be selected' : null),
    }
};


export const createItemSchema: ValidationSchema = {
    name: {
        required: true,
    },
    category: {
        required: true,
    },
    description: {
        required: true,
    },
    unit_price: {
        required: true,
    },
    quantity_type: {
        required: true,
    },
    stock_alert: {
        required: true,
    },
    restock_level: {
        required: true,
    },
}

export const createCategorySchema: ValidationSchema = {
    name: {
        required: true,
    },
    description: {
        required: true,
    },
}

export const billingSchema: ValidationSchema = {
    customerName: {
        required: false,
    },
    phoneNumber: {
        required: false,
        pattern: /^[0-9]{10,15}$/,
    },
    address: {
        required: false
    },
    item: {
        required: false,
    },
    quantity: {
        required: true,
        pattern: /^[1-9]\d*$/,
    },
    discount: {
        required: false,
        pattern: /^([1-9]\d?|100)$/,
    },
}

export const createAdminSchema: ValidationSchema = {
    email: {
        required: true,
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    },
}

export const createAccessSchema: ValidationSchema = {
    permission: {
        required: true,
    },
    description: {
        required: true
    }
}

export const contractSchema: ValidationSchema={

}