import {LoginResponse} from '../../interfaces/Ilogin';

export class LoginHelper {

    public static saveToLocalStorage(loginResponse: LoginResponse) {
        localStorage.setItem('token', loginResponse.token);
        localStorage.setItem('userCurrent', JSON.stringify(loginResponse.userDTO));
    }
}
