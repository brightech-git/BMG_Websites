import { useMutation } from "@tanstack/react-query";
import { registerUser, loginUser } from "../../api/AuthService";

export const useRegister = () =>
    useMutation({
        mutationFn: registerUser,
    });

export const useLogin = () =>
    useMutation({
        mutationFn: loginUser,
    });
