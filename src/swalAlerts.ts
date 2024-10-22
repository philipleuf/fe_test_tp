import Swal from "sweetalert2";
import { blueButtonColor } from "./constants";

export const successAlert = (text: string) => {
  Swal.fire({
    confirmButtonColor: blueButtonColor,
    title: "Success",
    icon: "success",
    text,
  });
};

export const errorAlert = (text: string) => {
  Swal.fire({
    confirmButtonColor: blueButtonColor,
    title: "Error",
    icon: "error",
    text,
  });
};
