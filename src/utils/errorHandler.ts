import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Utility function to throw custom HTTP errors.

 * @param {string} message - The error message to display if the condition fails.
 * @param {HttpStatus} status - The HTTP status code to return.
 */
export function AppError( status: HttpStatus = HttpStatus.BAD_REQUEST,message: string, ): void {
    
        throw new HttpException(
            {
                status,
                error: message,
            },
            status
        );
    
}
