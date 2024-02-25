import FormData from "form-data"

if (!FormData.prototype.getHeaders) {
    FormData.prototype.getHeaders = () => ({})
}

export default FormData