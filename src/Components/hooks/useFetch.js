import axios from 'axios'
import React from 'react'
import { useDispatch } from 'react-redux';
import CustomSwal from '../../helpers/swalConfig';
import { logout } from '../../Redux/Slices/AuthSlice';

function useFetch() {
  const dispatch = useDispatch()

  const handleAuthError = (error) => {
    if (error.response && error.response.status === 401) {
      CustomSwal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
        didClose: () => {
          dispatch(logout())
        }
      })
    }
  }

  const getData = async (url, token) => {
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer___${token}` },
      });

      return {
        data: response.data,
        status: true
      }

    } catch (error) {

      handleAuthError(error)

      return {
        error: error,
        status: false
      }
    }

  }

  const postData = async (url, data, token) => {
    try {
      const response = await axios.post(url, data, {
        headers: { Authorization: `Bearer___${token}` },
      });

      return {
        data: response.data,
        status: true
      }

    } catch (error) {
      handleAuthError(error)

      return {
        error: error,
        status: false
      }
    }
  }

  const putData = async (url, data, token) => {
    try {
      const response = await axios.put(url, data, {
        headers: { Authorization: `Bearer___${token}` },
      });

      return {
        data: response.data,
        status: true
      }

    } catch (error) {
      handleAuthError(error)

      return {
        error: error,
        status: false
      }
    }
  }

  const deleteData = async (url, token) => {
    try {
      const response = await axios.delete(url, {
        headers: { Authorization: `Bearer___${token}` },
      });

      return {
        data: response.data,
        status: true
      }

    } catch (error) {
      handleAuthError(error)

      return {
        error: error,
        status: false
      }
    }
  }


  return { getData, postData, putData, deleteData }
}

export default useFetch