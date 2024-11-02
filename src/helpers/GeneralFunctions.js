export function SortData(data, orderBy, orderDirection) {
    return [...data]
        .sort((a, b) => {
            // Separar orderBy por puntos para acceder a propiedades anidadas
            const orderByKeys = orderBy.split('.');

            // Acceder a las propiedades anidadas
            const aValue = orderByKeys.reduce((obj, key) => (obj && obj[key] !== undefined) ? obj[key] : null, a);
            const bValue = orderByKeys.reduce((obj, key) => (obj && obj[key] !== undefined) ? obj[key] : null, b);

            // Comprobar el orden
            if (orderDirection === 'asc') {
                return aValue < bValue ? -1 : 1;
            }
            return aValue > bValue ? -1 : 1;
        });
}

export const formatFirstNameLastName = (nombes, apellidos) => {
    const firstName = nombes.trim().split(" ")[0];
    const lastName = apellidos.trim().split(" ")[0];
    return `${firstName} ${lastName}`;
}