import { useCallback } from "react";
import toast from "react-hot-toast";

export function useToast() {
  const showSuccess = useCallback((message) => {
    toast.success(message);
  }, []);

  const showError = useCallback((message) => {
    toast.error(message);
  }, []);

  const showLoading = useCallback((message) => {
    return toast.loading(message);
  }, []);

  const updateToast = useCallback((toastId, message, type = "success") => {
    if (type === "success") {
      toast.success(message, { id: toastId });
    } else if (type === "error") {
      toast.error(message, { id: toastId });
    }
  }, []);

  return { showSuccess, showError, showLoading, updateToast };
}
