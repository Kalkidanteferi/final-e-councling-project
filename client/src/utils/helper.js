export function checkEmpty(obj){
    for (const key in obj){
        if (obj[key] === ''){
            return {
                value: key.replace(/_/g, ''),
                type: 'error'
            }
        }else {
            return {
                value: key.replace(/_/g, ''),
                type: 'error'
            }
        }
    }
}