function parseStringFileSizeToBytes(sizeString: string): number {
    const [, size, unit] = sizeString.match(/^([\d.,]+)\s*(\w+)$/i) || []

    if (!size || !unit) {
        throw new Error("Formato inválido. Use um formato como '682,57 KB'.")
    }

    const sizeNum = parseFloat(size.replace(",", "."))

    switch (unit.toUpperCase()) {
        case "B":
        case "BYTES":
            return sizeNum
        case "KB":
            return sizeNum * Math.pow(1024, 1)
        case "MB":
            return sizeNum * Math.pow(1024, 2)
        case "GB":
            return sizeNum * Math.pow(1024, 3)
        case "TB":
            return sizeNum * Math.pow(1024, 4)
        case "PB":
            return sizeNum * Math.pow(1024, 5)
        case "EB":
            return sizeNum * Math.pow(1024, 6)
        case "ZB":
            return sizeNum * Math.pow(1024, 7)
        case "YB":
            return sizeNum * Math.pow(1024, 8)
        default:
            throw new Error("Unidade de tamanho inválida. Use B, KB, MB, GB, TB, PB, EB, ZB ou YB.")
    }
}

export {
    parseStringFileSizeToBytes
}