import Swal from "sweetalert2";

export const successAlert = (text: string) => {
  Swal.fire({
    confirmButtonColor: "#3498db",
    title: "Success",
    icon: "success",
    text,
  });
};

export const errorAlert = (text: string) => {
  Swal.fire({
    confirmButtonColor: "#3498db",
    title: "Error",
    icon: "error",
    text,
  });
};
