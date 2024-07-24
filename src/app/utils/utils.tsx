const isEmptyObject = (obj: object) : boolean => {
    return Object.keys(obj).length === 0;
}

const isEmpty = (value: any) : boolean => {
    if (value === null || value === undefined) {
        return true;
    }
    if (typeof value === 'string') {
        return value.trim().length === 0;
    }
    if (Array.isArray(value)) {
        return value.length === 0;
    }
    if (typeof value === 'object') {
        return isEmptyObject(value)
    }
    return false
}
export default isEmpty;