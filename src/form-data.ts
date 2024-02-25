import OriginalFormData from "form-data"

let FormData: any = OriginalFormData

if (!FormData.prototype.getHeaders) {
    FormData.prototype.getHeaders = () => ({})
}

export default FormData