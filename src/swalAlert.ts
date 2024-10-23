import Swal from "sweetalert2";
import { blueButtonColor } from "./constants";

export const swalAlert = (success: boolean, text: string) => {
  Swal.fire({
    confirmButtonColor: blueButtonColor,
    title: success ? "Success" : "Error",
    icon: success ? "success" : "error",
    text,
  });
};

