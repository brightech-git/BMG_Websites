import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '../../api/AuthService';

export const useResetPassword = () => {
    return useMutation({
        mutationFn: resetPassword,
    });
};
