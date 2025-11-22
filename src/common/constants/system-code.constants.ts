export const SYSTEM_CODE = {
    PLEASE_THROW_SYSTEM_CODE: 'PLEASE_THROW_SYSTEM_CODE',
    SORRY_SOMETHING_WENT_WRONG: 'SORRY_SOMETHING_WENT_WRONG',
    SUCCESS: 'SUCCESS',
    BAD_REQUEST: 'BAD_REQUEST',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
};

export const ERROR_MESSAGE: Record<keyof typeof SYSTEM_CODE, string> = {
    PLEASE_THROW_SYSTEM_CODE: 'Please throw system code',
    SORRY_SOMETHING_WENT_WRONG: 'Sorry, something went wrong',
    SUCCESS: 'Success',
    BAD_REQUEST: 'Bad Request',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden',
    NOT_FOUND: 'Not Found',
};
