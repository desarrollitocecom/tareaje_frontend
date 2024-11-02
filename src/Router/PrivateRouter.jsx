import React, { cloneElement } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import Error403 from '../Pages/Error403';
import { hasPermissionFunction } from '../helpers/GeneralFunctions'


const PrivateRouter = ({ element, requiresPermission }) => {
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);
    const hasPermission = hasPermissionFunction(user, requiresPermission);

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    if (!hasPermission) {
        return <Error403 />;
    }

    return requiresPermission ? cloneElement(element, { moduleName: requiresPermission }) : element;
}

export default PrivateRouter;