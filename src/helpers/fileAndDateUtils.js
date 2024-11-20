// Calcular la edad según la fecha de nacimiento
export const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};

// Manejar el cambio de archivo
export const handleFileChange = (e, setFoto, CustomSwal) => {
    const file = e.target.files[0];
    if (file) {
        const allowedTypes = ['image/jpeg', 'image/png']; // Tipos permitidos
        if (!allowedTypes.includes(file.type)) {
            CustomSwal.fire('Error', 'Solo se permiten imágenes en formato JPG o PNG.', 'error');
            return;
        }
        setFoto(file); 
    }
};