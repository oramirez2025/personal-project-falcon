import {toaster} from "./toaster" 
export const showSuccessToast = (title, msg) => {
  toaster.create({
    title: `${title}`,
    description: `${msg}`,
    type: "success",
  })
}