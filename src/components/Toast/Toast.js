import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toast = (message, type) => {
    if (type === 'success') {
        toast.success(`${message} successfully!`);
    } else if (type === 'error') {
        toast.error(message);
    } else if (type === 'info') {
        toast.info(message);
    } else {
        toast(message);
    }
};

export default Toast;