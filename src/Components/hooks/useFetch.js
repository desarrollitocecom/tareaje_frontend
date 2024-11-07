import axios from 'axios'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import CustomSwal from '../../helpers/swalConfig';
import { logout, moduleLoading } from '../../Redux/Slices/AuthSlice';

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
      return { isAuthError: true, message: 'Sesión expirada' }
    }
    return { isAuthError: false }
  }

  const getData = async (url, token, lazy = false) => {
    try {
      !lazy && dispatch(moduleLoading(true))
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer___${token}` },
      });

      return {
        data: response.data,
        status: true
      }

    } catch (error) {

      const authError = handleAuthError(error)
      if (authError.isAuthError) return authError

      return {
        error: error,
        status: false
      }
    } finally {
      dispatch(moduleLoading(false))
    }

  }

  const postData = async (url, data, token, lazy = false) => {
    try {
      !lazy && dispatch(moduleLoading(true))
      const response = await axios.post(url, data, {
        headers: { Authorization: `Bearer___${token}` },
      });

      return {
        data: response.data,
        status: true
      }

    } catch (error) {
      const authError = handleAuthError(error)
      if (authError.isAuthError) return authError

      return {
        error: error,
        status: false
      }
    } finally {
      dispatch(moduleLoading(false))
    }
  }

  const patchData = async (url, data, token, lazy = false) => {
    try {
      !lazy && dispatch(moduleLoading(true))
      const response = await axios.patch(url, data, {
        headers: { Authorization: `Bearer___${token}` },
      });

      return {
        data: response.data,
        status: true
      }

    } catch (error) {
      const authError = handleAuthError(error)
      if (authError.isAuthError) return authError

      return {
        error: error,
        status: false
      }
    } finally {
      dispatch(moduleLoading(false))
    }
  }

  const deleteData = async (url, token, lazy = false) => {
    try {
      !lazy && dispatch(moduleLoading(true))
      const response = await axios.delete(url, {
        headers: { Authorization: `Bearer___${token}` },
      });

      return {
        data: response.data,
        status: true
      }

    } catch (error) {
      const authError = handleAuthError(error)
      if (authError.isAuthError) return authError

      return {
        error: error,
        status: false
      }
    } finally {
      dispatch(moduleLoading(false))
    }
  }


  return { getData, postData, patchData, deleteData }
}

export default useFetch