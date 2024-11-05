import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const UseUrlParamsManager = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const addParams = (params) => {
        const url = new URLSearchParams(location.search);
        Object.keys(params).forEach(key => {
            url.set(key, params[key]);
        })
        navigate({ search: url.toString() })
    }

    const removeParams = (params) => {
        const url = new URLSearchParams(location.search);
        Object.keys(params).forEach(key => {
            url.delete(key);
        })
        navigate({ search: url.toString() })
    }

    //eliminar solo uno
    const removeParam = (param) => {
        const url = new URLSearchParams(location.search);
        url.delete(param);
        navigate({ search: url.toString() });
    };

    return { addParams, removeParams, removeParam };
}

export default UseUrlParamsManager