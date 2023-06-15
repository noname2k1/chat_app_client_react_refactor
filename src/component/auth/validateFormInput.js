const validateFormInput = (
    e,
    isErrorRequired,
    setIsErrorRequired,
    isErrorPattern,
    setIsErrorPattern
) => {
    const { name, value } = e.target;
    const usernamePattern =
        /^(?=[a-zA-Z0-9._]{6,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/g;
    // const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/g;
    const passwordPattern = /.{6,}/g;
    //eslint-disable-next-line
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;
    switch (name) {
        case 'username':
            if (value.length === 0) {
                e.target.focus();
                return setIsErrorRequired({
                    ...isErrorRequired,
                    username: true,
                });
            }
            if (!value.match(usernamePattern)) {
                e.target.focus();
                return setIsErrorPattern({
                    ...isErrorPattern,
                    username: true,
                });
            }
            return setIsErrorRequired({
                ...isErrorRequired,
                username: false,
            });

        case 'password':
            if (value.length === 0) {
                e.target.focus();
                return setIsErrorRequired({
                    ...isErrorRequired,
                    password: true,
                });
            }
            if (!value.match(passwordPattern)) {
                e.target.focus();
                return setIsErrorPattern({
                    ...isErrorPattern,
                    password: true,
                });
            }
            return setIsErrorRequired({
                ...isErrorRequired,
                password: false,
            });
        case 'cfpassword':
            if (value.length === 0) {
                return setIsErrorRequired({
                    ...isErrorRequired,
                    cfpassword: true,
                });
            }
            const passValue = document.querySelector('input#password').value;
            if (value !== passValue) {
                return setIsErrorPattern({
                    ...isErrorRequired,
                    cfpassword: true,
                });
            }
            return setIsErrorPattern({
                ...isErrorRequired,
                cfpassword: false,
            });
        case 'email':
            if (value.length === 0) {
                e.target.focus();
                return setIsErrorRequired({
                    ...isErrorRequired,
                    email: true,
                });
            }
            if (!value.match(emailPattern)) {
                e.target.focus();
                return setIsErrorPattern({
                    ...isErrorPattern,
                    email: true,
                });
            }
            return setIsErrorPattern({
                ...isErrorRequired,
                email: false,
            });
        default:
            break;
    }
};
const removeValidateError = (
    e,
    isErrorRequired,
    setIsErrorRequired,
    isErrorPattern,
    setIsErrorPattern
) => {
    const { name } = e.target;
    switch (name) {
        case 'username':
            setIsErrorPattern({ ...isErrorPattern, username: false });
            setIsErrorRequired({ ...isErrorRequired, username: false });
            break;
        case 'password':
            setIsErrorPattern({ ...isErrorPattern, password: false });
            setIsErrorRequired({ ...isErrorRequired, password: false });
            break;
        case 'cfpassword':
            setIsErrorPattern({ ...isErrorPattern, cfpassword: false });
            setIsErrorRequired({ ...isErrorRequired, cfpassword: false });
            break;
        case 'email':
            setIsErrorPattern({ ...isErrorPattern, email: false });
            setIsErrorRequired({ ...isErrorRequired, email: false });
            break;
        default:
            break;
    }
};

export { validateFormInput, removeValidateError };
