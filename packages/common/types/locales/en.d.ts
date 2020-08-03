declare const _default: {
    validation: {
        auth: {
            register: {
                password: {
                    required: string;
                    minLength: string;
                    maxLength: string;
                    mismatch: string;
                };
            };
            login: {
                id: {
                    required: string;
                    minLength: string;
                    notFound: string;
                    wait: string;
                };
                password: {
                    required: string;
                    minLength: string;
                    maxLength: string;
                    wrong: string;
                };
            };
        };
        user: {
            email: {
                required: string;
                maxLength: string;
                email: string;
                duplicate: string;
            };
            public_name: {
                required: string;
                minLength: string;
                maxLength: string;
            };
            private_name: {
                required: string;
                minLength: string;
                maxLength: string;
            };
            user_name: {
                required: string;
                minLength: string;
                maxLength: string;
                duplicate: string;
            };
        };
        generic: {
            id: {
                required: string;
                uuid: string;
            };
            limit: {
                required: string;
                min: string;
            };
            offset: {
                required: string;
                min: string;
            };
            order: {
                invalid: string;
            };
        };
    };
};
export default _default;
