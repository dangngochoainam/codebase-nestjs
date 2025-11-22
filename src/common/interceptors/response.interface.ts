export interface BaseResponse {
    message: string;
    success: boolean;
    requestId: string;
    systemCode: string;
}

export interface SuccessResponse<T = any> extends BaseResponse {
    success: true;
    data: T;
}

export interface ErrorResponse extends BaseResponse {
    success: false;
}

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;
