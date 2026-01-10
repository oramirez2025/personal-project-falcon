import { toaster } from "./toaster"

export const showErrorToast = (title, msg) => {
  toaster.create({
    title: title,
    description: msg,
    type: "error",
    duration: 5000,
    closable: true,
  })
}