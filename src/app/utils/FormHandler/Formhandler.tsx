import React, {useEffect, useState} from 'react';

type FormElements = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

interface ValidationSchema {
    [key: string]: any;
}

interface Errors {
    [key: string]: string;
}

interface MyForm {
    isSubmitted: boolean;
}

const isEmpty = (obj: any) => {
    return Object.keys(obj).length === 0;
};

const FormHandler = (
    callback: () => void,
    validate: (values: { [key: string]: any }, schema: ValidationSchema) => Errors,
    schema: ValidationSchema,
    initValues: { [key: string]: any } = {}
): {
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    form: MyForm;
    handleChange: (event: React.ChangeEvent<FormElements>) => void;
    setValue: (value: { [p: string]: any }) => void;
    values: { [p: string]: any };
    initForm: (initValues: { [p: string]: any }) => void;
    errors: Errors
} => {
    const [values, setValues] = useState<{ [key: string]: any }>(initValues);
    const [errors, setErrors] = useState<Errors>({});
    const [form, setForm] = useState<MyForm>({isSubmitted: false});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isSubmitting) {
            const noErrors = Object.keys(errors).length === 0;
            if (noErrors) {
                callback();
                setIsSubmitting(false);
            } else {
                setIsSubmitting(false);
            }
        }
    }, [errors, isSubmitting, callback]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors(validate(values, schema));
        setIsSubmitting(true);
    };

    const handleChange = (event: React.ChangeEvent<FormElements>) => {
        const {name, value, type} = event.target;
        const newValue = type === 'checkbox' ? (event.target as HTMLInputElement).checked : value.trimStart()
        setValues((prevValues) => ({...prevValues, [name]: newValue}));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validate({...values, [name]: newValue}, schema)[name],
        }));
    };

    const setValue = (value: { [key: string]: any }) => {
        setValues((prevValues) => ({...prevValues, ...value}));
        setErrors(validate({...values, ...value}, schema));
    };

    const initForm = (initValues: { [key: string]: any }) => {
        setValues(initValues);
        setErrors({});
        setForm({isSubmitted: false});
        setIsSubmitting(false);
    };

    return {
        handleChange,
        handleSubmit,
        initForm,
        setValue,
        values,
        errors,
        form,
    };
};

export default FormHandler;