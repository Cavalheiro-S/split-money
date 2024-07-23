type ApiBase<T> = {
    data?: T,
    error?: string,
    message?: string,
    statusCode?: number,
    codeError?: string
}

type Pagination<T> = {
    data: T[],
    total: number
    page: number,
    count: number,
}