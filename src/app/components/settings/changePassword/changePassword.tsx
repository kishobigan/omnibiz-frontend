"use client";
import React, { useState } from "react";
import Input from "@/app/widgets/input/Input";
import Button from "@/app/widgets/Button/Button";
import FormHandler from "@/app/utils/FormHandler/Formhandler";
import {
  validate,
  changePasswordSchema,
} from "@/app/utils/Validation/validations";
import api from "@/app/utils/Api/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { ACCESS_TOKEN } from "@/app/utils/Constants/constants";
import Loader from "@/app/widgets/loader/loader";
import { FaLocationArrow, FaLock } from "react-icons/fa";

const ChangePassword: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const validateForm = (values: { [key: string]: any }) => {
    return validate(values, changePasswordSchema);
  };

  const { handleChange, handleSubmit, values, errors } = FormHandler(
    async () => {
      setLoading(true);
      try {
        const token = Cookies.get(ACCESS_TOKEN);
        const response = await api.post(
          "auth/change-password",
          {
            old_password: values.oldPassword,
            new_password: values.newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          // Handle success (e.g., redirect to login page)
          // router.push("/pages/signin");
          setLoading(false)
        } else {
          console.error(response.data.message);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error changing password", error);
        setLoading(false);
      }
    },
    validateForm,
    changePasswordSchema
  );

  const errorStyle = {
    color: "red",
    fontSize: "13px",
    marginTop: "5px",
    marginBottom: "10px",
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="container-fluid">
        <h3 className="mb-3">
          <b>Change Password</b>
        </h3>
        <Input
          label="Old Password"
          placeholder="Enter your old password"
          icon={<FaLock />}
          type="password"
          value={values.oldPassword || ""}
          onChange={handleChange}
          name="oldPassword"
        />
        {errors.oldPassword && <span style={errorStyle}>{errors.oldPassword}</span>}
        <Input
          label="New Password"
          placeholder="Enter your new password"
          icon={<FaLock />}
          type="password"
          value={values.newPassword || ""}
          onChange={handleChange}
          name="newPassword"
        />
        {errors.newPassword && <span style={errorStyle}>{errors.newPassword}</span>}
        
        <Button type="submit" variant="dark">
          {loading ? <Loader /> : "Change Password"}
        </Button>
      </div>
    </form>
  );
};

export default ChangePassword;
