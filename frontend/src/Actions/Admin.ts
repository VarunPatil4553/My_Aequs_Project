
import axios from 'axios';
import { toast } from 'react-toastify';
import {loginRequest,loginSuccess,loginFailure} from '../slices/Login';
import { useNavigate } from 'react-router-dom';


// admin login
export const adminLogin =(email: string, password: string)=> async(dispatch:any)  => {
    const navigate = useNavigate();
    try {
        dispatch(loginRequest);
        if(email === 'admin@gmail.com' || password === 'admin') {
        const response = await axios.post('http://localhost:5000/admin/login', { email, password });
        dispatch(loginSuccess(response.data));
        toast.success('Admin login successful');
        navigate('dashboard');
        }else{
            toast.error('Invalid email or password');
        }
    } catch (error:any) {
        dispatch(loginFailure(error.message));
        toast.error(error.message);
    }
}



