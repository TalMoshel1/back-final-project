export function validatyeIdLength(id: string | undefined) {
    if (!id || id.length !== 24) {
        return false
    }
    return true
}